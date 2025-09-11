# Overview

A React-based project proposal form application for SEED (environmental initiative) that allows users to create, submit, and export project proposals. The application provides a structured form for collecting project details including team information, problem statements, goals, objectives, timelines, and budget information. Users can save drafts locally, submit proposals to a Supabase database, and export their data to Excel format.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 19.1.1 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS 4.1 with custom design system and Shadcn/ui components
- **Form Management**: React Hook Form with Zod validation for robust form handling
- **State Management**: Local state with localStorage for draft persistence

## Component Structure
- **UI Components**: Modular Shadcn/ui components (Button, Input, Textarea, Form, Label)
- **Form Components**: Centralized ProjectProposalForm with dynamic field arrays
- **Layout Components**: Navbar with SEED branding
- **Utility Functions**: Export utilities for Excel generation and form data formatting

## Data Validation
- **Schema Validation**: Zod schemas for comprehensive form validation
- **Email Validation**: Custom Rutgers email validation requirements
- **Type Safety**: Full TypeScript integration with inferred types from Zod schemas

## Data Flow
- **Local Storage**: Automatic draft saving with configurable storage key
- **Form State**: Centralized form state management with React Hook Form
- **Submission Flow**: Validated data submitted to Supabase with error handling
- **Export Flow**: Form data converted to structured Excel format using XLSX library

## Styling System
- **Design Tokens**: CSS custom properties for consistent theming
- **Component Variants**: Class Variance Authority for component styling
- **Responsive Design**: Mobile-first approach with Tailwind utilities
- **Color Scheme**: Green-themed design system aligned with environmental focus

# External Dependencies

## Database
- **Supabase**: PostgreSQL database with real-time capabilities for storing project proposals
- **Environment Variables**: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for configuration

## UI Libraries
- **Radix UI**: Accessible component primitives (Dialog, Label, Slot)
- **Lucide React**: Icon library for consistent iconography
- **Shadcn/ui**: Pre-built component library based on Radix and Tailwind

## Form and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between React Hook Form and Zod

## Utility Libraries
- **XLSX**: Excel file generation for proposal exports
- **clsx + tailwind-merge**: Conditional class name handling
- **tw-animate-css**: Enhanced animation utilities for Tailwind

## Development Tools
- **TypeScript**: Static type checking and enhanced developer experience
- **ESLint**: Code linting with React-specific rules
- **Vite**: Development server and build tool with HMR support