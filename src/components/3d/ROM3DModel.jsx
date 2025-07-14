import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SuspendedModel } from './Model';

const ROM3DModel = ({ game, isHovered, isSelected, onClick, position = [0, 0, 0] }) => {
  const meshRef = useRef();
  const [currentScale, setCurrentScale] = useState(1);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.001;
      
      // Scale animation on hover/selection
      const targetScale = isSelected ? 1.2 : isHovered ? 1.1 : 1;
      setCurrentScale(prev => prev + (targetScale - prev) * delta * 8);
      meshRef.current.scale.setScalar(currentScale);
      
      // Gentle Y rotation
      meshRef.current.rotation.y += delta * 1.0;
    }
  });

  const fallbackColor = new THREE.Color(game.cartridgeColor);

  return (
    <group ref={meshRef} position={position}>
      <group scale={game.model?.scale || [25.0, 25.0, 25.0]} rotation={game.model?.rotation || [0, 0, 0]} position={game.model?.position || [0, -0.3, 0]}>
        {game.model ? (
          <React.Suspense fallback={
            <mesh onClick={onClick}>
              <boxGeometry args={[0.8, 0.5, 0.1]} />
              <meshStandardMaterial color={fallbackColor} roughness={0.7} metalness={0.1} />
            </mesh>
          }>
            <SuspendedModel
              modelPath={game.model.path}
              objectType={game.id}
              fallbackColor={fallbackColor}
              fallbackScale={[0.8, 0.5, 0.1]}
              isHovered={isHovered}
              isSelected={isSelected}
              castShadow
              receiveShadow
              onClick={onClick}
            />
          </React.Suspense>
        ) : (
          <mesh 
            onClick={onClick}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'auto';
            }}
          >
            <boxGeometry args={[0.8, 0.5, 0.1]} />
            <meshStandardMaterial color={fallbackColor} roughness={0.7} metalness={0.1} />
          </mesh>
        )}
      </group>
    </group>
  );
};

export default ROM3DModel;