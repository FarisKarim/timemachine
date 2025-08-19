import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import soundManager from '../../utils/soundManager';
import { SuspendedModel } from './Model';
import { MODEL_PATHS, MODEL_SCALES, MODEL_ROTATIONS } from '../../utils/modelLoader';

export const NostalgicObject = ({ object, onObjectClick, isSelected, isZoomedIn }) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Floating animation
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      if (isSelected && isZoomedIn) {
        // Enhanced animations when selected - only subtle floating
        const baseY = object.position[1];
        meshRef.current.position.y = baseY + Math.sin(time * 0.8) * 0.2;
        
        // Auto rotation when focused - faster for iPod
        const rotationSpeed = object.type === 'ipod' ? 0.01 : 0.003;
        meshRef.current.rotation.y += rotationSpeed;
        
        // Larger scale when selected
        const targetScale = object.scale * 1.8;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
        
      } else {
        // Normal floating motion
        const baseY = object.position[1];
        meshRef.current.position.y = baseY + Math.sin(time * 0.5 + object.position[0]) * 0.15;
        
        // Subtle rotation
        meshRef.current.rotation.y = Math.sin(time * 0.3 + object.position[0]) * 0.1;
        meshRef.current.rotation.x = 0;
        
        // Hover effects
        const targetScale = hovered ? object.scale * 1.2 : object.scale;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }
      
      // Glow effect
      if (glowRef.current) {
        glowRef.current.visible = hovered || (isSelected && isZoomedIn);
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onObjectClick?.(object);
  };

  // Get model configuration
  const modelPath = MODEL_PATHS[object.type];
  const modelScale = MODEL_SCALES[object.type] || [1, 1, 1];
  const modelRotation = MODEL_ROTATIONS[object.type] || [0, 0, 0];
  
  // Calculate glow size - keep it reasonable regardless of model scale
  const glowSize = modelPath ? 2.0 : 1.4; // Fixed size for glow effect

  // Position object at better location when zoomed in
  const displayPosition = (isSelected && isZoomedIn) 
    ? [2, 0, 0] // Good central position for rotation
    : object.position;

  // Hide non-selected objects when zoomed in
  const isVisible = !isZoomedIn || isSelected;

  return (
    <group ref={meshRef} position={displayPosition} visible={isVisible}>
      {/* Invisible hitbox for interaction */}
      <mesh
        visible={false}
        position={object.type === 'gameboy' ? [0, 1.0, 0] : [0, 0, 0]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
          soundManager.playHover();
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        onClick={handleClick}
      >
        <boxGeometry args={[glowSize, glowSize, glowSize]} />
      </mesh>

      {/* Model or fallback geometry - NO interaction events */}
      <group scale={modelScale} rotation={modelRotation}>
        {modelPath ? (
          <group rotation={object.type === 'gameboy' && hovered ? [-0.1, 0, 0] : [0, 0, 0]}>
            <SuspendedModel
              modelPath={modelPath}
              objectType={object.type}
              fallbackColor={object.color}
              fallbackScale={[1, 1, 1]}
              isHovered={hovered}
              isSelected={isSelected && isZoomedIn}
              castShadow
              receiveShadow
              raycast={() => null}
            />
            {/* Model glow effect when hovered */}
            {hovered && (
              <pointLight
                color={object.color}
                intensity={2}
                distance={5}
                position={[0, 0, 0]}
              />
            )}
          </group>
        ) : (
          <mesh castShadow receiveShadow raycast={() => null}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={object.color}
              roughness={isSelected && isZoomedIn ? 0.2 : 0.4}
              metalness={isSelected && isZoomedIn ? 0.4 : 0.2}
              emissive={hovered || (isSelected && isZoomedIn) ? object.color : '#000000'}
              emissiveIntensity={isSelected && isZoomedIn ? 0.3 : (hovered ? 0.15 : 0)}
            />
          </mesh>
        )}
      </group>
      
      {/* Enhanced glow effect - only for non-model objects (cubes) */}
      {!modelPath && (
        <mesh ref={glowRef} visible={false} raycast={() => null}>
          <boxGeometry args={[glowSize, glowSize, glowSize]} />
          <meshBasicMaterial
            color={object.color}
            transparent
            opacity={isSelected && isZoomedIn ? 0.5 : 0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Object label - hide when zoomed for cleaner view */}
      {!isZoomedIn && (
        <Text
          position={
            object.type === 'imacG3' ? [-1.2, -1, 0] : 
            object.type === 'ipod' ? [0, -1.8, 0] : 
            [0, -1, 0]
          }
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {object.name}
        </Text>
      )}
      
      {/* GameBoy SP screen glow effect */}
      {object.type === 'gameboy' && isSelected && isZoomedIn && (
        <pointLight
          position={[0.2, 0.1, 0.5]}
          color="#7dd3fc"
          intensity={0.8}
          distance={3}
          decay={2}
        />
      )}
    </group>
  );
};