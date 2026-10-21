# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Evacuation models infrastructure (harness and carrier) - Ready for future implementation
- Emergency kit animation system optimizations
- Automatic pet greeting system in intro and tracking sections
- Enhanced visual signals (green cones) for tracking elements
- Polygon offset fix for ID plate z-fighting prevention

### Changed
- **Kit Animation**: Reduced opening time from 1.7s to 1.2s (40% faster)
- **Kit Animation**: Reduced object emergence time from 4.9s to 3.8s (23% faster)
- **Camera Movement**: Increased camera movement speed during kit object emergence
- **Camera Position**: Camera moves further away for better object visualization
- **Player Speed**: Reduced movement speed during earthquake by 35% (0.9x → 0.65x factor)
- **UI**: Removed blur/vignette effect from kit objects section
- **Hint Text**: Improved "Arrastra para girar" hint visibility and positioning
- **Pet Interaction**: Automatic pet greetings in petwalk section (no click required)
- **Pet Interaction**: Removed petting animation after kit, only greetings remain

### Fixed
- ID plate no longer clips through pet mesh, especially when scared
- Continue button only appears after ALL kit objects are stored
- Pet greeting system now activates automatically at proper progression points
- Tracking section pets now greet with sound at proper moments

### Removed
- Blur vignette from kit visualization
- Manual petting interaction after kit section
- Canvas-based evacuation model previews (desactivated for future redesign)

### Technical
- Modified: `src/js/steps/before.js` - Kit animations and pet interactions
- Modified: `src/js/systems/player.js` - Earthquake speed modulation
- Modified: `src/js/ui/trackInfo.js` - Enhanced tracking visual signals
- Modified: `src/js/three/models/trackGlb.js` - ID plate positioning fix
- Modified: `src/js/main.js` - Model loading sequence
- Modified: `src/js/steps/sizes.js` - Preparation for evacuation section
- Added: `src/js/three/models/evacuationGlb.js` - Harness and carrier model loader
- Added: `static/Arnes.glb` - Harness 3D model
- Added: `static/transportadora.glb` - Carrier 3D model

## Notes

- Evacuation models (harness and carrier) are loaded but not yet integrated into UI
- To reactivate evacuation features, uncomment imports in `src/js/main.js` and `src/js/steps/sizes.js`
- All changes maintain backward compatibility with existing functionality
- Animation timings optimized for better user experience and content visibility

---

## Installation & Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the changes in action.

## Build

```bash
npm run build
```
