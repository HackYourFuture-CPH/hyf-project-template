# Components & Hooks Documentation

This document lists the main UI components and React hooks in the `app-next` frontend, their purpose, file locations, props, behavior, and quick usage examples. It focuses on components and hooks found under `app-next/components` and `app-next/hooks`.

---

## Conventions
- All paths are relative to the repository root.
- `API_URL` is read from `process.env.NEXT_PUBLIC_API_URL` with a fallback to `http://localhost:3001` in most components and hooks.
- Many card components include an optimistic favorites UI backed by the `useFavorite` hook. They usually accept `card` objects from the backend and an optional `onFavoriteChange` callback.

---

## Components

### `TourBooking` (components/TourBooking/TourBooking.jsx)
- Purpose: Small booking form to allow a signed-in user to book a tour. Submits a POST to `/api/bookings/tour`.
- Path: `app-next/components/TourBooking/TourBooking.jsx`
- Styles: `app-next/components/TourBooking/TourBooking.module.css`
- Props:
  - `tourId` (string, required) - UUID of the tour to book.
  - `capacity` (number, optional) - If provided, used to cap the `num` field instead of fetching tour details.
  - `priceMinor` (number, optional) - Price in minor units (cents) for total calculation. If missing the component will try to fetch tour details.
- Behavior:
  - Shows a numeric input for number of people and a total price display (if price known).
  - Uses `localStorage.token` to send Authorization header; warns if no token.
  - Dispatches a global `bookingsChanged` event on success so other parts of the app can refresh.
  - Handles common HTTP responses: `201` (success), `409` (conflict/overbooked), `401/403` (auth), `404`.
- Example:

```jsx
<TourBooking tourId={"707b23f8-..."} capacity={12} priceMinor={249900} />
```

---

### `Card` (components/Card/Card.jsx)
- Purpose: Generic tour card used across search results and listing pages.
- Path: `app-next/components/Card/Card.jsx`
- Styles: `app-next/components/Card/Card.module.css`
- Props:
  - `card` (object, required) - The tour object from backend with `id`, `name`, `price_usd`/`price_minor`, `capacity`, etc.
  - `onFavoriteChange` (function, optional) - Callback called with `{ added, itemId }` when user toggles favorite.
  - `viewLink` (string, optional) - If provided, clicking the card navigates to this URL.
  - `size` (string, optional) - `regular` (default) or `large` to render a larger image area.
- Behavior:
  - Uses `useFavorite` hook for favorites state and optimistic UI.
  - Normalizes incoming image URLs and HEAD-checks backend-relative image paths to avoid proxy 404s.
  - Accessible keyboard interaction: card is focusable and handles Enter/Space to navigate when `viewLink` is set.
- Example:

```jsx
<Card card={tour} viewLink={`/tours/${tour.id}`} onFavoriteChange={(ev) => console.log(ev)} />
```

---

### `AttractionCard` (components/AttractionCard/AttractionCard.jsx)
- Purpose: Card display for attraction entries (similar to tour card but specialized for attractions).
- Path: `app-next/components/AttractionCard/AttractionCard.jsx`
- Styles: `app-next/components/AttractionCard/AttractionCard.module.css`
- Props:
  - `card` (object, required) - Attraction object with `id`, `title`/`name`, `cover_image_url`, `content`, `location`.
  - `onFavoriteChange` (function, optional)
- Behavior:
  - Uses `useFavorite` with `itemType: 'attraction'`.
  - Normalizes images similarly to `Card` component.
  - Provides a heart button that stops propagation so link navigation isn't triggered when favoriting.
- Example:

```jsx
<AttractionCard card={attraction} onFavoriteChange={(ev) => alert('fav changed')} />
```

---

### `BlogCard` (components/BlogCard/BlogCard.jsx)
- Purpose: Card for blog posts with author metadata and a favorite heart.
- Path: `app-next/components/BlogCard/BlogCard.jsx`
- Styles: `app-next/components/BlogCard/BlogCard.module.css`
- Props:
  - `card` (object, required) - Post object with `id`, `title`, `content`, `author` fields, etc.
  - `onFavoriteChange` (function, optional)
- Behavior:
  - Uses `useFavorite` with `itemType: 'post'`.
  - Shows author name/avatar when available and formats created date.
- Example:

```jsx
<BlogCard card={post} />
```

---

### `TourSearchResults` (components/TourSearchResults/TourSearchResults.jsx)
- Purpose: Simple results UI that renders a grid/list of tours plus loading/error/no-results states. Designed for admin search usage.
- Path: `app-next/components/TourSearchResults/TourSearchResults.jsx`
- Props:
  - `tours` (array)
  - `isLoading` (boolean)
  - `error` (string)
  - `hasSearched` (boolean)
  - `onEdit` (function)
  - `onDelete` (function)
- Behavior: purely presentational; parent handles fetching and actions.

---

### `PostMeta` (components/PostMeta/PostMeta.jsx)
- Purpose: Small metadata/header for blog posts that shows author avatar, name, date, category and a favorite heart.
- Path: `app-next/components/PostMeta/PostMeta.jsx`
- Styles: `app-next/components/PostMeta/PostMeta.module.css`
- Props:
  - `authorName` (string) - display author name
  - `date` (string) - display date text
  - `category` (string) - optional category label
  - `avatar` (string) - avatar image URL
  - `itemId` (string) - id to wire favorites to
  - `itemType` (string) - favorite item type, defaults to `post`
  - `onFavoriteChange` (function) - callback when favorite toggles
- Behavior: Uses `useFavorite` for optimistic favorite toggles; renders avatar and fallback strings. When `itemId` is provided it shows a clickable heart which calls `onFavoriteChange` when toggled.

---

### `Navbar` (components/Nav/Navbar.jsx)
- Purpose: Top-of-page navigation for the home page. Uses `react-scroll` to smooth-scroll to sections when on the root path.
- Path: `app-next/components/Nav/Navbar.jsx`
- Styles: `app-next/components/Nav/Navbar.module.css`
- Behavior: Renders links for Home, Tours, Blog Posts, and Attractions only when `usePathname()` indicates the current path is `/`.

---

### `Header` (components/Header/Header.jsx)
- Purpose: Site header including logo, desktop navigation, login/user area and mobile burger menu.
- Path: `app-next/components/Header/Header.jsx`
- Styles: `app-next/components/Header/Header.module.css` and related burger styles.
- Behavior:
  - Reads `localStorage.token` and `localStorage.user` to show login or user menu.
  - Provides logout which clears localStorage and redirects to home.
  - Uses `BurgerMenu`/`BurgerIcon` for mobile; closes menu on route change or Escape.

---

### `HeroSection` (components/HeroSection/HeroSection.jsx)
- Purpose: Large rotating hero with background images and title/subtitle for the landing page.
- Path: `app-next/components/HeroSection/HeroSection.jsx`
- Styles: `app-next/components/HeroSection/HeroSection.module.css`
- Behavior: Cycles background images every 4s, loops back to start; purely presentational.

---

### `Footer` (components/Footer/Footer.jsx)
- Purpose: Simple footer used across pages.
- Path: `app-next/components/Footer/Footer.jsx`
- Styles: `app-next/components/Footer/Footer.module.css`
- Behavior: Static copyright text; presentational.

---

### `Comment` (components/CommentSection/Comment.jsx)
- Purpose: Small local comment box component used in post pages.
- Path: `app-next/components/CommentSection/Comment.jsx`
- Styles: `app-next/components/CommentSection/Comment.module.css`
- Behavior: Local-state only: allows adding comments to a list and removing them. No server integration.

---

### `PostSearchResults` (components/PostSearchResults/PostSearchResults.jsx)
- Purpose: Presentational results list for post search. Shows loading / error / no-results states and a grid of posts with basic metadata and actions.
- Path: `app-next/components/PostSearchResults/PostSearchResults.jsx`
- Styles: `app-next/components/PostSearchResults/PostSearchResults.module.css`
- Props: `posts`, `isLoading`, `error`, `hasSearched`, `onEdit`, `onDelete`

---

### `UserSearchResults` (components/UserSearchResults/UserSearchResults.jsx)
- Purpose: Presentational admin-facing user search results; shows user contact and role/status and exposes Edit/Delete callbacks.
- Path: `app-next/components/UserSearchResults/UserSearchResults.jsx`
- Styles: `app-next/components/UserSearchResults/UserSearchResults.module.css`
- Props: `users`, `isLoading`, `error`, `hasSearched`, `onEdit`, `onDelete`

---

### `UploadTest` (components/UploadTest/UploadTest.js)
- Purpose: Demo/test page for UploadThing integration (secure uploads). Not required in production; useful for testing file uploads.
- Path: `app-next/components/UploadTest/UploadTest.js`
- Behavior: Renders `UploadButton` from `@uploadthing/react`, shows uploaded URL and image preview on completion.

---

### `ToursSection` (components/ToursSection/ToursSection.jsx)
- Purpose: Fetches a small list of tours (limit=3) and renders `Card` components with a "Show all" link.
- Path: `app-next/components/ToursSection/ToursSection.jsx`
- Styles: `app-next/components/ToursSection/ToursSection.module.css`
- Behavior: Fetches from `/api/tours?limit=3` on mount; defensive parsing for multiple API shapes; renders `Card` for each tour.

---

### `BlogPostsSection` (components/BlogPostsSection/BlogPostsSection.jsx)
- Purpose: Fetches blog posts and renders top 3 using `BlogCard`.
- Path: `app-next/components/BlogPostsSection/BlogPostsSection.jsx`
- Styles: `app-next/components/BlogPostsSection/BlogPostsSection.module.css`
- Behavior: Uses `api()` helper in `app-next/utils/api.js` to build URLs; fetches posts and renders `BlogCard`.

---

### `AttractionsSection` (components/AttractionsSection/AttractionsSection.jsx)
- Purpose: Fetches popular attractions and renders `AttractionCard` items (top 3).
- Path: `app-next/components/AttractionsSection/AttractionsSection.jsx`
- Styles: `app-next/components/AttractionsSection/AttractionsSection.module.css`
- Behavior: Uses `api()` helper and renders `AttractionCard` for each fetched attraction.

---

### `AttractionSearchResults` (components/AttractionSearchResults/AttractionSearchResults.jsx)
- Purpose: Presentational list for attraction search results. Shows loading/error/no-results states and a grid of attraction cards with admin actions.
- Path: `app-next/components/AttractionSearchResults/AttractionSearchResults.jsx`
- Styles: `app-next/components/AttractionSearchResults/AttractionSearchResults.module.css`
- Props: `attractions`, `isLoading`, `error`, `hasSearched`, `onEdit`, `onDelete`

---

### `TestPage` (components/TestPage/TestPage.jsx)
- Purpose: Small test utility page that requests `/nested` via `api()` helper and displays returned message. Can be removed after development.
- Path: `app-next/components/TestPage/TestPage.jsx`

---


### `SearchBox` (components/SearchBox/SearchBox.jsx)
  - `placeholder` (string)
  - `onSearch` (function) — called with the input value on every change
  - `onClear` (function) — called when clear button clicked
  - `isLoading` (boolean)
  - `className` (string) — optional container class

```jsx
<SearchBox placeholder="Find tours" onSearch={(q) => setQuery(q)} onClear={() => setQuery('')} />
```


(Other components)
  - use `useFavorite` when they include a heart toggle
  - use module CSS files located in the same folder
### `BurgerIcon` (components/Header/BurgerIcon.jsx)
- Purpose: Presentational hamburger icon that animates to an X when open. Used by the header mobile menu toggle.
- Path: `app-next/components/Header/BurgerIcon.jsx`
- Styles: `app-next/components/Header/BurgerIcon.module.css`
- Props: `open` (boolean) — controls open/closed state.

---

### `BurgerMenu` (components/Header/BurgerMenu.jsx)
- Purpose: Mobile menu wrapper that shows/hides the mobile navigation & children when `open`.
- Path: `app-next/components/Header/BurgerMenu.jsx`
- Styles: `app-next/components/Header/BurgerMenu.module.css`
- Props: `open` (boolean) — whether menu is visible; `children` — menu contents.

---

---

## Hooks

### `useFavorite` (app-next/hooks/useFavorite.js)
- Purpose: Provide an optimistic favorites toggle with localFallback (localStorage) and server synchronization.
- Path: `app-next/hooks/useFavorite.js`
- Inputs:
  - `itemId` (string|number) — id of the item
  - `itemType` (string) — type to send to server (defaults to `'post'`)
  - `initial` (boolean|undefined) — if provided, the hook will use this as initial state. If not provided the hook will look into `localStorage.favorites` to decide initial state.
- Returns:
  - `{ favourite, toggle, loading, error, setFavourite }`
- Behavior:
  - Optimistically sets `favourite` and updates a `favorites` item in `localStorage` so unauthenticated users still have local favorites.
  - Emits a `favoritesChanged` event on `window` so other components can remain in sync.
  - If `localStorage.token` is present, the hook performs POST/DELETE requests to `/api/favorites`.
  - On server error, reverts the optimistic update and restores localStorage accordingly.
- Usage example:

```jsx
const { favourite, toggle, loading } = useFavorite({ itemId: 'abc', itemType: 'tour' });
<button onClick={toggle} disabled={loading}>{favourite ? '♥' : '♡'}</button>
```

---

### Search hooks: `useTourSearch`, `useAttractionSearch`, `usePostSearch`, `useUserSearch`
- Purpose: Provide debounced/search helper hooks that call the admin search endpoints (`/api/admin/*?search=...`).
- Paths:
  - `app-next/hooks/useTourSearch.js` (exports `useTourSearch`)
  - `app-next/hooks/useAttractionSearch.js` (exports `useAttractionSearch`)
  - `app-next/hooks/usePostSearch.js` (exports `usePostSearch`)
  - `app-next/hooks/useUserSearch.js` (exports `useUserSearch`)
- Common API:
  - State: `searchTerm`, `setSearchTerm`, `searchResults`, `isSearching`, `searchError`, `hasSearched`, `clearSearch`
  - Behavior: debounces user input (300ms typically), calls an admin endpoint with `?search=...&limit=...`, handles token header if `localStorage.token` present, and sets state.
- Example:

```jsx
const { searchTerm, setSearchTerm, searchResults, isSearching, clearSearch } = useAttractionSearch();
// wire `setSearchTerm` to a SearchBox `onSearch` handler
```

---

## Recommendations & Notes
- Many components repeat image normalization and HEAD-check logic. Consider extracting a small utility `utils/image.js` with `normalizeImageUrl(src, fallbackSeed, apiUrl)` and a `useHeadCheckImage(src)` hook.
- `useFavorite` uses `localStorage` fallback and global events. Keep that behavior but document it clearly for future contributors.
- Consider centralizing `API_URL` into a small `utils/api.js` exporting a single `API_URL` constant, or import from `app-next/utils/api.js` if present.

---

## Next steps (optional)
- Add small inline Storybook stories or Storybook-like demo pages under `app-next/stories/` for interactive testing of components.
- Add TypeScript types or JSDoc comments to components to make props explicit.

---

## Appendix: component & hook file list
(Automatically gathered — source files found)

Components (selected):
```
app-next/components/AttractionCard/AttractionCard.jsx
app-next/components/BlogCard/BlogCard.jsx
app-next/components/Card/Card.jsx
app-next/components/TourBooking/TourBooking.jsx
app-next/components/TourSearchResults/TourSearchResults.jsx
app-next/components/SearchBox/SearchBox.jsx
... (other presentational components in `app-next/components`)
```

Hooks:
```
app-next/hooks/useFavorite.js
app-next/hooks/useTourSearch.js
app-next/hooks/useAttractionSearch.js
app-next/hooks/usePostSearch.js
app-next/hooks/useUserSearch.js
```

---

## Concrete usage examples

### Booking flow (client)
The `TourBooking` component is intended to be embedded on a tour details page. It handles number selection, total price display (when available), and posts to the existing booking API. Example usage:

```jsx
import TourBooking from '@/components/TourBooking/TourBooking';

export default function TourDetails({ tour }) {
  return (
    <div>
      <h1>{tour.name}</h1>
      <p>{tour.description}</p>
      <TourBooking tourId={tour.id} capacity={tour.capacity} priceMinor={tour.price_minor} />
    </div>
  );
}
```


### Optimistic favorites (hook)
Example showing how `useFavorite` can be used directly in custom UI (outside the built-in Card components):

```jsx
import useFavorite from '@/hooks/useFavorite';

function FavoriteButton({ id, type = 'tour' }) {
  const { favourite, toggle, loading } = useFavorite({ itemId: id, itemType: type });
  return (
    <button onClick={toggle} disabled={loading} aria-pressed={favourite}>
      {favourite ? 'Unfavorite' : 'Favorite'}
    </button>
  );
}
```


### Card with navigation and favorites
The `Card` component is designed for listing tours. Parent components typically map over an array of tours and pass a `viewLink` for navigation:

```jsx
import Card from '@/components/Card/Card';

function SearchResults({ tours }) {
  return (
    <div className="grid">
      {tours.map((t) => (
        <Card key={t.id} card={t} viewLink={`/tours/${t.id}`} onFavoriteChange={(ev) => console.log(ev)} />
      ))}
    </div>
  );
}
```


### Hook + SearchBox integration
Example wiring of `useAttractionSearch` to `SearchBox`:

```jsx
import SearchBox from '@/components/SearchBox/SearchBox';
import { useAttractionSearch } from '@/hooks/useAttractionSearch';

function AttractionSearchPanel() {
  const { searchTerm, setSearchTerm, searchResults, isSearching, clearSearch } = useAttractionSearch();

  return (
    <div>
      <SearchBox placeholder="Search attractions" onSearch={setSearchTerm} onClear={clearSearch} isLoading={isSearching} />
      <div>
        {searchResults.map((a) => (
          <div key={a.id}>{a.name}</div>
        ))}
      </div>
    </div>
  );
}
```

