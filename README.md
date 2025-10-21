# Sailing Log

A modern sailing logbook application built with Next.js, Prisma, and Chakra UI. Track your sailing activities, manage your boats, and keep detailed records of your sailing adventures.

## Features

- **Boat Management**: Add and manage your boats with detailed specifications
- **Activity Logging**: Record sailing activities with weather conditions, navigation data, and notes
- **Activity Tracking**: View and edit your sailing history
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Prisma** - Database ORM with SQLite
- **Chakra UI** - Modern component library
- **TypeScript** - Type-safe development
- **Zod** - Schema validation

## Database Setup

The app uses SQLite with Prisma. To set up the database:

```bash
npx prisma generate
npx prisma db push
```

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable UI components
- `src/lib/` - Database and utility functions
- `src/types/` - TypeScript type definitions
- `src/validation/` - Zod schemas for data validation
- `prisma/` - Database schema and migrations
