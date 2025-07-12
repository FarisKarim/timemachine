import { nostalgicObjects } from '../../data/objects';
import { NostalgicObject } from './NostalgicObject';

export const Timeline = ({ onObjectClick, selectedObject, isZoomedIn }) => {
  return (
    <group>
      {/* Timeline objects */}
      {nostalgicObjects.map((object) => (
        <NostalgicObject
          key={object.id}
          object={object}
          onObjectClick={onObjectClick}
          isSelected={selectedObject?.id === object.id}
          isZoomedIn={isZoomedIn}
        />
      ))}
      
      {/* Ground plane for shadows - fade out when zoomed */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -3, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial 
          color="#0f172a" 
          transparent 
          opacity={isZoomedIn ? 0.3 : 0.8}
        />
      </mesh>
      
      {/* Atmospheric particles - reduce when zoomed for focus */}
      <group>
        {Array.from({ length: isZoomedIn ? 5 : 15 }, (_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 25,
              Math.random() * 8 + 1,
              (Math.random() - 0.5) * 12
            ]}
          >
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial 
              color="#fbbf24" 
              transparent 
              opacity={isZoomedIn ? 0.2 : 0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};