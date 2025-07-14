import { useGLTF } from '@react-three/drei'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Configure Draco loader for compressed models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')

// Configure GLTF loader with Draco
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Model paths configuration
export const MODEL_PATHS = {
  gameboy: '/models/gameboy.glb',
  // rubiksCube: '/models/rubiks-cube.glb', // Commented out - file missing
  // hotWheels: '/models/hot-wheels.glb',   // Commented out - file missing  
  // tamagotchi: '/models/tamagotchi.glb',  // Commented out - file missing
  // lego: '/models/lego-brick.glb'         // Commented out - file missing
}

// Preload all models
export const preloadModels = () => {
  Object.values(MODEL_PATHS).forEach(path => {
    useGLTF.preload(path, true) // true enables draco
  })
}

// Custom hook for loading models with error handling
export const useModel = (modelPath) => {
  const { scene, materials, animations } = useGLTF(modelPath, true)
  return { scene: scene?.clone(), materials, animations, error: null }
}

// Model scale configurations
export const MODEL_SCALES = {
  gameboy: [25.0, 25.0, 25.0],
  rubiksCube: [0.3, 0.3, 0.3],
  hotWheels: [0.4, 0.4, 0.4],
  tamagotchi: [0.35, 0.35, 0.35],
  lego: [0.25, 0.25, 0.25]
}

// Model rotation configurations for proper orientation
export const MODEL_ROTATIONS = {
  gameboy: [0, 0, 0],
  rubiksCube: [0.2, 0.3, 0],
  hotWheels: [0, Math.PI / 2, 0],
  tamagotchi: [0, 0, 0],
  lego: [0, 0.4, 0]
}

// Optimize model on load
export const optimizeModel = (scene) => {
  scene.traverse((child) => {
    if (child.isMesh) {
      // Enable shadows
      child.castShadow = true
      child.receiveShadow = true
      
      // Optimize materials
      if (child.material) {
        child.material.metalness = 0.3
        child.material.roughness = 0.7
      }
    }
  })
  return scene
}