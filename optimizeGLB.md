# 3D Model Optimization Guide

This document outlines the process for optimizing GLB files for NostalgiaX to achieve maximum performance and minimal file sizes.

## Optimization Pipeline

We used a combination of geometry simplification and texture compression to shrink the model:

### 1. Simplify the mesh
```bash
gltf-transform simplify gameboy.glb temp.glb --ratio 0.5
```
This cut the triangle count in half (50% geometry reduction)

### 2. Compress textures and clean metadata
```bash
gltf-transform optimize temp.glb temp2.glb --texture-compress webp --texture-quality 40
```
- Converted all embedded textures to WebP
- Compressed them at 40% quality (very light)
- Stripped padding, extras, unused nodes

## Results

The optimization pipeline achieved a 93% reduction in file size:
- **Before**: 9.46 MB
- **After**: 696 KB

## Recommended Settings

- **Geometry simplification**: 0.5 ratio (50% reduction) maintains visual quality while significantly reducing polygons
- **Texture compression**: WebP format with 40% quality provides good balance between file size and visual fidelity
- **Target file size**: Keep individual models under 1MB for optimal web performance

## Notes

- Test visual quality after optimization to ensure acceptable results
- Consider different quality settings based on object importance in the scene
- For mobile performance, prioritize smaller file sizes over maximum visual fidelity