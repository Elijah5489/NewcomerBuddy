# Ukrainian Learning App

## Overview

This is a comprehensive Ukrainian language and cultural learning application that combines translation services, dictionary features, educational modules, historical content, and community resources. The app is designed as a mobile-first progressive web application to help users learn Ukrainian language while understanding its cultural and historical context.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**January 6, 2025**
- ✓ Fixed all TypeScript compilation errors and missing component imports
- ✓ Implemented voice recorder component with browser speech recognition
- ✓ Created historical timeline with visual category icons and Ukrainian color scheme
- ✓ Added bottom navigation for seamless mobile experience
- ✓ Resolved date handling for community events display
- ✓ Application now fully functional with all pages working

**Project Status**: Core functionality complete and working. Ready for feature enhancements.

## System Architecture

### Frontend Architecture
The client application uses React with TypeScript in a single-page application (SPA) architecture. The UI is built with shadcn/ui components based on Radix UI primitives and styled with Tailwind CSS using a Ukrainian-themed color palette (blue and yellow). The application uses Wouter for client-side routing and TanStack Query for state management and API calls.

The app follows a mobile-first responsive design pattern with a bottom navigation bar and card-based layouts optimized for mobile usage. Key UI patterns include:
- Ukrainian color scheme (blue #0056b3 and yellow #ffd700)
- Mobile-optimized layouts with bottom navigation
- Voice interaction capabilities using browser Speech API
- Progressive loading with skeleton states

### Backend Architecture
The server is built with Express.js and follows a RESTful API design pattern. The architecture separates concerns through:
- **Route handlers** (`server/routes.ts`) that define API endpoints
- **Storage abstraction** (`server/storage.ts`) that provides an interface for data operations
- **Middleware setup** for request logging, error handling, and development tooling

The backend currently uses an in-memory storage implementation but is designed to be database-agnostic through the IStorage interface pattern.

### Data Storage Solutions
The application uses Drizzle ORM as the database toolkit with PostgreSQL as the target database (configured for Neon serverless). The schema defines six main entities:
- **Users** - for authentication and progress tracking
- **Translations** - for storing user translation history
- **Dictionary Entries** - for the Ukrainian-English dictionary
- **Historical Events** - for Ukrainian historical timeline content
- **Learning Modules** - for structured language lessons
- **Community Resources** - for cultural centers, services, and events

The storage layer abstracts database operations to support both development (in-memory) and production (PostgreSQL) environments.

### Authentication and Authorization
The application structure suggests session-based authentication will be implemented, with user progress tracking and personalized content delivery. The current implementation includes user schema and progress tracking capabilities but authentication middleware is not yet implemented.

### Development and Build System
The project uses Vite as the build tool with custom configuration for:
- Hot module replacement in development
- TypeScript compilation with strict mode
- Path aliases for clean imports (@/, @shared/, @assets/)
- Development middleware integration with Express server

The build process creates separate bundles for client (static assets) and server (Node.js application), optimized for deployment platforms like Replit.

## External Dependencies

### Core Frontend Libraries
- **React 18** - UI framework with TypeScript support
- **TanStack Query** - Server state management and caching
- **Wouter** - Lightweight client-side routing
- **Radix UI** - Accessible UI primitive components
- **shadcn/ui** - Pre-built component library
- **Tailwind CSS** - Utility-first styling framework

### Backend and Database
- **Express.js** - Node.js web application framework
- **Drizzle ORM** - TypeScript-first ORM for database operations
- **Drizzle Kit** - Database migration and introspection tools
- **PostgreSQL** - Primary database (via @neondatabase/serverless)
- **connect-pg-simple** - PostgreSQL session store for Express

### Development and Build Tools
- **Vite** - Frontend build tool and development server
- **TypeScript** - Static type checking
- **ESBuild** - Fast JavaScript bundler for server builds
- **PostCSS** - CSS processing with Tailwind
- **tsx** - TypeScript execution for development

### Browser APIs and Integrations
- **Web Speech API** - For voice recognition and text-to-speech
- **Service Worker** (planned) - For offline functionality
- **Replit Development Tools** - For Replit-specific development features

The application is designed to work primarily with browser-native APIs for speech functionality and does not rely on external translation services, making it privacy-focused and offline-capable for core features.