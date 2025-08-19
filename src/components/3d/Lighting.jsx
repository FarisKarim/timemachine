import { Environment } from '@react-three/drei';

export const Lighting = ({ scrollProgressRef, isZoomedIn }) => {
  // Dynamic lighting that changes from dawn to dusk as user scrolls
  const scrollProgress = scrollProgressRef?.current ?? 0;
  const ambientIntensity = isZoomedIn ? 0.8 : (0.6 + scrollProgress * 0.3);
  const directionalIntensity = isZoomedIn ? 1.5 : (1.0 - scrollProgress * 0.2);
  const sunsetColor = `hsl(${30 + scrollProgress * 30}, 70%, ${70 - scrollProgress * 20}%)`;

  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={ambientIntensity} color="#f0f0f0" />
      
      {/* Main directional light (sun) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={directionalIntensity}
        color={isZoomedIn ? "#ffffff" : sunsetColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Rim light for depth */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={isZoomedIn ? 0.5 : 0.3}
        color="#a78bfa"
      />
      
      {/* Warm fill light - enhanced when zoomed */}
      <pointLight
        position={[0, 5, 5]}
        intensity={isZoomedIn ? 0.8 : 0.4}
        color="#fbbf24"
        distance={20}
        decay={2}
      />
      
      {/* Additional spotlight for zoom mode */}
      {isZoomedIn && (
        <spotLight
          position={[0, 8, 8]}
          angle={Math.PI / 6}
          penumbra={0.5}
          intensity={1}
          color="#ffffff"
          distance={20}
          decay={2}
          castShadow
        />
      )}
      
      {/* Environment mapping for realistic reflections */}
      <Environment
        preset={isZoomedIn ? "studio" : "sunset"}
        background={false}
        blur={0.5}
        intensity={isZoomedIn ? 0.5 : 0.3}
      />
    </>
  );
};