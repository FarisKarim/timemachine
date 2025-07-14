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
      
    </group>
  );
};