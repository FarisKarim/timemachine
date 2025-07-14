import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export const Camera = ({ scrollProgress, scrollProgressRef, selectedObject, isZoomedIn }) => {
  const cameraRef = useRef();
  const hasZoomedRef = useRef(false);
  
  // Instant zoom when object is selected
  if (isZoomedIn && selectedObject && cameraRef.current && !hasZoomedRef.current) {
    const objectPos = selectedObject.position;
    const targetX = objectPos[0];
    const targetY = objectPos[1] + 2;
    const targetZ = objectPos[2] + (selectedObject.type === 'gameboy' ? 8 : 4);
    
    // Set camera position instantly
    cameraRef.current.position.set(targetX, targetY, targetZ);
    cameraRef.current.lookAt(objectPos[0], objectPos[1], objectPos[2]);
    cameraRef.current.fov = 60;
    cameraRef.current.updateProjectionMatrix();
    hasZoomedRef.current = true;
  }

  useFrame((state, delta) => {
    if (cameraRef.current && !isZoomedIn) {
      // COMPLETELY DISABLE CAMERA WHEN ZOOMED IN - LET ORBITCONTROLS HANDLE EVERYTHING
      // Reset zoom flag
      hasZoomedRef.current = false;
      
      // Normal timeline navigation - use ref for immediate response
      const currentProgress = scrollProgressRef?.current ?? scrollProgress;
      const targetX = currentProgress * 15 - 7.5;
      const targetY = 2 + Math.sin(currentProgress * Math.PI) * 0.5;
      const targetZ = 8 - currentProgress * 2;
      
      // Instant camera positioning for smooth scrolling
      cameraRef.current.position.x = targetX;
      cameraRef.current.position.y = targetY;
      cameraRef.current.position.z = targetZ;
      
      // Look at timeline center
      cameraRef.current.lookAt(targetX, 0, 0);
      
      // Restore normal FOV
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
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