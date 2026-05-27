# stint - Creative Collective Portfolio

A modern, animated portfolio website for a creative agency built with React, TypeScript, Framer Motion, and Tailwind CSS.

## 🚀 Features

- **Custom Cursor**: Magnetic cursor with smooth animations
- **Parallax Effects**: Mouse-tracking parallax on hero section
- **Smooth Animations**: Framer Motion powered scroll animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Hover effects, flip cards, and magnetic buttons
- **Modern Stack**: React 19, TypeScript, Vite

## 📁 Project Structure

```
src/
├── components/
│   ├── sections/
│   │   ├── Hero.tsx          # Hero section with parallax
│   │   ├── Ticker.tsx        # Animated ticker tape
│   │   ├── Manifesto.tsx     # Company manifesto
│   │   ├── Services.tsx      # Services showcase
│   │   ├── Work.tsx          # Portfolio work grid
│   │   ├── Team.tsx          # Team cards with flip effect
│   │   ├── WhyUs.tsx         # Value propositions
│   │   └── Contact.tsx       # Contact form
│   ├── CustomCursor.tsx      # Custom cursor component
│   ├── MagneticBtn.tsx       # Magnetic button component
│   ├── Nav.tsx               # Navigation bar
│   └── Footer.tsx            # Footer component
├── data/
│   ├── services.ts           # Services data
│   ├── work.ts               # Portfolio work data
│   └── team.ts               # Team members data
├── styles/
│   └── globals.css           # Global styles and CSS variables
├── App.tsx                   # Main app component
└── main.tsx                  # Entry point

```

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Customization

### Colors
Edit CSS variables in `src/styles/globals.css`:
```css
:root {
  --background: #0A0A0B;
  --foreground: #F2EDE4;
  --card: #131315;
  --accent: #C8973D;
}
```

### Content
- **Services**: Edit `src/data/services.ts`
- **Portfolio Work**: Edit `src/data/work.ts`
- **Team Members**: Edit `src/data/team.ts`

### Fonts
The project uses Google Fonts:
- Playfair Display (headings)
- DM Sans (body text)
- DM Mono (labels/tags)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ by the AXIS team
