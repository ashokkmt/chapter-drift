import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
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
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const [scale, setScale] = useState(1);

  useFrame(() => {
    if (groupRef.current) {
      // Calculate distance from camera to determine visibility/scale
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      
      // Calculate if this node is facing the camera
      const viewPos = worldPos.clone().project(camera);
      const zDepth = viewPos.z; // -1 (front) to 1 (back)
      
      // Scale based on depth: front = 1.0, back = 0.3
      const depthScale = THREE.MathUtils.lerp(1.0, 0.3, (zDepth + 1) / 2);
      setScale(depthScale);
    }
  });

  // Convert size (used for 3D) to pixel size for 2D circle
  const pixelSize = size * 140; // Larger base pixel size

  return (
    <group ref={groupRef} position={position}>
      <Html
        center
        distanceFactor={5}
        style={{
          opacity: scale > 0.4 ? 1 : scale / 0.4,
          pointerEvents: 'auto',
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) {
              onClick();
            }
          }}
          onMouseEnter={() => {
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onMouseLeave={() => {
            setHovered(false);
            document.body.style.cursor = "default";
          }}
          style={{
            width: `${pixelSize * scale}px`,
            height: `${pixelSize * scale}px`,
            borderRadius: "50%",
            backgroundColor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "600",
            fontSize: `${Math.max(12, pixelSize * scale * 0.18)}px`,
            textAlign: "center",
            padding: "10px",
            cursor: "pointer",
            transition: "transform 0.2s",
            transform: hovered ? "scale(1.1)" : "scale(1)",
            boxShadow: hovered 
              ? `0 0 20px ${color}80` 
              : `0 4px 10px rgba(0,0,0,0.3)`,
          }}
        >
          {chapter.name}
        </div>
      </Html>
    </group>
  );
}

function Globe({ chapters, onChapterClick }: { chapters: ChapterNode[], onChapterClick: (chapter: Chapter) => void }) {
  const globeRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-rotation when not interacting or hovering
  useFrame((state, delta) => {
    if (globeRef.current && !isInteracting && !isHovering) {
      globeRef.current.rotation.y += delta * 0.1; // Slow rotation
    }
  });

  return (
    <>
      <group 
        ref={globeRef}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => setIsHovering(false)}
      >
        {/* Main Globe - invisible but provides structure */}
        <Sphere args={[5, 64, 64]}>
          <meshStandardMaterial
            color="#0a0a0a"
            wireframe
            transparent
            opacity={0.03}
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
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.7} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      <pointLight position={[0, 0, 10]} intensity={0.8} />

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={12}
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        onStart={() => setIsInteracting(true)}
        onEnd={() => setIsInteracting(false)}
      />
    </>
  );
}

export default function ChapterGlobe({ data, onChapterClick }: Props) {
  // Memoize chapter nodes to prevent regeneration
  const chapterNodes = useMemo<ChapterNode[]>(() => {
    const globeRadius = 5.2;
    const sizeScale = (popularity: number) => {
      // Larger size range for 2D circles
      return 1.0 + (popularity / 100) * 1.2;
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
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <Globe chapters={chapterNodes} onChapterClick={onChapterClick} />
      </Canvas>
    </div>
  );
}
