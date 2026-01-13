# Amsterdam Archive - RE:telling of the City of Amsterdam

An immersive 3D web experience exploring Amsterdam's historical archives through interactive visualizations, AI-generated narratives, and temporal navigation. This project aims to make historical archives more accessible and engaging for a broader audience by combining modern web technologies with cultural heritage.

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-via%20React%20Three%20Fiber-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm** or **bun**
- **OpenAI API Key** (for AI story generation)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/amsterdam-archive.git
   cd amsterdam-archive
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## ✨ Features

### 🎨 Interactive 3D Gallery

- **3D Image Grid System**

  - Dynamic grid layouts supporting 10-column and 6-column configurations
  - Smooth layout transitions between different grid configurations
  - Real-time position interpolation for fluid artwork movement
  - Aspect ratio preservation with intelligent image scaling
  - Support for 200+ archive items with optimized performance

- **Sphere Visualization**

  - Artworks arranged in a 3D sphere formation
  - Smooth sphere-to-grid morphing transitions (2-second duration)
  - Camera choreography synchronized with layout transitions
  - 2-second pause at sphere formation for visual impact

- **Floating Camera Animation**
  - Gentle idle camera movement using sine/cosine oscillation
  - 0.5 units horizontal amplitude, 0.25 units vertical amplitude
  - Automatic pause when user interacts with artwork
  - Smooth lerp-based interpolation (0.1 speed)

### 🖼️ Artwork Interaction System

- **Click-to-Zoom Experience**

  - Smooth camera transition to selected artwork (lerp speed: 0.02)
  - Configurable zoom distance (default: 3.5 units)
  - Other artworks fade out while maintaining active artwork visibility
  - Automatic scale transition with 0.045 lerp speed

- **Hover Effects**

  - Interactive hover tooltips showing artwork titles
  - Scale animations on collection items (1.1x scale on hover)
  - Visual feedback with smooth transitions

- **Artwork Detail View**
  - Full artwork metadata display
  - High-resolution image loading
  - Related artworks carousel
  - AI-generated contextual stories

### 📖 AI-Powered Storytelling

- **OpenAI Integration**

  - GPT-4o-mini model for story generation
  - Context-aware narratives based on artwork metadata
  - Art historian persona for historically accurate content
  - Temperature: 0.7 for balanced creativity
  - Max tokens: 300 (approximately 100 words)
  - Language-aware generation

- **Smart Caching System**

  - In-memory cache using Map data structure
  - Prevents duplicate API calls for viewed artworks
  - Session-persistent cache
  - Automatic cache invalidation on artwork deselection

- **Scroll-Based Story Reveal**
  - Stories broken into readable paragraphs (150 characters each)
  - Paragraph-by-paragraph fade-in animations
  - Scroll progress tracking with Framer Motion
  - 400vh scrollable section (4x viewport height)
  - Smooth opacity transitions (25% fade in/out segments)

### ⏱️ Temporal Navigation

- **Interactive Timeline**

  - Visual timeline spanning historical period (1600s - present)
  - Mouse-hover year preview with real-time calculation
  - Click-to-select year functionality
  - Timeline markers every 9 years
  - Dynamic bulge effect on hover (25-pixel radius)
  - Gradient fade on edges for visual polish

- **Animated Year Counter**

  - Dramatic countdown animation (8-second duration)
  - Bidirectional counting (supports both forward and backward navigation)
  - easeOutQuart easing function for smooth deceleration
  - Initial display: Large centered text (8rem font size)
  - Final position: Bottom-right corner above Browse button
  - Persistent year indicator showing current time period
  - Ultra-light font weight (100) for elegant appearance

- **Year-Based Filtering**
  - Automatic artwork filtering by selected year
  - Smooth transition to filtered results via sphere animation
  - Integration with collection display system

### 📚 Collection Management

- **Collection Side Panel**

  - 26 curated Amsterdam archive collections
  - Slide-in panel from right (28vw width)
  - Staggered animation for collection items (0.14s delay)
  - Click-outside-to-close functionality
  - Backdrop overlay for focus

- **Collection Display**

  - Bottom-left corner collection indicator
  - Shows current active collection
  - Clean name extraction (removes item counts)
  - Fade-in from left animation (0.5s duration)
  - Semi-transparent background with backdrop blur
  - Font weight: 500 for balanced readability
  - Max width: 400px (desktop) / 250px (mobile)

- **Collection Filtering**
  - Real-time filtering of artworks by collection
  - Integration with layout transition system
  - Pending collection state during transitions
  - Automatic sphere transition when collection selected

### 🎭 Amsterdam History Section

- **Scrollable Historical Narrative**

  - Multi-section storytelling about Amsterdam's history
  - Scroll-based content reveal with opacity transitions
  - Synchronized with 3D sphere visualization
  - Custom Cormorant Garamond typography
  - Content sections with engaging historical context

- **Year Display**

  - Dynamic year counter during history scroll
  - Tracks historical progression through scroll position
  - Synchronized with narrative content

- **Skip History Feature**
  - Quick-skip button to jump to main gallery
  - Smooth scroll to end of history section
  - Automatic state transition to completed status

### 🎬 Advanced Animation System

- **Layout Transitions**

  - Multi-stage layout morphing system
  - Progress tracking (0 to 1) for interpolation
  - Support for multiple layout configurations (grid-10, grid-6, sphere)
  - Smooth position interpolation using easing functions
  - Synchronized camera and artwork transitions

- **Framer Motion Integration**

  - Declarative animation API
  - Custom motion components (MotionDiv, MotionButton, MotionSpan)
  - AnimatePresence for mount/unmount animations
  - Scroll-linked animations using useScroll and useTransform
  - Staggered children animations

- **Three.js Animations**
  - useFrame hook for 60fps animations
  - Vector3 lerp for smooth position transitions
  - RequestAnimationFrame for counter animations
  - Custom easing functions (easeOutQuart)

### 🎯 User Experience Enhancements

- **Responsive Design**

  - Mobile-optimized layouts and font sizes
  - Breakpoint at 768px for mobile/desktop
  - Touch-friendly interface elements
  - Adaptive grid configurations

- **Loading States**

  - Texture loading progress tracking
  - Total textures counter (200+ items)
  - Loaded textures counter with reactive updates
  - Empty state component for no results

- **Visual Feedback**

  - Hover tooltips with artwork titles
  - Mix-blend-mode for contrast on any background
  - Button hover effects with color transitions
  - Scale transformations on interactive elements

- **Smooth Scrolling**
  - Lenis smooth scroll library integration
  - Natural scroll behavior
  - Enhanced scroll performance
  - Disabled during 3D interactions

### 🏛️ Hero & Branding

- **Animated Hero Section**

  - Eye-catching entry experience
  - Custom typography with Cormorant Garamond
  - "Start Exploring" call-to-action
  - Fade-in animations on mount

- **Logo Component**

  - Persistent branding element
  - Fixed positioning in top-left corner
  - Subtle design for non-intrusive presence

- **Scroll Indicators**
  - Visual cues for scrollable content
  - Animated scroll-down indicators
  - Context-aware visibility

### 🗄️ State Management

- **Zustand Store Architecture**

  - Centralized state management
  - Type-safe actions and selectors
  - Minimal boilerplate
  - React hooks integration

- **State Categories**
  - Artwork interaction state (active, position, animation)
  - Layout system state (layoutId, transitions, progress)
  - Sphere transition state (progress, year selection)
  - Collection state (current, pending)
  - Texture loading state (counts, ready status)
  - Navigation state (history completion, start status)

### 🎨 Data Integration

- **Stadsarchief Amsterdam API**

  - Server-side data fetching (SSR)
  - 200 items per page
  - Metadata extraction and processing
  - Year extraction from metadata fields
  - Asset validation and filtering

- **Data Processing**
  - Year parsing with regex (1600-2029 range)
  - Metadata value extraction (recursive)
  - Image dimension normalization
  - Grid position calculations

### 🧩 Advanced Utilities

- **Position Calculation**

  - `getGridPosition`: 10-column and 6-column grid layouts
  - `getSpherePosition`: 3D sphere arrangement with seeded randomization
  - `getInterpolatedPosition`: Smooth transitions between layouts
  - `getGrid10To6WrappedPosition`: Wrapped grid transformations

- **Year & Timeline**

  - `calculateYearFromMousePosition`: Mouse-to-year mapping
  - `getCurrentYear`: Dynamic current year
  - `getYearFromMetaData`: Regex-based year extraction

- **Content Processing**

  - `breakContentIntoParagraphs`: Smart paragraph segmentation
  - `extractMetadataValues`: Recursive metadata extraction
  - `normalizeImageDimensions`: Aspect ratio preservation

- **Animation Helpers**
  - `clamp`: Value clamping utility
  - `getBarTransform`: Timeline bar bulge calculations

## 🛠️ Technology Stack

### Core Framework

- **Next.js 16.0.7** - React framework with SSR
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe development

### 3D & Animation

- **@react-three/fiber 9.4.0** - React renderer for Three.js
- **@react-three/drei 10.7.6** - Three.js helpers
- **Three.js** - 3D graphics library
- **Framer Motion 12.23.24** - Animation library
- **react-spring 10.0.3** - Spring physics animations

### State & Data

- **Zustand 5.0.8** - State management
- **OpenAI 6.8.1** - AI story generation

### UI & Styling

- **Next.js Font** - Google Fonts integration (Cormorant Garamond)
- **CSS Modules** - Scoped component styling
- **Lenis 1.3.11** - Smooth scroll library

### Development Tools

- **ESLint** - Code linting
- **eslint-config-next** - Next.js specific rules

## 📁 Project Structure

```
amsterdam-archive/
├── src/
│   ├── components/
│   │   └── features/          # Feature components
│   │       ├── ActiveArtworkOverlay/
│   │       ├── AmsterdamHistorySection/
│   │       ├── BrowseByCollectionButton/
│   │       ├── CameraController/
│   │       ├── CanvasScrollController/
│   │       ├── CollectionSection/
│   │       ├── CollectionSidePanel/
│   │       ├── CurrentCollectionDisplay/
│   │       ├── FloatingCamera/
│   │       ├── HeroSection/
│   │       ├── HoverTooltip/
│   │       ├── ImagePlane/
│   │       ├── InteractiveTimeline/
│   │       ├── LayoutTransitionController/
│   │       ├── Logo/
│   │       ├── MotionElements/
│   │       ├── ScrollIndicator/
│   │       ├── SphereTransitionController/
│   │       ├── StorySection/
│   │       ├── YearCounter/
│   │       └── YearDisplay/
│   ├── constants/             # Configuration constants
│   │   ├── amsterdamHistoryContent.ts
│   │   ├── camera.ts
│   │   ├── collections.ts
│   │   └── heroContent.ts
│   ├── hooks/                 # Custom React hooks
│   │   ├── useArtworkFetch.ts
│   │   ├── useArtworkInteractions.ts
│   │   ├── useCameraTransition.ts
│   │   ├── useCanvasScroll.ts
│   │   ├── useGeneratedStory.ts
│   │   ├── useLayoutTransition.ts
│   │   ├── useSphereTransition.ts
│   │   └── ...
│   ├── lib/                   # External API integrations
│   │   └── stadsarchief.ts
│   ├── pages/                 # Next.js pages
│   │   ├── api/              # API routes
│   │   │   ├── fetch-artworks.ts
│   │   │   └── generate-story.ts
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   └── index.tsx
│   ├── stores/                # Zustand state stores
│   │   └── useArtworkStore.ts
│   ├── styles/                # Global styles
│   │   ├── globals.css
│   │   └── Home.module.css
│   ├── types/                 # TypeScript type definitions
│   │   └── data-types.ts
│   └── utils/                 # Utility functions
│       ├── breakContentIntoParagraphs.ts
│       ├── calculateYearFromMousePosition.ts
│       ├── clamp.ts
│       ├── extractMetadataValues.ts
│       ├── getGridPosition.ts
│       ├── getInterpolatedPosition.ts
│       ├── getSpherePosition.ts
│       ├── getYearFromMetaData.ts
│       ├── layouts.ts
│       └── normalizeImageDimensions.ts
├── public/                    # Static assets
├── .env.local                 # Environment variables (create this)
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (if using custom API endpoints)
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables in project settings
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/amsterdam-archive)

### Other Platforms

The application can be deployed on any platform that supports Next.js:

- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway
- Render

## 🎯 Key Technical Decisions

### Why Next.js?

- Server-side rendering for better SEO and initial load performance
- API routes for backend functionality (OpenAI integration)
- Optimized image handling
- Built-in TypeScript support

### Why React Three Fiber?

- Declarative 3D scene management
- React ecosystem integration
- Performance optimization out of the box
- Easy state synchronization between 3D and 2D

### Why Zustand?

- Minimal boilerplate compared to Redux
- TypeScript-first design
- No provider hell
- Great performance with selective subscriptions

### Why Framer Motion?

- Declarative animation API
- Scroll-linked animations
- Layout animations
- Great TypeScript support

## 📝 Development Notes

### Performance Considerations

- **Texture Loading**: All 200+ images are loaded progressively
- **Lerp Animations**: Smooth 60fps animations using requestAnimationFrame
- **Selective Rendering**: Components only re-render when necessary
- **Memoization**: Strategic use of useMemo and useCallback

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- WebGL support required
- Recommended: Hardware acceleration enabled

### Known Limitations

- OpenAI API key required for story generation
- Mobile experience optimized but desktop recommended
- WebGL performance varies by device

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of a graduation thesis (Afstuderen 2025-2026).

## 🙏 Acknowledgments

- **Stadsarchief Amsterdam** for providing the archive API
- **OpenAI** for GPT-4o-mini model
- **Three.js community** for excellent 3D libraries
- **Next.js team** for the amazing framework

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ for Amsterdam's Cultural Heritage
