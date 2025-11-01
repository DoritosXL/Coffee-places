# Coffee Places Frontend

A modern, responsive web application for finding coffee places, built with React, TypeScript, and Tailwind CSS. The app features an intelligent search bar with autocomplete functionality for filtering by city and tags (like "wifi").

## Features

- **Smart Search**: Autocomplete search bar that suggests cities and tags as you type
- **Mobile-First Design**: Responsive layout that works beautifully on mobile and desktop
- **Claude-Inspired UI**: Clean, centered design similar to modern AI chat interfaces
- **Type-Safe**: Built with TypeScript and Zod for runtime validation
- **Component Library**: Storybook integration for component development and documentation
- **Tested**: Unit tests with Vitest and React Testing Library

## Tech Stack

- **React 19** - Latest React with modern hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Storybook** - Component development environment
- **Vitest** - Unit testing framework
- **Axios** - HTTP client
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd coffee-places-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint:
```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` to set your API URL:
- **For local API**: `VITE_API_URL=http://localhost:4000/api`
- **For production API (via proxy)**: `VITE_API_URL=/api`

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Note**: If you're running the API locally, make sure it's running on `http://localhost:4000` before starting the frontend.

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Testing

### Unit Tests

Run unit tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Storybook

Run Storybook for component development:
```bash
npm run storybook
```

Access Storybook at `http://localhost:6006`

Build Storybook:
```bash
npm run build-storybook
```

## How to Use

1. **Type in the search bar**: Start typing a city name or "wifi"
2. **Autocomplete suggestions**: As you type, you'll see autocomplete suggestions appear
3. **Tab to accept**: Press Tab to accept the suggestion, or continue typing
4. **Search**: Press Enter or click the Search button
5. **View results**: The coffee places matching your search will be displayed below

### Search Examples

- Type "wi" → autocomplete suggests "wifi" (tag)
- Type "am" → autocomplete suggests "Amsterdam" (city)
- Search by city: "Amsterdam"
- Search by tag: "wifi"

## Project Structure

```
coffee-places-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── SearchBar.tsx
│   │   ├── SearchBar.test.tsx
│   │   ├── SearchBar.stories.tsx
│   │   └── ResultsDisplay.tsx
│   ├── services/           # API services
│   │   └── api.ts
│   ├── types/              # TypeScript types
│   │   └── coffeePlace.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── .storybook/            # Storybook configuration
├── public/                # Static assets
└── package.json          # Dependencies and scripts
```

## API Integration

The app consumes the Coffee Places API with support for both local and production environments.

### Environment Configuration

The API endpoint is controlled by the `VITE_API_URL` environment variable:

- **Local Development** (`.env.local`):
  ```
  VITE_API_URL=http://localhost:4000/api
  ```
  Points directly to your local API server.

- **Production** (`.env.production`):
  ```
  VITE_API_URL=/api
  ```
  Uses Vite's proxy to forward requests to `https://nara-vf9k.vercel.app` (avoiding CORS issues).

### API Endpoints

- **Base URL**: Configured via `VITE_API_URL`
- **Endpoint**: `/places`
- **Query Parameters**:
  - `city` - Filter by city name
  - `tags` - Filter by tags (comma-separated)

### Running the Local API

If you're developing the backend locally:

1. Start your local API server on `http://localhost:4000`
2. Ensure `.env.local` has `VITE_API_URL=http://localhost:4000/api`
3. Restart the frontend dev server to pick up the environment variable

## Component Documentation

### SearchBar

The main search component with autocomplete functionality.

**Props:**
- `availableCities: string[]` - List of cities for autocomplete
- `availableTags: string[]` - List of tags for autocomplete
- `onSearch: (query: string, type: 'city' | 'tag' | null) => void` - Search callback
- `placeholder?: string` - Custom placeholder text
- `className?: string` - Additional CSS classes

### ResultsDisplay

Displays the search results in a card layout.

**Props:**
- `results: CoffeePlace[] | null` - Array of coffee places
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message

## License

This project is created for educational purposes.

## API Documentation

For more information about the API, visit: [https://nara-vf9k.vercel.app/docs](https://nara-vf9k.vercel.app/docs)
