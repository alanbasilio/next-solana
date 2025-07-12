# 🌍 Next.js i18n Starter

A modern, production-ready Next.js starter template with internationalization (i18n) support, built with the latest technologies and best practices.

## 🚀 Features

- **🌐 Internationalization**: Multi-language support with i18next
- **⚡ Next.js 15**: Latest version with Turbopack for fast development
- **🎨 Tailwind CSS 4**: Modern utility-first CSS framework
- **🔧 TypeScript**: Full type safety and better developer experience
- **🎯 Radix UI**: Accessible and customizable UI components
- **📱 Responsive Design**: Mobile-first approach
- **🔍 SEO Optimized**: Built-in SEO optimization
- **🛡️ Security**: Dependency vulnerability monitoring
- **🤖 Automated Updates**: Dependency management with Renovate/Dependabot

## 🛠️ Tech Stack

### Core
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Internationalization
- **[i18next](https://www.i18next.com/)** - Internationalization framework
- **[react-i18next](https://react.i18next.com/)** - React integration
- **[i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector)** - Language detection
- **[accept-language](https://github.com/tinganho/node-accept-language)** - Server-side language detection

### UI & Styling
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Class Variance Authority](https://cva.style/)** - Component variants
- **[clsx](https://github.com/lukeed/clsx)** - Conditional classes
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind classes

### Data Fetching
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting (via ESLint config)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Yarn (recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd next-i18n-starter

# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
next-i18n-starter/
├── app/
│   ├── [lng]/                 # Language-specific pages
│   │   ├── layout.tsx         # Layout component
│   │   └── page.tsx           # Home page
│   ├── components/            # Shared components
│   │   ├── ui/                # UI components
│   │   └── language-switcher.tsx
│   └── globals.css            # Global styles
├── lib/
│   ├── i18n/                  # i18n configuration
│   ├── react-query/           # React Query setup
│   └── utils.ts               # Utility functions
├── public/
│   └── locales/               # Translation files
│       ├── en/
│       └── pt/
├── middleware.ts              # Next.js middleware
└── components.json            # shadcn/ui configuration
```

## 🌍 Internationalization

### Supported Languages
- English (`en`)
- Portuguese (`pt`)

### Adding New Languages

1. Add the language code to `lib/i18n/settings.ts`:
```typescript
export const languages = ['en', 'pt', 'es']; // Add 'es' for Spanish
```

2. Create translation files in `public/locales/[lang]/`:
```
public/locales/es/common.json
```

3. Add translations to the new file:
```json
{
  "welcome": "Bienvenido",
  "edit": "Editar",
  // ... more translations
}
```

### Using Translations

```typescript
import { useTranslation } from '@/lib';

export default function Component() {
  const { t } = useTranslation('en');
  
  return <h1>{t('welcome')}</h1>;
}
```

## 📦 Dependency Management

This project includes automated dependency management tools to keep packages updated and secure.

### 🤖 Automated Tools

- **Renovate** (`renovate.json`) - Automated dependency updates
- **Dependabot** (`.github/dependabot.yml`) - GitHub native dependency updates
- **GitHub Actions** - Automated testing for dependency updates

### 🛠️ Manual Commands

```bash
# Check outdated packages
yarn deps:check

# Update dependencies interactively
yarn deps:update

# Security audit
yarn deps:audit

# Fix vulnerabilities
yarn deps:fix
```

### 🔒 Security

- Automatic vulnerability scanning
- Weekly security audits
- Dependency update automation
- Branch protection rules

## 🎨 UI Components

This starter includes pre-built UI components using Radix UI and Tailwind CSS:

- **Button** - Various styles and sizes
- **Tabs** - Language switcher implementation
- **Custom components** - Language switcher, layouts

### Adding New Components

```bash
# Add a new shadcn/ui component
npx shadcn-ui@latest add [component-name]
```

## 🚀 Scripts

```bash
# Development
yarn dev          # Start development server with Turbopack
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint

# Dependencies
yarn deps:check   # Check for outdated packages
yarn deps:update  # Update dependencies interactively
yarn deps:audit   # Security audit
yarn deps:fix     # Fix vulnerabilities
```

## 📝 Environment Variables

Create a `.env.local` file for local development:

```bash
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

```bash
# Deploy to Vercel
vercel --prod
```

### Other Platforms

This Next.js app can be deployed to any platform that supports Node.js:

- **Netlify**
- **Railway**
- **DigitalOcean**
- **AWS**
- **Google Cloud**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [i18next Documentation](https://www.i18next.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)

---

**Happy coding! 🎉**
