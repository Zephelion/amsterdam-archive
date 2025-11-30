This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## Zoom In Effect & Active Artwork System

This application features an interactive 3D gallery where users can click on artwork images to zoom in and view detailed information. The system orchestrates smooth camera transitions, artwork scaling, and UI state management.

### Overview

When a user clicks on an artwork in the 3D scene, the application:

1. Sets the artwork as "active" in the global state
2. Smoothly transitions the camera to zoom in on the selected artwork
3. Fades out all other artworks while keeping the active one visible
4. Displays story content and timeline information once the camera transition completes

### Active Artwork State Management

The active artwork system is managed through a Zustand store (`useArtworkStore`) that tracks:

- **`activeArtwork`**: The currently selected `ArchiveItem` object, or `null` if none is selected
- **`activeArtworkPosition`**: The 3D position `[x, y, z]` of the active artwork in the scene
- **`isAnimating`**: Boolean flag indicating if an animation is in progress
- **`hasCompletedCameraTransitionToArtwork`**: Boolean flag indicating when the camera has finished transitioning to the artwork

**Key Actions:**

- `setActiveArtwork(artwork, position)`: Sets an artwork as active and stores its position
- `clearActiveArtwork()`: Clears the active artwork and resets related state
- `setCameraTransitioning(completed)`: Updates the camera transition completion status

### Zoom In Effect - Camera Transition

The zoom effect is implemented through the `CameraController` component and `useCameraTransition` hook.

**How it works:**

1. **Trigger**: When an artwork is clicked, `useArtworkInteractions` calls `setActiveArtwork()` with the artwork data and its 3D position.

2. **Camera Movement**: The `useCameraTransition` hook monitors the `activeArtwork` state and calculates a target camera position:

   ```
   targetCameraPos = artworkPosition + offset + [0, 0, zoomDistance]
   ```

   - Default `zoomDistance`: 3.5 units along the Z-axis
   - Default `offset`: `[0, 0, 0]` (configurable)
   - Default `lerpSpeed`: 0.02 (controls transition smoothness)

3. **Smooth Interpolation**: Each frame, the camera position is interpolated using `THREE.Vector3.lerp()` toward the target position, creating a smooth zoom-in animation.

4. **Completion Detection**: When the camera is within 0.1 units of the target position, the system marks the transition as complete via `setCameraTransitioning(true)`.

5. **Return to Base**: When `activeArtwork` is cleared (e.g., clicking empty space), the camera smoothly returns to its base position using the same lerp mechanism.

**Configuration:**
The camera transition can be customized via `CAMERA_OPTIONS` in `pages/index.tsx`:

```typescript
const CAMERA_OPTIONS = {
  lerpSpeed: 0.02, // Transition smoothness (0-1)
  zoomDistance: 3.5, // Distance from artwork in Z-axis
  offset: [0, 0, 0], // Additional position offset
};
```

### Artwork Scaling & Fade Effect

When an artwork becomes active, all other artworks fade out while the active one remains visible. This is handled by the `useScale` hook applied to each `ImagePlane` component.

**Scaling Logic:**

1. **Active Artwork**: Maintains scale of `1.0` (normal size)
2. **Inactive Artworks**: When any artwork is active, all non-active artworks scale to `0` (invisible)
3. **Smooth Transition**: Scaling uses `THREE.MathUtils.lerp()` with a `lerpSpeed` of `0.045` for smooth fade in/out

**Configuration:**
Each `ImagePlane` uses `SCALE_OPTIONS`:

```typescript
const SCALE_OPTIONS = {
  lerpSpeed: 0.045, // Scale transition speed
  inactiveScale: 0, // Scale for inactive artworks when one is active
  activeScale: 1.5, // (Currently unused, reserved for future use)
};
```

### Interaction Flow

The complete interaction flow from click to UI display:

1. **User clicks artwork** → `ImagePlane` onClick handler fires
2. **`useArtworkInteractions`** → Calls `setActiveArtwork(artwork, position)`
3. **State updates** → `activeArtwork` and `activeArtworkPosition` are set, `isAnimating` becomes `true`
4. **Camera starts transitioning** → `CameraController` detects active artwork and begins lerping camera position
5. **Other artworks fade out** → `useScale` hook scales inactive artworks to 0
6. **Camera reaches target** → Distance < 0.1 units triggers `setCameraTransitioning(true)`
7. **UI becomes visible** → `useShouldShowUI()` hook returns `true` when both `activeArtwork` exists and camera transition is complete
8. **Story content displays** → `StorySection` and `TimelineSection` components render

### Floating Camera Behavior

When no artwork is active, the `FloatingCamera` component creates a subtle floating animation effect:

- The camera gently oscillates using sine/cosine waves
- Float amplitude: 0.5 units horizontally, 0.25 units vertically
- Animation speed: 0.3-0.4 radians per second
- Uses lerp interpolation (0.1 speed) for smooth movement

This floating effect pauses automatically when an artwork becomes active (checked via `if (activeArtwork) return;`).

### Clearing Active Artwork

Users can clear the active artwork by:

- Clicking on empty space in the 3D scene (handled by `onPointerMissed` on the Canvas)
- The `clearActiveArtwork()` function resets all state and triggers camera return animation

### Related Components & Hooks

- **`FloatingCamera`**: Handles idle camera floating animation
- **`CameraController`**: Manages camera transitions to/from artworks
- **`ImagePlane`**: Individual artwork mesh with click handlers
- **`useArtworkInteractions`**: Handles click events and state updates
- **`useCameraTransition`**: Core camera animation logic
- **`useScale`**: Artwork scaling/fade animation
- **`useArtworkStore`**: Global state management for artwork interactions

## Generated Story Feature

The application automatically generates contextual stories for each artwork using OpenAI's GPT-4o-mini model. Stories are generated on-demand when an artwork becomes active, cached for performance, and displayed with smooth scroll-based animations.

### Overview

When a user clicks on an artwork and the camera transition completes, the system:

1. Checks if a story already exists in cache for that artwork
2. If not cached, generates a new story via API call to OpenAI
3. Stores the generated story in both the global state and an in-memory cache
4. Displays the story in a scrollable section with paragraph-by-paragraph fade animations

### Story Generation Flow

**Trigger:**

- The `useGeneratedStory` hook monitors the `activeArtwork` state
- When an artwork becomes active, it automatically triggers story generation
- The hook is called in `pages/index.tsx` with the active artwork as a parameter

**Generation Process:**

1. **Cache Check**: First checks an in-memory `Map` cache using the artwork's `id` as the key

   - If cached story exists → immediately sets it in state and returns
   - If not cached → proceeds to generate new story

2. **API Request**: Makes a POST request to `/api/generate-story` with the artwork data:

   {
   artwork: ArchiveItem // Contains title, description, year, metadata, etc.
   } 3. **Story Storage**: Once generated, the story is:

   - Stored in the cache (`storyCache.set(artwork.id, story)`)
   - Set in the global Zustand store via `setGeneratedStory(story)`

3. **Prevention of Duplicate Requests**: Uses a `useRef` flag (`isGenerating`) to prevent multiple simultaneous API calls for the same artwork

### API Endpoint: `/api/generate-story`

The API endpoint (`src/pages/api/generate-story.ts`) handles story generation using OpenAI:

**Input:**

- `artwork`: Complete `ArchiveItem` object containing:
  - `title`: Artwork title
  - `description`: Artwork description (optional)
  - `year`: Year the artwork was created
  - `metadata`: Array of metadata objects with labels and values

**Processing:**

1. **Metadata Extraction**: Uses `extractMetadataValues()` utility to:

   - Extract all metadata values from nested structures
   - Format them as readable strings with labels
   - Handle both string and array metadata values recursively

2. **Prompt Construction**: Builds a detailed prompt including:

   - Artwork title
   - Description (if available)
   - Year (if available)
   - Extracted metadata context
   - Instructions for story style and length (100 words)

3. **OpenAI API Call**:

   - Model: `gpt-4o-mini`
   - System role: "Knowledgeable art historian and archivist specializing in Amsterdam's cultural heritage"
   - Max tokens: 300
   - Temperature: 0.7 (balanced creativity/consistency)
   - Language: Matches the artwork's language

4. **Response**: Returns the generated story text as JSON:
   {
   "story": "Generated story text..."
   }
   **Error Handling:**

- Returns 400 if artwork is missing
- Returns 500 if OpenAI API call fails
- Errors are logged to console for debugging

### Story Display

The generated story is displayed in the `StorySection` component, which only renders when:

- `shouldShowUI` is `true` (camera transition completed)
- `activeArtwork` exists
- `generatedStory` is available

**Component Structure:**

1. **StorySection** (`src/components/features/StorySection/StorySection.tsx`):

   - Creates a scrollable section with height of `400vh` (4x viewport height)
   - Uses Cormorant Garamond font for elegant typography
   - Tracks scroll progress using Framer Motion's `useScroll` hook
   - Passes scroll progress to `StoryParagraph` component

2. **StoryParagraph** (`src/components/features/StoryParagraph/StoryParagraph.tsx`):
   - Breaks the story text into paragraphs using `breakContentIntoParagraphs()` utility
   - Default paragraph length: 150 characters
   - Creates scroll-based fade animations for each paragraph

**Paragraph Breaking Logic:**

The `breakContentIntoParagraphs()` utility (`src/utils/breakContentIntoParagraphs.ts`):

- Splits content by newlines first
- For lines exceeding `maxLength` (default 150 chars):
  - Splits by words to fit within length limit
- For shorter lines:
  - Combines multiple lines into paragraphs up to `maxLength`
- Preserves natural paragraph breaks while ensuring readability

**Scroll-Based Animation:**

Each paragraph fades in and out based on scroll position:

1. **Segment Calculation**: Each paragraph occupies an equal segment of the total scroll progress

   - Segment start: `index / totalParagraphs`
   - Segment end: `(index + 1) / totalParagraphs`

2. **Fade Transitions**:

   - **Fade In**: First 25% of segment (configurable via `fadeTransitionPercentage`)
   - **Fully Visible**: Middle 50% of segment
   - **Fade Out**: Last 25% of segment
   - Last paragraph extends fade-out slightly to handle scroll beyond 1.0

3. **Opacity Calculation**: Uses Framer Motion's `useTransform` to map scroll progress to opacity:
   opacity = useTransform(scrollYProgress, (progress) => {
   // Calculates opacity based on progress within segment
   }) 4. **Visual Styling**:
   - Font size: `2rem`
   - Line height: `1.6`
   - Max width: `600px`
   - Centered text alignment
   - Absolute positioning for overlay effect

### Caching Strategy

**In-Memory Cache:**

- Uses a `Map<string, string>` to store stories by artwork ID
- Cache persists for the duration of the session
- Prevents redundant API calls when users revisit the same artwork
- Cache is cleared when the page is refreshed

**State Management:**

- Story is stored in Zustand store (`useArtworkStore`)
- Cleared when `clearActiveArtwork()` is called
- Allows components to reactively update when story changes

### Integration with Active Artwork System

The story feature is tightly integrated with the active artwork system:

1. **Trigger**: Story generation starts automatically when `activeArtwork` changes
2. **Display Condition**: Story only displays after camera transition completes (`hasCompletedCameraTransitionToArtwork`)
3. **Cleanup**: Story is cleared when artwork is deselected via `clearActiveArtwork()`

**Conditional Rendering:**
{shouldShowUI && activeArtwork && generatedStory && (
<>
<StorySection content={generatedStory} />
<TimelineSection />
</>
)}### Environment Variables

The API endpoint requires an OpenAI API key:

OPENAI_API_KEY=your_openai_api_key_hereThis should be set in your `.env.local` file for local development or in your deployment environment variables.

### Related Components & Utilities

- **`useGeneratedStory`**: Hook that manages story generation and caching
- **`StorySection`**: Container component for story display
- **`StoryParagraph`**: Component that handles paragraph rendering and scroll animations
- **`breakContentIntoParagraphs`**: Utility for splitting story text into readable paragraphs
- **`extractMetadataValues`**: Utility for extracting and formatting artwork metadata
- **`/api/generate-story`**: Next.js API route for OpenAI integration
