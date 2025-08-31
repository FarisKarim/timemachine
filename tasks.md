⏺ Complete CLS Analysis - All Culprits Identified:

  🔴 CRITICAL Issues (Most Impact on CLS):

  1. Memory Sidebar Dynamic Inline Styles (Lines 276-348 in 
  App.jsx)
    - 111 shifts likely come from here
    - Sidebar changes background, backdropFilter, borderColor,
  borderWidth, borderStyle, color, boxShadow dynamically
    - Each style property calculated inline based on
  selectedObject?.type
    - No CSS classes pre-defined, causing browser to recalculate
  layout
  2. Web Fonts Loading Without Preload
    - @import url('https://fonts.googleapis.com/css2?family=Orbit
  ron:wght@400;700;900&display=swap');
    - No <link rel="preload"> in index.html
    - Fonts loaded after CSS parsing, causing FOUT (Flash of
  Unstyled Text)
    - Used in 10+ places throughout the app
  3. Conditional Rendering Without Reserved Space
    - GameBoy texture overlay appears/disappears (lines 180-185)
    - iPod chrome header appears/disappears (lines 355-362)
    - "Exploring memories..." text appears conditionally (lines
  217-226)
    - Navigation buttons conditionally rendered (lines 234-272)

  🟠 MODERATE Issues:

  4. TailwindCSS Dynamic Classes (Line 189-192, 279-281)
    - Conditional classes like ${isMobile ? 'left-4' : 
  'left-[28rem]'}
    - Changes position dynamically based on state
    - No transition reserved space
  5. Transform Animations on Mount
    - Sidebar uses transform: translateX() from -100% to 0
    - No will-change property
    - No reserved space in DOM
  6. Dynamic Text Content
    - Logo text changes theme dynamically (lines 193-201)
    - Exploring memories text with animated dots (lines 217-226)

  🟡 MINOR Issues:

  7. Missing Font Display Strategy
    - No font-display: swap in font declarations
    - Causes invisible text during font load
  8. Dynamic Component Switching
    - Different memory capsule components render based on object
  type (lines 397-436)
    - Each has different heights/layouts
  9. No Aspect Ratios Reserved
    - 3D canvas and UI elements don't have reserved dimensions
    - Browser recalculates on load
  10. Missing Skeleton Loaders
    - No placeholder content while components load
    - Sudden appearance causes shifts