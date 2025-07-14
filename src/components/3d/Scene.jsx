import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Lighting } from './Lighting';
import { Timeline } from './Timeline';
import { Camera } from './Camera';
import { preloadModels } from '../../utils/modelLoader';

export const Scene = ({ onObjectClick, scrollProgress, scrollProgressRef, selectedObject, isZoomedIn, isMobile }) => {
  useEffect(() => {
    // Preload all models
    preloadModels();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        shadows
        camera={{ 
          position: [0, 2, 8], 
          fov: isMobile ? 85 : 75 // Wider FOV for mobile
        }}
        gl={{ 
          antialias: !isMobile, // Disable antialiasing on mobile for performance
          alpha: false,
          powerPreference: isMobile ? "default" : "high-performance"
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower DPR on mobile
      >
        <Suspense fallback={null}>
          <Camera 
            scrollProgress={scrollProgress}
            scrollProgressRef={scrollProgressRef}
            selectedObject={selectedObject}
            isZoomedIn={isZoomedIn}
          />
          
          {/* OrbitControls only when zoomed in */}
          {isZoomedIn && selectedObject && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              target={selectedObject.position}
              minDistance={isMobile ? 1.5 : 2}
              maxDistance={isMobile ? 6 : 8}
              maxPolarAngle={Math.PI * 0.85}
              minPolarAngle={Math.PI * 0.15}
              rotateSpeed={isMobile ? 0.3 : 0.5}
              zoomSpeed={isMobile ? 0.3 : 0.5}
              enableDamping={true}
              dampingFactor={0.05}
              touches={{
                ONE: isMobile ? 1 : 0, // ROTATE
                TWO: isMobile ? 2 : 0  // DOLLY (zoom)
              }}
            />
          )}
          
          <Lighting 
            scrollProgress={scrollProgress}
            isZoomedIn={isZoomedIn}
          />
          <Timeline 
            onObjectClick={onObjectClick}
            selectedObject={selectedObject}
            isZoomedIn={isZoomedIn}
          />
          
        </Suspense>
      </Canvas>
    </div>
  );
};