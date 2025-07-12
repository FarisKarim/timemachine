import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export const Camera = ({ scrollProgress, selectedObject, isZoomedIn }) => {
  const cameraRef = useRef();
  const hasZoomedRef = useRef(false);

  useFrame((state, delta) => {
    if (cameraRef.current) {
      if (isZoomedIn && selectedObject) {
        // Initial zoom to selected object (only once)
        const objectPos = selectedObject.position;
        
        if (!hasZoomedRef.current) {
          // Initial camera position for zoom
          const targetX = objectPos[0];
          const targetY = objectPos[1] + 2;
          const targetZ = objectPos[2] + 4;
          
          // Smooth cinematic interpolation
          cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
          cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
          cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.05;
          
          // Check if we're close enough to consider zoom complete
          const distance = cameraRef.current.position.distanceTo(
            new THREE.Vector3(targetX, targetY, targetZ)
          );
          if (distance < 0.1) {
            hasZoomedRef.current = true;
          }
        }
        
        // Always look at the selected object
        cameraRef.current.lookAt(objectPos[0], objectPos[1], objectPos[2]);
        
        // Dynamic FOV for dramatic effect
        const targetFov = 60; // Tighter FOV for intimate view
        cameraRef.current.fov += (targetFov - cameraRef.current.fov) * 0.05;
        cameraRef.current.updateProjectionMatrix();
        
      } else {
        // Reset zoom flag
        hasZoomedRef.current = false;
        
        // Normal timeline navigation
        const targetX = scrollProgress * 15 - 7.5;
        const targetY = 2 + Math.sin(scrollProgress * Math.PI) * 0.5;
        const targetZ = 8 - scrollProgress * 2;
        
        // Smooth interpolation back to timeline view
        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
        cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
        cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.05;
        
        // Look at timeline center
        cameraRef.current.lookAt(targetX, 0, 0);
        
        // Restore normal FOV
        const targetFov = 75;
        cameraRef.current.fov += (targetFov - cameraRef.current.fov) * 0.05;
        cameraRef.current.updateProjectionMatrix();
      }
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={75}
      near={0.1}
      far={1000}
      position={[0, 2, 8]}
    />
  );
};