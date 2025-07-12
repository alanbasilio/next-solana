# 🌍 Next Solana

A modern, production-ready Next.js starter template with internationalization (i18n) support, built with the latest technologies and best practices.

## 🚀 Features

### 🌐 **Core Features**

- **Internationalization**: Multi-language support with i18next
- **Next.js 15**: Latest version with App Router and Turbopack
- **TypeScript**: Full type safety with strict mode
- **Tailwind CSS 4**: Modern utility-first CSS framework
- **Radix UI**: Accessible and customizable UI components
- **TanStack Query**: Powerful data synchronization

### 🔧 **Developer Experience**

- **Prettier**: Automatic code formatting with import sorting
- **ESLint**: Custom rules with Prettier integration
- **Husky**: Git hooks for pre-commit, commit-msg, and pre-push
- **Lint-staged**: Automatic formatting on commit
- **Commitlint**: Conventional commits enforcement
- **Bundle Analyzer**: Performance analysis (`yarn analyze`)
- **VSCode**: Optimized settings and extensions
- **TypeScript**: Strict mode and advanced configurations

### 🎨 **UI/UX**

- **Dark/Light Mode**: Seamless theme switching with next-themes
- **Theme System**: Comprehensive theme provider and switcher
- **Responsive Design**: Mobile-first approach
- **Accessible Components**: WCAG compliant with Radix UI
- **Modern Design**: Clean and professional interface

### 🔒 **Security**

- **Security Headers**: CSP, HSTS, X-Frame-Options, and more
- **Content Security Policy**: Configured for maximum security
- **Type-safe Environment Variables**: Zod validation
- **Input Validation**: Schema-based validation system

### 🔍 **SEO & Performance**

- **Dynamic Metadata**: Optimized meta tags and OpenGraph
- **Twitter Cards**: Social media optimization
- **JSON-LD**: Structured data for better search results
- **Image Optimization**: AVIF/WebP support
- **Bundle Optimization**: Automatic code splitting and optimization

### 🌐 **Internationalization**

- **i18next**: Complete i18n framework
- **Language Detection**: Automatic browser language detection
- **Middleware**: Smart routing for language-specific pages
- **Type-safe Translations**: Full TypeScript support

### 📦 **DevOps & Deployment**

- **Automated Dependencies**: Renovate/Dependabot integration
- **GitHub Actions**: CI/CD pipeline ready
- **Vercel Optimized**: One-click deployment
- **Docker Ready**: Containerization support

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
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Class Variance Authority](https://cva.style/)** - Component variants
- **[clsx](https://github.com/lukeed/clsx)** - Conditional classes
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind classes

### Data Fetching

- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting with custom rules
- **[Prettier](https://prettier.io/)** - Code formatting with import sorting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Lint-staged](https://github.com/okonet/lint-staged)** - Pre-commit formatting
- **[Commitlint](https://commitlint.js.org/)** - Conventional commits
- **[@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)** - Bundle analysis

### Validation & Security

- **[Zod](https://zod.dev/)** - Schema validation
- **Security Headers** - Comprehensive security configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn (recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd next-solana

# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
next-solana/
├── app/
│   ├── [lng]/                 # Language-specific pages
│   │   ├── layout.tsx         # Layout with theme support
│   │   └── page.tsx           # Home page
│   ├── components/            # Shared components
│   │   ├── ui/                # UI components
│   │   ├── theme-provider.tsx # Theme context
│   │   ├── theme-switcher.tsx # Theme toggle
│   │   └── language-switcher.tsx
│   └── globals.css            # Global styles
├── lib/
│   ├── i18n/                  # i18n configuration
│   ├── react-query/           # React Query setup
│   ├── metadata.ts            # SEO utilities
│   ├── env.ts                 # Environment validation
│   └── utils.ts               # Utility functions
├── public/
│   └── locales/               # Translation files
│       ├── en/
│       └── pt/
├── .husky/                    # Git hooks
├── .vscode/                   # VSCode configuration
├── middleware.ts              # Next.js middleware
├── next.config.ts             # Next.js configuration
├── commitlint.config.js       # Commitlint configuration
├── .prettierrc.json           # Prettier configuration
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
  "edit": "Editar"
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

## 🎨 Themes

### Theme System

This starter includes a comprehensive theme system with:

- **Light/Dark modes** with system preference detection
- **Theme Provider** for consistent theming
- **Theme Switcher** component with smooth transitions
- **Tailwind CSS** integration with CSS variables

### Using Themes

```typescript
import { useTheme } from 'next-themes';

export default function Component() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
}
```

## 📦 Scripts

### Development

```bash
yarn dev              # Start development server with Turbopack
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint
yarn lint:fix         # Fix linting issues automatically
yarn format           # Format code with Prettier
yarn format:check     # Check code formatting
yarn type-check       # TypeScript type checking
yarn analyze          # Analyze bundle size
```

### Dependencies

```bash
yarn deps:check       # Check for outdated packages
yarn deps:update      # Update dependencies interactively
yarn deps:audit       # Security audit
yarn deps:fix         # Fix vulnerabilities
```

## 🔒 Security

### Security Headers

This starter includes comprehensive security headers:

- **Content Security Policy (CSP)**
- **HTTP Strict Transport Security (HSTS)**
- **X-Frame-Options**
- **X-Content-Type-Options**
- **Referrer-Policy**
- **Permissions-Policy**

### Environment Variables

Type-safe environment variables with Zod validation:

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

## 🔍 SEO Optimization

### Metadata API

Dynamic metadata generation with:

- **OpenGraph** tags
- **Twitter Cards**
- **JSON-LD** structured data
- **Language alternates**
- **Canonical URLs**

### Usage

```typescript
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata({
  title: 'Your Page Title',
  description: 'Your page description',
  image: '/og-image.jpg',
});
```

## 🎯 Git Hooks & Code Quality

### Automated Checks

- **Pre-commit**: Linting and formatting
- **Commit-msg**: Conventional commits validation
- **Pre-push**: Type checking and tests

### Conventional Commits

This project uses conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style/formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance tasks

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

## 📊 Performance

### Bundle Analysis

Analyze your bundle size:

```bash
yarn analyze
```

### Optimization Features

- **Automatic code splitting**
- **Image optimization** (AVIF/WebP)
- **Font optimization**
- **CSS optimization**
- **JavaScript minification**

## 🧪 Testing (Coming Soon)

### Planned Testing Setup

- **Jest + React Testing Library** for unit tests
- **Playwright** for E2E tests
- **Storybook** for component documentation
- **Coverage reporting**

## 📈 Monitoring (Coming Soon)

### Planned Monitoring Tools

- **Sentry** for error tracking
- **Web Vitals** tracking
- **Performance monitoring**
- **Real User Monitoring (RUM)**

## 🤝 Contributing

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/alanbasilio/next-solana.git
cd next-solana

# Install dependencies
yarn install

# Set up git hooks
yarn prepare

# Start development
yarn dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [i18next Documentation](https://www.i18next.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)

---

**Happy coding! 🎉**
