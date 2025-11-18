# HSR Project

Next.js project with Bun runtime.

## Stack

- **Next.js** - Full React framework with SSR, SSG, ISR, API routes, and App Router
- **Bun** - JS runtime and package manager
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **App Router** - Modern Next.js routing with React Server Components

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed

### Installation

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
```

### Development

```bash
# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Create production build
bun build

# Start production server
bun start
```

### Lint

```bash
bun lint
```

## Project Structure

```
src/
├── app/           # App Router pages, layouts, API routes
├── components/    # Shared UI components
├── lib/           # Utilities (API client, helpers)
└── hooks/         # Custom React hooks

public/            # Static assets
```

## Environment Variables

- `NEXT_PUBLIC_*` - Variables exposed to the browser
- Other variables - Server-side only

## Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint

