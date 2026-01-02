# CaptureIt™ - Global Wellness Community

## Overview

CaptureIt™ is a comprehensive wellness platform that combines AI-driven coaching, biometric tracking, and global community features to transform users' wellness journeys. The application provides personalized wellness insights, mental health support through AI therapy sessions, community engagement with karma-based rewards, and environmental impact tracking. The platform features a modern React frontend with TypeScript, a Node.js/Express backend, and PostgreSQL database integration using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with **React 18** and **TypeScript**, utilizing **Vite** as the build tool for fast development and optimized production builds. The UI is constructed with **shadcn/ui components** built on top of **Radix UI primitives**, providing accessible and customizable interface elements. **Tailwind CSS** handles styling with a custom design system featuring wellness-focused color schemes (ocean, sage, lavender palettes) and glassmorphism effects.

The application uses **Wouter** for lightweight client-side routing and **TanStack Query (React Query)** for efficient server state management, caching, and data synchronization. The component architecture follows modern React patterns with custom hooks for authentication (`useAuth`), theme management (`useTheme`), and mobile responsiveness detection.

**State management** is handled through a combination of React Query for server state, React Context for global UI state (theme), and local component state for UI interactions. The theme system supports light, dark, and nature themes with persistent storage.

### Backend Architecture
The server is built on **Node.js** with **Express.js**, implementing a RESTful API architecture with WebSocket support for real-time features. The application uses **Replit Authentication** with OpenID Connect for secure user authentication and session management.

**Route organization** separates concerns into distinct modules:
- Authentication routes for user management
- Biometric data collection and analysis endpoints  
- Community features (posts, groups, interactions)
- Wellness activity tracking and karma system
- AI therapy sessions and crisis support
- Environmental impact calculations

The server implements **middleware layers** for authentication, request logging, error handling, and CORS management. WebSocket connections enable real-time features like chat rooms and live community interactions.

### Data Storage Architecture
**PostgreSQL** serves as the primary database with **Drizzle ORM** providing type-safe database operations and migrations. The schema design centers around user profiles with related entities for biometric data, wellness activities, community posts, therapy sessions, and karma transactions.

**Database relationships** are structured to support:
- User authentication and profile management
- Time-series biometric data storage
- Community content with engagement metrics
- Therapy session history and message threading
- Karma transaction tracking and environmental impact metrics

**Session storage** uses PostgreSQL with the `connect-pg-simple` adapter for Express sessions, ensuring scalable session management.

### AI Integration Architecture
The platform integrates **OpenAI's API** for AI-powered wellness coaching and therapy sessions. The wellness analysis system processes biometric data to generate personalized insights, recommendations, and crisis detection capabilities.

**AI features include**:
- Biometric data analysis with wellness scoring
- Personalized activity recommendations
- Crisis content detection and intervention
- Therapeutic conversation management with context awareness
- Mood tracking and mental health insights

The system implements safeguards for crisis detection, automatically providing emergency resources and professional support contacts when concerning content is identified.

### Real-time Communication
**WebSocket implementation** supports real-time features including community chat rooms, live wellness challenges, and instant karma notifications. The WebSocket manager handles connection lifecycle, automatic reconnection, and message broadcasting with proper error handling.

## External Dependencies

### Core Framework Dependencies
- **React 18** with TypeScript for component-based UI development
- **Vite** for fast development server and optimized production builds
- **Node.js/Express.js** for server-side API and middleware
- **Drizzle ORM** with PostgreSQL adapter for database operations

### UI and Styling
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Lucide React** and **Font Awesome** for comprehensive icon sets
- **Google Fonts** (Inter, Playfair Display) for typography

### Data Management
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling
- **date-fns** for date manipulation and formatting

### Authentication and Security
- **Replit Authentication** using OpenID Connect protocol
- **Passport.js** with OpenID Connect strategy
- **Express Session** with PostgreSQL session store
- **bcrypt** equivalent security through Replit's auth system

### AI and External Services
- **OpenAI API** for AI-powered wellness coaching and therapy
- **Stripe** integration for payment processing and subscriptions
- **AWS S3** with presigned URLs for secure file uploads
- **WebSocket (ws)** library for real-time communication

### Development and Deployment
- **TypeScript** for static type checking across the full stack
- **ESBuild** for efficient server-side bundling
- **PostCSS** with Autoprefixer for CSS processing
- **Replit-specific plugins** for development environment integration

### Database and Storage
- **PostgreSQL** as primary database with Neon serverless hosting
- **Drizzle Kit** for database migrations and schema management
- **WebSocket constructor** compatibility for serverless environments

The architecture prioritizes type safety, real-time functionality, and scalable wellness data processing while maintaining a clean separation of concerns between frontend presentation, backend business logic, and external service integrations.