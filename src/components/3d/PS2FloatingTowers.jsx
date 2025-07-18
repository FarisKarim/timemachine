import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PS2CrystallineTower = ({ position, rotation, scale, color }) => {
  const meshRef = useRef();
  const glowRef = useRef();
  
  // Create crystalline tower geometry - irregular box clusters
  const geometry = useMemo(() => {
    const group = new THREE.Group();
    
    // Main tower block
    const mainGeometry = new THREE.BoxGeometry(1, 2, 1);
    const mainMesh = new THREE.Mesh(mainGeometry);
    mainMesh.position.set(0, 0, 0);
    group.add(mainMesh);
    
    // Additional crystalline fragments
    for (let i = 0; i < 3; i++) {
      const fragmentGeometry = new THREE.BoxGeometry(
        0.3 + Math.random() * 0.4,
        0.3 + Math.random() * 0.4,
        0.3 + Math.random() * 0.4
      );
      const fragmentMesh = new THREE.Mesh(fragmentGeometry);
      fragmentMesh.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      );
      fragmentMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      group.add(fragmentMesh);
    }
    
    // Merge geometries
    const mergedGeometry = new THREE.BufferGeometry();
    const geometries = [];
    group.children.forEach(child => {
      const clonedGeometry = child.geometry.clone();
      clonedGeometry.applyMatrix4(child.matrix);
      geometries.push(clonedGeometry);
    });
    
    return THREE.BufferGeometryUtils ? 
      THREE.BufferGeometryUtils.mergeGeometries(geometries) : 
      mainGeometry;
  }, []);
  
  // Create glass-like material
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      roughness: 0.0,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      transmission: 0.8,
      ior: 1.5,
      thickness: 0.5,
      envMapIntensity: 1.0
    });
  }, [color]);
  
  // Animate tower
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
      
      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
    
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main crystalline tower */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      />
      
      {/* Inner glow */}
      <mesh
        ref={glowRef}
        geometry={geometry}
        scale={[0.9, 0.9, 0.9]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh
        geometry={geometry}
        scale={[1.1, 1.1, 1.1]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  );
};


export const PS2FloatingTowers = ({ isVisible }) => {
  const groupRef = useRef();
  
  // Define tower positions and colors to match authentic PS2 boot screen
  // Positioned further away to avoid intersecting with PS2 console
  // All towers use the same blue-gray color like the authentic PS2 boot screen
  const towers = useMemo(() => [
    { position: [-8, 0, -6], color: '#8BB5E8', scale: [0.8, 1.2, 0.8] },
    { position: [7, 1, -8], color: '#8BB5E8', scale: [1.0, 1.8, 1.0] },
    { position: [-6, -1, 7], color: '#8BB5E8', scale: [0.6, 1.0, 0.6] },
    { position: [8, -0.5, 6], color: '#8BB5E8', scale: [0.9, 1.5, 0.9] },
    { position: [0, 2, -10], color: '#8BB5E8', scale: [0.7, 1.1, 0.7] },
    { position: [-7, 0.5, -3], color: '#8BB5E8', scale: [0.8, 1.3, 0.8] },
    { position: [3, -1.5, 8], color: '#8BB5E8', scale: [0.5, 0.9, 0.5] },
    { position: [6, 1.5, 3], color: '#8BB5E8', scale: [1.1, 1.6, 1.1] }
  ], []);
  
  
  // Slow group rotation
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y += 0.003;
    }
  });
  
  if (!isVisible) return null;
  
  return (
    <group ref={groupRef}>
      {/* Authentic PS2 Crystalline Towers */}
      {towers.map((tower, index) => (
        <PS2CrystallineTower
          key={index}
          position={tower.position}
          rotation={[
            Math.random() * 0.3,
            Math.random() * Math.PI * 2,
            Math.random() * 0.3
          ]}
          scale={tower.scale}
          color={tower.color}
        />
      ))}
      
      
      {/* Ambient Environmental Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight
        position={[0, 8, 0]}
        intensity={0.8}
        color="#FFFFFF"
        distance={25}
        decay={2}
      />
      <pointLight
        position={[-10, 3, -10]}
        intensity={0.3}
        color="#4A90E2"
        distance={15}
      />
      <pointLight
        position={[10, 3, 10]}
        intensity={0.3}
        color="#7B68EE"
        distance={15}
      />
      
      {/* Background Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(Array.from({ length: 150 }, () => [
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 50
            ]).flat())}
            count={150}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#FFFFFF"
          transparent
          opacity={0.3}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
};