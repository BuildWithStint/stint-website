# Project Structure

## Overview
This is a professional React + TypeScript project with a clean, modular architecture.

## Directory Structure

```
freelace/
├── public/                      # Static assets
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── components/              # React components
│   │   ├── sections/           # Page sections
│   │   │   ├── Hero.tsx        # Hero section with parallax
│   │   │   ├── Ticker.tsx      # Animated ticker
│   │   │   ├── Manifesto.tsx   # Company manifesto
│   │   │   ├── Services.tsx    # Services showcase
│   │   │   ├── Work.tsx        # Portfolio grid
│   │   │   ├── Team.tsx        # Team cards
│   │   │   ├── WhyUs.tsx       # Value propositions
│   │   │   └── Contact.tsx     # Contact form
│   │   │
│   │   ├── CustomCursor.tsx    # Custom cursor
│   │   ├── MagneticBtn.tsx     # Magnetic button
│   │   ├── Nav.tsx             # Navigation
│   │   ├── Footer.tsx          # Footer
│   │   └── index.ts            # Component exports
│   │
│   ├── constants/              # App constants
│   │   └── index.ts            # Site config, nav links, etc.
│   │
│   ├── data/                   # Data files
│   │   ├── services.ts         # Services data
│   │   ├── work.ts             # Portfolio work
│   │   └── team.ts             # Team members
│   │
│   ├── styles/                 # Global styles
│   │   └── globals.css         # CSS variables & base styles
│   │
│   ├── types/                  # TypeScript types
│   │   └── index.ts            # Type definitions
│   │
│   ├── utils/                  # Utility functions
│   │   ├── animations.ts       # Animation variants
│   │   └── helpers.ts          # Helper functions
│   │
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
│
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package.json                # Dependencies
├── README.md                   # Project documentation
├── STRUCTURE.md                # This file
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

## Key Principles

### 1. **Separation of Concerns**
- Components are split into logical sections
- Data is separated from presentation
- Utilities are isolated for reusability

### 2. **Type Safety**
- All data structures have TypeScript interfaces
- Props are properly typed
- Constants use `as const` for literal types

### 3. **Reusability**
- Common components (MagneticBtn, CustomCursor) are extracted
- Animation variants are centralized
- Helper functions are shared

### 4. **Maintainability**
- Clear folder structure
- Consistent naming conventions
- Centralized configuration

## Component Architecture

### Layout Components
- **CustomCursor**: Global custom cursor with magnetic effect
- **Nav**: Responsive navigation with scroll effects
- **Footer**: Site footer with social links

### Interactive Components
- **MagneticBtn**: Button with magnetic hover effect

### Section Components
Each section is self-contained with its own:
- State management
- Animation logic
- Responsive design

## Data Flow

```
constants/index.ts → components → App.tsx
data/*.ts → components → App.tsx
```

## Styling Approach

1. **Tailwind CSS** for utility classes
2. **CSS Variables** for theming (in globals.css)
3. **Inline styles** for dynamic values
4. **Framer Motion** for animations

## Adding New Features

### Adding a New Section
1. Create component in `src/components/sections/`
2. Export from `src/components/index.ts`
3. Import and add to `App.tsx`

### Adding New Data
1. Define type in `src/types/index.ts`
2. Create data file in `src/data/`
3. Import in relevant component

### Adding New Constants
1. Add to `src/constants/index.ts`
2. Use `as const` for type safety
3. Import where needed

## Performance Considerations

- Lazy loading for images
- Debounced/throttled event handlers
- Optimized animations with Framer Motion
- Code splitting ready

## Best Practices

1. **Always type your props**
2. **Use constants for repeated values**
3. **Keep components focused and small**
4. **Extract reusable logic to utils**
5. **Use semantic HTML**
6. **Maintain accessibility**
