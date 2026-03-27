# Project Development Guidelines

This document provides project-specific information for developers working on the `catalog-fe` project.

## Build and Configuration

The project is built using **Vite** and **TypeScript**.

### Prerequisites
- Node.js (Latest LTS recommended)
- npm

### Installation
```bash
npm install
```

### Development Server
To start the development server with hot-reload:
```bash
npm run dev
```

### Build for Production
To build the project for production, which includes type checking and minification:
```bash
npm run build
```

### Linting
The project uses **ESLint** for code quality:
```bash
npm run lint
```

## Project Structure and Development Info

- **Models**: Business logic and data structures are located in `src/model`.
- **Views**: Vue components for pages are in `src/views`.
- **I18n**: Multi-language support is handled via `vue-i18n` in `src/i18n`.
- **API**: API communication is generally handled through Axios (see `src/connector`).

### Code Style
- Follow the existing formatting (standard for Vue/TypeScript projects).
- Use **TypeScript** strictly for all new logic.
- Ensure all user-facing strings are added to the i18n JSON files in `src/i18n/locales`.

### Key Dependencies
- **Vue 3**: Composition API is used throughout.
- **Vite**: Build tool and dev server.
- **yup & vee-validate**: Used for form validation.
- **Bootstrap**: CSS framework.
