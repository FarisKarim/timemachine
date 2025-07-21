import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Lighting } from './Lighting';
import { Timeline } from './Timeline';
import { Camera } from './Camera';
import { PS2FloatingTowers } from './PS2FloatingTowers';
import { preloadModels } from '../../utils/modelLoader';

export const Scene = ({ onObjectClick, scrollProgress, scrollProgressRef, selectedObject, isZoomedIn, isMobile, selectedIMacColor }) => {
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
        {/* Dynamic scene background based on selected object */}
        <color 
          attach="background" 
          args={[
            selectedObject?.type === 'gameboy' && isZoomedIn 
              ? '#4c1d95'  // Deep royal purple (Pokémon intro vibes)
              : selectedObject?.type === 'imacG3' && isZoomedIn 
              ? selectedIMacColor || '#0369a1'  // Dynamic iMac G3 color
              : selectedObject?.type === 'tamagotchi' && isZoomedIn 
              ? '#FFB6C1'  // Soft pastel pink (kawaii aesthetic)
              : selectedObject?.type === 'ps2' && isZoomedIn 
              ? '#000011'  // PS2 deep space void
              : selectedObject?.type === 'ipod' && isZoomedIn 
              ? '#1e3a8a'  // iPod blue
              : '#000000'  // Default black
          ]} 
        />
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
              target={[2, 0, 0]}
              minDistance={isMobile ? 3 : 4}
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
          
          {/* PS2 Floating Towers - only visible when PS2 is selected */}
          {selectedObject?.type === 'ps2' && isZoomedIn && (
            <PS2FloatingTowers 
              isVisible={true}
              onTowerClick={(tower) => console.log('Tower clicked:', tower)}
            />
          )}
          
        </Suspense>
      </Canvas>
    </div>
  );
};