# Overview

MeeChain Wallet is a secure digital Web3 wallet application designed for the Thai market. The project is built as a full-stack web application with a React frontend and Express.js backend, featuring a comprehensive 7-step onboarding flow that guides users through social authentication, security setup, wallet creation, and initial missions. The wallet supports both demo and live modes, includes biometric authentication options, and provides users with rewards for completing onboarding tasks.

# Recent Changes

## September 4, 2025 - Project Restructure
- **Restructured project organization**: Created new directory structure with frontend/, backend/, shared/, and assets/branding/
- **Added MeeChain branding**: Integrated official MeeChain logo (cute bear with chain design) into the application, replacing generic wallet icons
- **Improved modularity**: Separated concerns with dedicated folders for components, API logic, and shared resources
- **Created documentation**: Added README.md explaining the project structure and key features
- **Maintained compatibility**: Ensured all import paths and configurations work correctly with the new structure

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React using Vite as the build tool and follows a component-based architecture. The application uses TypeScript for type safety and implements the following key patterns:

- **UI Framework**: Shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with a dark theme design system featuring purple/blue accent colors
- **State Management**: Context-based state management for onboarding flow using custom hooks
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management

## Backend Architecture
The server-side follows an Express.js REST API pattern with the following structure:

- **API Design**: RESTful endpoints organized by feature domains (auth, wallet, onboarding, missions)
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Authentication**: Social authentication flow supporting multiple providers (Google, Facebook, LINE)
- **Security**: PIN-based authentication with hashing, biometric enablement support

## Data Storage Solutions
The application uses Drizzle ORM for database interactions with PostgreSQL as the target database:

- **Schema Design**: Three main entities - users, wallets, and onboarding_progress
- **Database**: PostgreSQL with Neon serverless integration
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management

## Authentication and Authorization
Multi-layered security approach:

- **Social Authentication**: OAuth integration with major providers
- **PIN Security**: 6-digit PIN with bcrypt-style hashing
- **Biometric Support**: Optional biometric authentication enablement
- **Session Management**: Express sessions with PostgreSQL session store

## Design System
Comprehensive design system built on Tailwind CSS:

- **Theme**: Dark-first design with purple/blue gradient accents
- **Typography**: Inter font family with multiple weights
- **Components**: Extensive component library using Radix UI primitives
- **Responsive**: Mobile-first responsive design patterns

# External Dependencies

## Core Framework Dependencies
- **Frontend**: React 18, Vite, TypeScript
- **Backend**: Express.js, Node.js with ES modules
- **Database**: PostgreSQL via Neon serverless, Drizzle ORM

## UI and Styling
- **Component Library**: Radix UI primitives (@radix-ui/react-*)
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React icon library
- **Fonts**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)

## State Management and Data Fetching
- **Query Management**: TanStack React Query v5
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Validation**: Zod schema validation

## Development and Build Tools
- **Build Tool**: Vite with React plugin
- **Database Tools**: Drizzle Kit for migrations
- **Development**: TSX for TypeScript execution, ESBuild for production builds
- **Replit Integration**: Vite plugins for runtime error overlay and cartographer

## Authentication and Security
- **Database Connectivity**: Neon Database serverless driver
- **Session Storage**: connect-pg-simple for PostgreSQL session store
- **Password Hashing**: Crypto module for PIN hashing (to be replaced with bcrypt in production)

## Utility Libraries
- **Date Handling**: date-fns for date manipulation
- **Styling Utilities**: clsx and class-variance-authority for conditional classes
- **Command Interface**: cmdk for command palette functionality