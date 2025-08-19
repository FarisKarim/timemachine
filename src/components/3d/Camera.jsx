import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export const Camera = ({ scrollProgressRef, selectedObject, isZoomedIn }) => {
  const cameraRef = useRef();
  const hasZoomedRef = useRef(false);
  
  // Instant zoom when object is selected
  if (isZoomedIn && selectedObject && cameraRef.current && !hasZoomedRef.current) {
    // Fixed positioning for all objects - same position regardless of timeline location
    const targetX = 5.5;  // Move camera further right to offset the view
    const targetY = 0.5;  // Adjust height for better angle
    const targetZ = 8;    // Fixed distance (zoomed out)
    
    // Fixed display position when zoomed in
    const displayPosition = [2, 0, 0];
    
    // Set camera position instantly
    cameraRef.current.position.set(targetX, targetY, targetZ);
    cameraRef.current.lookAt(displayPosition[0], displayPosition[1], displayPosition[2]);
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
      const currentProgress = scrollProgressRef?.current ?? 0;
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