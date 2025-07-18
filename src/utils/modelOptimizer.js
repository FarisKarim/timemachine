import * as THREE from 'three';

// Material optimization settings
const MATERIAL_SETTINGS = {
  gameboy: {
    metalness: 0.2,
    roughness: 0.8,
    envMapIntensity: 0.5
  },
  rubiksCube: {
    metalness: 0.1,
    roughness: 0.6,
    envMapIntensity: 0.3
  },
  ps2: {
    metalness: 0.2,
    roughness: 0.8,
    envMapIntensity: 0.4
  },
  tamagotchi: {
    metalness: 0.3,
    roughness: 0.7,
    envMapIntensity: 0.4
  },
  lego: {
    metalness: 0.1,
    roughness: 0.8,
    envMapIntensity: 0.2
  }
};

// Optimize textures for web
export const optimizeTexture = (texture) => {
  if (!texture) return;
  
  // Set texture filtering for better performance
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  // Enable anisotropic filtering for better quality at angles
  texture.anisotropy = 4;
  
  // Optimize texture format
  texture.format = THREE.RGBAFormat;
  texture.encoding = THREE.sRGBEncoding;
  
  return texture;
};

// Optimize materials based on object type
export const optimizeMaterials = (model, objectType) => {
  const settings = MATERIAL_SETTINGS[objectType] || {
    metalness: 0.3,
    roughness: 0.7,
    envMapIntensity: 0.5
  };
  
  model.traverse((child) => {
    if (child.isMesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      
      materials.forEach(material => {
        // Apply material settings
        material.metalness = settings.metalness;
        material.roughness = settings.roughness;
        material.envMapIntensity = settings.envMapIntensity;
        
        // Optimize textures
        if (material.map) optimizeTexture(material.map);
        if (material.normalMap) optimizeTexture(material.normalMap);
        if (material.roughnessMap) optimizeTexture(material.roughnessMap);
        if (material.metalnessMap) optimizeTexture(material.metalnessMap);
        
        // Enable better shading
        material.flatShading = false;
        material.side = THREE.FrontSide;
        
        // Update material
        material.needsUpdate = true;
      });
    }
  });
};

// Create bounding box for better culling
export const setupBoundingBox = (model) => {
  const box = new THREE.Box3().setFromObject(model);
  model.userData.boundingBox = box;
  
  // Store size for LOD calculations
  const size = new THREE.Vector3();
  box.getSize(size);
  model.userData.size = Math.max(size.x, size.y, size.z);
  
  return box;
};

// Level of Detail (LOD) helper
export const createLODModel = (highDetailModel, mediumDetailModel, lowDetailModel) => {
  const lod = new THREE.LOD();
  
  // High detail for close viewing
  if (highDetailModel) {
    lod.addLevel(highDetailModel, 0);
  }
  
  // Medium detail for medium distance
  if (mediumDetailModel) {
    lod.addLevel(mediumDetailModel, 5);
  }
  
  // Low detail for far distance
  if (lowDetailModel) {
    lod.addLevel(lowDetailModel, 10);
  }
  
  return lod;
};

// Geometry optimization
export const optimizeGeometry = (model) => {
  model.traverse((child) => {
    if (child.isMesh && child.geometry) {
      // Compute vertex normals for better lighting
      child.geometry.computeVertexNormals();
      
      // Optimize geometry for GPU
      child.geometry.computeBoundingBox();
      child.geometry.computeBoundingSphere();
      
      // Enable shadow casting/receiving
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

// Complete optimization pipeline
export const optimizeModel = (model, objectType) => {
  // Clone to avoid modifying the original
  const optimizedModel = model.clone();
  
  // Apply all optimizations
  optimizeMaterials(optimizedModel, objectType);
  optimizeGeometry(optimizedModel);
  setupBoundingBox(optimizedModel);
  
  // Enable frustum culling
  optimizedModel.frustumCulled = true;
  
  return optimizedModel;
};