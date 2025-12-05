# React Migration Setup Instructions

## Step 1: Install Dependencies

Run these commands in your terminal (make sure you're in the Zeal directory):

```bash
# Install React and React DOM
npm install react react-dom

# Install React types
npm install -D @types/react @types/react-dom

# Install Vite React plugin
npm install -D @vitejs/plugin-react

# Install Tailwind CSS v4 and dependencies
npm install -D tailwindcss@next @tailwindcss/vite@next

# Install Framer Motion
npm install framer-motion

# Install additional dependencies
npm install clsx tailwind-merge
```

## Step 2: Initialize Shadcn/ui

```bash
# Initialize shadcn/ui (this will create components.json)
npx shadcn@latest init
```

When prompted, choose:
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind config: Yes (tailwind.config.ts)
- Components location: @/components
- Utils location: @/lib/utils
- React Server Components: No
- Write configuration: Yes

## Step 3: Start Development Server

After all files are created:

```bash
npm run dev
```

## What's Being Changed

1. ✅ Migrating from vanilla TypeScript to React
2. ✅ Adding Tailwind CSS v4 for styling
3. ✅ Installing Shadcn/ui component system
4. ✅ Adding Framer Motion for animations
5. ✅ Converting all components to React functional components
6. ✅ Adding the HeroParallax component from Aceternity

## File Structure After Migration

```
Zeal/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── hero-parallax.tsx        (New - Aceternity component)
│   │   │   └── hero-parallax-demo.tsx   (New - Demo wrapper)
│   │   ├── Header.tsx                   (Converted from vanilla TS)
│   │   ├── FeaturedWork.tsx             (Converted)
│   │   ├── Sidebar.tsx                  (Converted)
│   │   └── VideoModal.tsx               (Converted)
│   ├── lib/
│   │   └── utils.ts                     (Shadcn utility functions)
│   ├── styles/
│   │   └── globals.css                  (Tailwind directives)
│   ├── App.tsx                          (New - Main app component)
│   └── main.tsx                         (Updated - React entry point)
├── components.json                      (New - Shadcn config)
├── tailwind.config.ts                   (New - Tailwind config)
├── tsconfig.json                        (Updated)
├── vite.config.ts                       (Updated for React)
└── index.html                           (Updated for React root)
```

## Notes

- Your old vanilla TypeScript components will remain in `src/js/components/` for reference
- The new React components will be in `src/components/`
- CSS files in `src/styles/components/` can be kept as reference or deleted after migration
- All functionality will be preserved with improved performance and animations
