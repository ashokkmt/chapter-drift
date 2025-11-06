import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

const getPositionOnSphere = (index: number, total: number, radius: number): [number, number, number] => {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  
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
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
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
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      {hovered && (
        <Html distanceFactor={15}>
          <div className="bg-card/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-border shadow-lg whitespace-nowrap pointer-events-none">
            <p className="text-sm font-semibold text-foreground">{chapter.name}</p>
            <p className="text-xs text-muted-foreground">{chapter.region}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function Globe({ chapters, onChapterClick }: { chapters: ChapterNode[], onChapterClick: (chapter: Chapter) => void }) {
  const globeRef = useRef<THREE.Mesh>(null);

  return (
    <>
      {/* Main Globe */}
      <Sphere ref={globeRef} args={[5, 64, 64]}>
        <meshStandardMaterial
          color="#0a0a0a"
          wireframe
          transparent
          opacity={0.1}
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

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={8}
        maxDistance={20}
        rotateSpeed={0.5}
      />
    </>
  );
}

export default function ChapterGlobe({ data, onChapterClick }: Props) {
  // Memoize chapter nodes to prevent regeneration
  const chapterNodes = useMemo<ChapterNode[]>(() => {
    const globeRadius = 6;
    const sizeScale = (popularity: number) => {
      return 0.15 + (popularity / 100) * 0.25;
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
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <Globe chapters={chapterNodes} onChapterClick={onChapterClick} />
      </Canvas>
    </div>
  );
}
