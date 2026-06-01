import { OrbitControls, Sphere, Ring, Points, PointMaterial } from '@react-three/drei';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

function ClickBurst({ position, onComplete }: { position: THREE.Vector3, onComplete: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const startTime = useRef(performance.now());
  
  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;
    const elapsed = (performance.now() - startTime.current) / 1000;
    if (elapsed > 0.8) {
      onComplete();
      return;
    }
    const scale = 1 + elapsed * 4;
    meshRef.current.scale.setScalar(scale);
    materialRef.current.opacity = 1 - (elapsed / 0.8);
  });
  
  return (
    <mesh position={position} ref={meshRef}>
      <ringGeometry args={[0.05, 0.1, 32]} />
      <meshBasicMaterial ref={materialRef} color="#ffffff" transparent opacity={1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function BlackHoleCore() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const ring4Ref = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const [bursts, setBursts] = useState<{ id: number, pos: THREE.Vector3 }[]>([]);
  const burstCounter = useRef(0);

  const handleRingClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!groupRef.current) return;
    const localPos = groupRef.current.worldToLocal(e.point.clone());
    setBursts(prev => [...prev, { id: ++burstCounter.current, pos: localPos }]);
  };

  const removeBurst = (id: number) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  };

  // Generate random particles for the emerging galaxy
  const particlesCount = 8000;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);
    
    // Convert hex colors to THREE.Color internally
    const colorInside = new THREE.Color('#0ea5e9'); // cyan
    const colorOutside = new THREE.Color('#9333ea'); // purple
    
    const arms = 3; // 3 spiral arms
    const spin = 2.5; // How tightly wound the spiral is
    const randomness = 0.5; // Spread of stars from the arm
    const randomnessPower = 3;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 5 + 1.3;
      
      const spinAngle = radius * spin; // Further out = more spin
      const branchAngle = ((i % arms) / arms) * Math.PI * 2;
      
      const rx = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      const ry = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius * 0.15;
      const rz = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      
      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + rx;
      pos[i3 + 1] = ry;
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rz;

      // Color mapping
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, (radius - 1.3) / 5);
      col[i3] = mixedColor.r;
      col[i3 + 1] = mixedColor.g;
      col[i3 + 2] = mixedColor.b;
    }
    return { positions: pos, colors: col };
  }, [particlesCount]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Move and wobble the black hole entirely
      groupRef.current.position.x = Math.sin(t * 0.3) * 0.15;
      groupRef.current.position.y = Math.cos(t * 0.4) * 0.15;
      groupRef.current.position.z = Math.sin(t * 0.2) * 0.1;
      
      groupRef.current.rotation.x = Math.PI / 6 + Math.sin(t * 0.5) * 0.05;
      groupRef.current.rotation.y = Math.cos(t * 0.3) * 0.05;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.sin(t * 0.6) * 0.2;
      ring1Ref.current.rotation.y = Math.cos(t * 0.5) * 0.2;
      ring1Ref.current.rotation.z = t * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.cos(t * 0.4) * 0.3;
      ring2Ref.current.rotation.y = Math.sin(t * 0.7) * 0.3;
      ring2Ref.current.rotation.z = -t * 0.25;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.sin(t * 0.8) * 0.1;
      ring3Ref.current.rotation.y = Math.cos(t * 0.3) * 0.4;
      ring3Ref.current.rotation.z = t * 0.15;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.x = t * 0.5;
      ring4Ref.current.rotation.y = Math.sin(t) * 0.5;
      ring4Ref.current.rotation.z = t * 0.3;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Event Horizon (Pure Black Sphere) */}
      <Sphere args={[1.2, 64, 64]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>

      {/* Photon Ring (Very thin bright outline just outside the black hole) */}
      <Sphere args={[1.25, 64, 64]}>
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.15} side={THREE.BackSide} />
      </Sphere>

      {/* New Thin One-Color Ring Inner */}
      <group ref={ring4Ref}>
        <Ring args={[1.28, 1.30, 64]} onClick={handleRingClick}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} side={THREE.DoubleSide} />
        </Ring>
      </group>

      <group ref={ring1Ref}>
        {/* Ring 1 */}
        <Ring args={[1.4, 1.5, 64]} onClick={handleRingClick}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} side={THREE.DoubleSide} />
        </Ring>
      </group>
      
      <group ref={ring2Ref}>
        {/* Ring 2 */}
        <Ring args={[1.8, 2.0, 64]} onClick={handleRingClick}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} side={THREE.DoubleSide} />
        </Ring>
      </group>

      <group ref={ring3Ref}>
        {/* Ring 3 */}
        <Ring args={[2.3, 2.6, 64]} onClick={handleRingClick}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} side={THREE.DoubleSide} />
        </Ring>
      </group>

      {bursts.map(b => (
        <ClickBurst key={b.id} position={b.pos} onComplete={() => removeBurst(b.id)} />
      ))}

      {/* Emerging Spiral Galaxy */}
      <Points ref={particlesRef} positions={positions} colors={colors}>
        <PointMaterial
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
          transparent
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full opacity-60 dark:opacity-100">
      <Canvas camera={{ position: [0, 8, 12], fov: 35 }}>
        <ambientLight intensity={0.1} />
        <BlackHoleCore />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.3} 
          maxPolarAngle={Math.PI / 2 + 0.2} 
          minPolarAngle={Math.PI / 2 - 0.5} 
        />
      </Canvas>
    </div>
  );
}
