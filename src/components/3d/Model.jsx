import { Suspense, useMemo, useRef, useEffect } from 'react'
import { Box, useAnimations } from '@react-three/drei'
import { useModel } from '../../utils/modelLoader'
import { optimizeModel as optimizeModelGeometry } from '../../utils/modelOptimizer'

const LoadingFallback = ({ color = '#ff6b6b', scale = [1, 1, 1] }) => (
  <Box args={scale} castShadow receiveShadow>
    <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
  </Box>
)

const ErrorFallback = ({ color = '#ff6b6b', scale = [1, 1, 1] }) => (
  <Box args={scale} castShadow receiveShadow>
    <meshStandardMaterial 
      color={color} 
      metalness={0.3} 
      roughness={0.7}
      emissive={color}
      emissiveIntensity={0.2}
    />
  </Box>
)

export const Model = ({ 
  modelPath, 
  objectType,
  fallbackColor = '#ff6b6b',
  fallbackScale = [1, 1, 1],
  onLoad,
  isHovered = false,
  isSelected = false,
  children,
  ...props 
}) => {
  const { scene, materials, animations, error } = useModel(modelPath)
  const groupRef = useRef()
  
  // Debug: Check if animations exist
  if (animations && animations.length > 0) {
    console.log(`Found ${animations.length} animations in ${modelPath}:`, animations.map(a => a.name));
  }
  
  const optimizedScene = useMemo(() => {
    if (!scene) return null
    const clonedScene = scene.clone()
    const optimized = optimizeModelGeometry(clonedScene, objectType)
    if (onLoad) onLoad(optimized)
    return optimized
  }, [scene, objectType, onLoad])

  // Animation controls - only if animations exist
  const { actions } = useAnimations(animations && animations.length > 0 ? animations : [], groupRef)
  
  useEffect(() => {
    if (actions && actions['Take 001']) {
      const action = actions['Take 001']
      
      if (isHovered || isSelected) {
        // Play animation forward (open)
        action.reset()
        action.setLoop(2201, 1) // Play once
        action.clampWhenFinished = true
        action.play()
      } else {
        // Play animation backward (close) - or just reset
        action.reset()
        action.paused = true
        action.time = 0
      }
    }
  }, [actions, isHovered, isSelected])

  if (error) {
    console.warn(`Using fallback for model: ${modelPath}`)
    return <ErrorFallback color={fallbackColor} scale={fallbackScale} />
  }

  if (!optimizedScene) {
    return <LoadingFallback color={fallbackColor} scale={fallbackScale} />
  }

  return (
    <group ref={groupRef} {...props}>
      <primitive object={optimizedScene}>
        {children}
      </primitive>
    </group>
  )
}

export const SuspendedModel = (props) => (
  <Suspense fallback={<LoadingFallback color={props.fallbackColor} scale={props.fallbackScale} />}>
    <Model {...props} />
  </Suspense>
)