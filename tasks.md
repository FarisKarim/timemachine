# Y2K Timeline Background Enhancement Tasks

## Implementation Steps

### 1. Add Y2K CSS Gradient Styles
Add to `src/App.css`:

```css
.y2k-timeline-bg {
  background: linear-gradient(135deg, 
    #1a1a2e 0%,     /* Deep navy */
    #16213e 25%,    /* Dark blue */
    #0f3460 50%,    /* Electric blue */ 
    #533a7b 75%,    /* Purple */
    #1a1a2e 100%    /* Back to navy */
  );
  background-size: 400% 400%;
  animation: y2k-gradient-shift 8s ease-in-out infinite;
}

@keyframes y2k-gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### 2. Update Scene Container
In `src/components/3d/Scene.jsx`, change the container div:

**From:**
```jsx
<div className="fixed inset-0 w-full h-full">
```

**To:**
```jsx
<div className="fixed inset-0 w-full h-full y2k-timeline-bg">
```

### 3. Enable Canvas Transparency
In `src/components/3d/Scene.jsx`, update Canvas gl props:

**From:**
```javascript
gl={{ 
  antialias: !isMobile,
  alpha: false,
  powerPreference: isMobile ? "default" : "high-performance"
}}
```

**To:**
```javascript
gl={{ 
  antialias: !isMobile,
  alpha: true,  // Changed from false to show CSS background
  powerPreference: isMobile ? "default" : "high-performance"
}}
```

### 4. Update Timeline Default Color
In `src/components/3d/Scene.jsx`, change the default background color:

**From:**
```javascript
: '#000000'  // Default black
```

**To:**
```javascript
: 'rgba(0, 0, 0, 0.3)'  // Semi-transparent instead of solid black
```

## Expected Result
- Animated Y2K gradient background on timeline
- Object-specific colors overlay the gradient when zoomed
- Maintains performance with CSS-based animation
- Creates vibrant retro-futuristic atmosphere

## Files to Modify
- [ ] `src/App.css` - Add Y2K gradient styles
- [ ] `src/components/3d/Scene.jsx` - Update container class and Canvas props
- [ ] Test on mobile for performance impact