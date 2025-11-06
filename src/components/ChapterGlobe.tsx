import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Text } from "@react-three/drei";
import * as THREE from "three";
import { Chapter } from "@/types/owasp";

interface Props {
  data: Chapter[];
  onChapterClick: (chapter: Chapter) => void;
}

interface ChapterNode extends Chapter {
  position: [number, number, number];
  color: string;
  size: number;
}

// Region colors matching the design system
const REGION_COLORS: Record<string, string> = {
  "North America": "#FF6B35",
  "Europe": "#4ECDC4",
  "Asia Pacific": "#FF6B9D",
  "Latin America": "#95E1D3",
  "Middle East & Africa": "#F38181",
};

// Distribute points more evenly using Fibonacci sphere
const getPositionOnSphere = (index: number, total: number, radius: number): [number, number, number] => {
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;
  
  const theta = angleIncrement * index;
  const phi = Math.acos(1 - 2 * (index + 0.5) / total);
  
  return [
    radius * Math.cos(theta) * Math.sin(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(phi),
  ];
};

function ChapterNode({ 
  chapter, 
  position, 
  color, 
  size, 
  onClick 
}: { 
  chapter: Chapter; 
  position: [number, number, number]; 
  color: string; 
  size: number;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      // Calculate distance from camera (Z-axis in view space)
      const worldPos = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPos);
      
      // Transform to view space
      const viewPos = worldPos.clone().project(camera);
      const zDepth = viewPos.z; // -1 (front) to 1 (back)
      
      // Scale based on depth: front = 1.0, back = 0.15
      const depthScale = THREE.MathUtils.lerp(1.0, 0.15, (zDepth + 1) / 2);
      const finalScale = depthScale * (hovered ? 1.2 : 1);
      
      meshRef.current.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 0.1);
      
      // Text visibility and scale based on depth
      if (textRef.current) {
        const textVisible = zDepth < 0.3; // Only show text when reasonably front-facing
        textRef.current.visible = textVisible;
        if (textVisible) {
          const textScale = Math.max(0.3, depthScale * 0.8);
          textRef.current.scale.set(textScale, textScale, textScale);
        }
        
        // Always face camera
        textRef.current.quaternion.copy(camera.quaternion);
      }
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Chapter Name Text */}
      <Text
        ref={textRef}
        position={[0, 0, size + 0.05]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {chapter.name}
      </Text>
    </group>
  );
}

function Globe({ chapters, onChapterClick }: { chapters: ChapterNode[], onChapterClick: (chapter: Chapter) => void }) {
  const globeRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Auto-rotation when not interacting
  useFrame((state, delta) => {
    if (globeRef.current && !isInteracting) {
      globeRef.current.rotation.y += delta * 0.1; // Slow rotation
    }
  });

  return (
    <>
      <group ref={globeRef}>
        {/* Main Globe - invisible but provides structure */}
        <Sphere args={[5.2, 64, 64]}>
          <meshStandardMaterial
            color="#0a0a0a"
            wireframe
            transparent
            opacity={0.05}
          />
        </Sphere>

        {/* Chapter Nodes */}
        {chapters.map((chapter) => (
          <ChapterNode
            key={chapter.id}
            chapter={chapter}
            position={chapter.position}
            color={chapter.color}
            size={chapter.size}
            onClick={() => onChapterClick(chapter)}
          />
        ))}
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.6} />
      <pointLight position={[0, 10, 0]} intensity={0.4} />

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={10}
        maxDistance={25}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        onStart={() => setIsInteracting(true)}
        onEnd={() => setIsInteracting(false)}
      />
    </>
  );
}

export default function ChapterGlobe({ data, onChapterClick }: Props) {
  // Memoize chapter nodes to prevent regeneration
  const chapterNodes = useMemo<ChapterNode[]>(() => {
    const globeRadius = 5.5;
    const sizeScale = (popularity: number) => {
      // Larger base size for better visibility
      return 0.3 + (popularity / 100) * 0.5;
    };

    return data.map((chapter, index) => ({
      ...chapter,
      position: getPositionOnSphere(index, data.length, globeRadius),
      color: REGION_COLORS[chapter.region] || "#4ECDC4",
      size: sizeScale(chapter.popularity),
    }));
  }, [data]);

  return (
    <div className="w-full h-full bg-background">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <Globe chapters={chapterNodes} onChapterClick={onChapterClick} />
      </Canvas>
    </div>
  );
}
