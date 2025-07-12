# Contributing to Next Polyglot

First off, thanks for taking the time to contribute! ❤️

The following is a set of guidelines for contributing to Next Polyglot. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible using our issue template.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A step-by-step description of the suggested enhancement
- Specific examples to demonstrate the steps
- A description of the current behavior and expected behavior
- Screenshots or mockups if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Add tests for your changes (if applicable)
5. Run the test suite to ensure everything passes
6. Update documentation if necessary
7. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/next-polyglot.git
cd next-polyglot

# Install dependencies
yarn install

# Set up git hooks
yarn prepare

# Start development server
yarn dev
```

## Code Style

This project uses automated code formatting and linting:

- **ESLint** for JavaScript/TypeScript linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Lint-staged** for pre-commit checks

### Running Code Quality Tools

```bash
# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# Check formatting
yarn format:check

# Type checking
yarn type-check
```

## Commit Message Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Please format your commit messages as follows:

```
type(scope): subject

body

footer
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

### Examples

```
feat(i18n): add Spanish language support

Add Spanish translations and update language configuration
to support es-ES locale.

Closes #123
```

```
fix(theme): resolve dark mode toggle issue

Fix theme persistence bug where dark mode preference
wasn't being saved correctly to localStorage.

Fixes #456
```

## Testing

Currently, the project is preparing to implement testing. Once available:

- Write tests for new features
- Update existing tests when modifying code
- Ensure all tests pass before submitting PR

## Documentation

- Update the README.md if you change functionality
- Add JSDoc comments for new functions/components
- Update TypeScript types as needed

## Project Structure

Understanding the project structure will help you contribute effectively:

```
next-polyglot/
├── app/                    # Next.js app directory
│   ├── [lng]/             # Language-specific routes
│   └── components/        # React components
├── lib/                   # Utility libraries
│   ├── i18n/             # Internationalization setup
│   └── utils.ts          # Helper functions
├── public/               # Static assets
│   └── locales/          # Translation files
├── .husky/               # Git hooks
├── .vscode/              # VS Code settings
└── .github/              # GitHub templates
```

## Adding New Languages

To add support for a new language:

1. Add the language code to `lib/i18n/settings.ts`
2. Create translation files in `public/locales/[lang]/`
3. Update the language switcher component
4. Test the new language thoroughly

## Questions?

If you have questions about contributing, please:

1. Check the existing documentation
2. Search through existing issues
3. Create a new issue with the "question" label

## Recognition

Contributors will be recognized in our README.md file and release notes.

Thank you for contributing to Next Polyglot! 🎉
