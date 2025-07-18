# 3D Models Directory

This directory contains the GLB/GLTF models for the nostalgic objects in the timeline.

## Required Models

Place the following models in this directory:

1. **gameboy.glb** - Classic Game Boy model
2. **rubiks-cube.glb** - Rubik's Cube with colored faces
3. **ps2.glb** - PlayStation 2 console
4. **tamagotchi.glb** - Virtual pet device
5. **ipod.glb** - iPod classic model

## Model Requirements

- **Format**: GLB (preferred) or GLTF
- **Size**: Keep under 2MB per model
- **Optimization**: Use Draco compression when possible
- **Textures**: Embedded in GLB file
- **Scale**: Models should be roughly 1-2 units in size

## Where to Find Models

### Free Resources:
- **Sketchfab**: https://sketchfab.com (search for CC0 licensed models)
- **Poly Haven**: https://polyhaven.com/models
- **TurboSquid**: https://www.turbosquid.com (free section)

### Model Optimization:
- **GLTF Pipeline**: https://github.com/CesiumGS/gltf-pipeline
- **Blender**: Export with Draco compression enabled
- **Online Tool**: https://gltf.report/

## Example Search Terms:
- "game boy low poly"
- "rubiks cube 3d model"
- "playstation 2 console 3d model"
- "tamagotchi 3d model"
- "ipod classic 3d model"

## Fallback Behavior

If a model file is missing, the application will automatically fall back to colored cube placeholders, so the app will continue to work while you source the models.