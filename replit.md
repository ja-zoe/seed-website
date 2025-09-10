# Overview

The SEED Project Proposal Form is a React-based web application that allows users to submit environmental project proposals and provides an admin dashboard for managing submissions. The application has recently been migrated from direct PostgreSQL access to Supabase integration, providing a more secure and scalable backend solution. The system features a public-facing form for proposal submissions, admin authentication, and comprehensive proposal management capabilities including search, filtering, and Excel export functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18+ with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router DOM for client-side navigation
- **Styling**: Tailwind CSS v4 with custom green theme and shadcn/ui components
- **Form Management**: React Hook Form with Zod schema validation for robust form handling
- **State Management**: React hooks for local state, no global state management library

## Backend Architecture
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS) policies
- **Authentication**: Supabase Auth for admin login and session management
- **API Layer**: Supabase client-side SDK for direct database operations
- **Data Validation**: Zod schemas for TypeScript-first validation

## Security Model
- **Public Access**: Form submissions require no authentication (open to all users)
- **Admin Access**: Protected routes requiring Supabase authentication
- **Row Level Security**: Database-level security policies control data access
- **Email Validation**: Restricted to Rutgers university email domains (@rutgers.edu, @scarletmail.rutgers.edu)

## Data Architecture
- **Proposals Table**: JSONB columns for flexible nested data storage
- **Auto-save**: Client-side draft storage in localStorage
- **Export System**: Excel export functionality using XLSX library
- **Search**: Full-text search across proposal content and metadata

# External Dependencies

## Core Dependencies
- **@supabase/supabase-js**: Backend-as-a-Service for database and authentication
- **@hookform/resolvers**: React Hook Form integration with validation libraries
- **react-hook-form**: Form state management and validation
- **zod**: Schema validation and TypeScript type generation
- **react-router-dom**: Client-side routing

## UI Components
- **@radix-ui/react-***: Accessible component primitives (dialog, label, slot)
- **shadcn/ui**: Pre-built component library based on Radix UI
- **lucide-react**: Icon library for consistent iconography
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

## Utility Libraries
- **xlsx**: Excel file generation for proposal exports
- **clsx & tailwind-merge**: CSS class name utilities
- **google-auth-library & google-spreadsheet**: Google Sheets integration (legacy)

## Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting with React-specific rules
- **Vite**: Development server and build tool

## Environment Configuration
- **VITE_SUPABASE_URL**: Supabase project URL
- **VITE_SUPABASE_ANON_KEY**: Supabase anonymous key for client access

The application is designed as a single-page application with distinct public and admin sections, leveraging Supabase's built-in security features to ensure proper access control while maintaining a smooth user experience.