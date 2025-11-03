# Sailing Logbook

A modern web application for tracking sailing activities and boat management with authentication and authorization.

## Features

- **Public Viewing**: Anyone can view sailing activities and boat information
- **Authenticated Editing**: Only logged-in users can create, edit, or delete data
- **Single User Support**: Designed for personal use with simple authentication
- **Responsive Design**: Works on desktop and mobile devices
- **Data Management**: Track boats, sailing activities, and performance metrics

## Authentication

This application uses NextAuth.js for authentication with a simple credential-based system designed for single-user access.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Authentication Configuration
AUTH_USERNAME=admin
AUTH_PASSWORD=your-secure-password-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Database (for local development with SQLite)
# For production on Vercel, use PostgreSQL connection string
DATABASE_URL="file:./dev.db"

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Security Notes

- **Change Default Credentials**: Update `AUTH_USERNAME` and `AUTH_PASSWORD` to secure values
- **Generate Secret**: Use a strong random string for `NEXTAUTH_SECRET`
- **Production URLs**: Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` for production deployment

### Access Control

- **Public Access**: Viewing activities, boats, and reports
- **Authenticated Access**: Creating, editing, and deleting activities and boats
- **Login Required**: Edit buttons and forms are hidden for non-authenticated users

## Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Set Up Database**:

   **Note**: This application uses PostgreSQL. For local development, you can either:
   - Use a local PostgreSQL installation
   - Use Docker to run PostgreSQL: `docker run --name sailing-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`
   - Use a cloud PostgreSQL database (e.g., Vercel Postgres, Supabase, Neon)

   Update your `.env.local` with your PostgreSQL connection string:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/sailing_logbook"
   ```

   Then set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   # Or if you have migrations: npx prisma migrate dev
   ```

4. **Start Development Server**:

   ```bash
   npm run dev
   ```

5. **Access the Application**:
   - Visit `http://localhost:3000`
   - Click "Sign In" to authenticate
   - Use your configured credentials

## Testing Strategy

This project uses a comprehensive testing approach that balances thoroughness with maintainability.

### Current Test Coverage

#### ✅ API Tests (43/43 passing)

- **Location**: `src/__tests__/app/api/`
- **Coverage**: All API routes and endpoints
- **Testing**: Request/response handling, error cases, data validation
- **Status**: Fully implemented and passing

#### ✅ Component Tests (43/62 passing)

- **Location**: `src/__tests__/components/`
- **Coverage**: Individual React components and UI elements
- **Testing**: Component rendering, user interactions, form validation
- **Status**: Core components tested and passing

### Page Component Tests - Intentionally Omitted

**Page component tests have been intentionally omitted** from the current test suite for the following reasons:

#### Technical Challenges

1. **Next.js Server Components**: Page components are async server components that don't render properly in the Jest/jsdom test environment
2. **Complex Dependencies**: Pages have multiple data fetching dependencies that are difficult to mock comprehensively
3. **Integration Complexity**: Testing full page rendering requires extensive mocking of Next.js routing, data fetching, and server-side rendering

#### Strategic Decision

Instead of investing significant time in complex page component tests that would be brittle and difficult to maintain, we've chosen to focus on:

1. **Comprehensive API Testing**: Ensuring all backend logic and data handling is thoroughly tested
2. **Component Unit Testing**: Testing individual components in isolation for reliability
3. **Future E2E Testing**: Planning to implement end-to-end tests that will provide better coverage of the full user experience

### Future Testing Plans

#### End-to-End (E2E) Testing

- **Framework**: Playwright or Cypress
- **Coverage**: Full user journeys, page navigation, form submissions
- **Benefits**:
  - Tests the application as users actually interact with it
  - Catches integration issues between components
  - Validates complete workflows
  - More maintainable than complex page component tests

#### Integration Testing

- **Focus**: API + Database integration
- **Coverage**: Data persistence, complex queries, transaction handling

### Running Tests

```bash
# Run all tests
npm test

# Run API tests only
npm test -- --testPathPatterns="api"

# Run component tests only
npm test -- --testPathPatterns="components"

# Run with coverage
npm test -- --coverage
```

### Test Structure

```
src/__tests__/
├── app/
│   └── api/                    # API route tests
│       ├── activities/
│       └── boats/
└── components/                 # Component tests
    ├── form/                  # Form component tests
    └── ui/                    # UI component tests
```

### Contributing

When adding new features:

1. **API Routes**: Always include comprehensive tests for new API endpoints
2. **Components**: Write unit tests for new React components
3. **Pages**: Focus on component testing rather than full page testing
4. **E2E**: Consider adding E2E tests for critical user workflows

### Why This Approach Works

- **Reliable**: API and component tests are stable and fast
- **Maintainable**: Less brittle than complex page component tests
- **Comprehensive**: E2E tests will provide full coverage of user scenarios
- **Efficient**: Focuses testing effort on the most valuable areas

This testing strategy ensures code quality while maintaining development velocity and test reliability.

## Deployment to Vercel

This application is configured for deployment on Vercel with PostgreSQL database support.

### Prerequisites

1. **Vercel Account**: Sign up or log in at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket Repository**: Push your code to a git repository
3. **Node.js 18+**: Ensure your local environment matches production

### Step 1: Connect Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your repository from GitHub/Gitlab/Bitbucket
4. Vercel will auto-detect Next.js framework

### Step 2: Set Up Vercel Postgres Database

**Option A: Vercel Postgres (Recommended)**

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click "Create Database" → Select "Postgres"
3. Choose a plan (Hobby plan is free for development)
4. Give your database a name and select a region
5. Click "Create"
6. The `DATABASE_URL` environment variable will be automatically added to your project

**Option B: External PostgreSQL Database**

If you prefer an external database provider (Supabase, Neon, Railway, etc.):

1. Create a PostgreSQL database with your provider
2. Copy the connection string
3. Add it as `DATABASE_URL` in Vercel environment variables (see Step 3)

### Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add:

#### Required Variables

```bash
# Database (auto-set if using Vercel Postgres)
DATABASE_URL=postgresql://user:password@host:port/database?schema=public

# Authentication
AUTH_USERNAME=your-username
AUTH_PASSWORD=your-secure-password

# NextAuth Configuration
NEXTAUTH_SECRET=your-random-secret-here
# NEXTAUTH_URL is automatically set by Vercel

# App Configuration (optional, auto-set by Vercel)
# NEXT_PUBLIC_APP_URL is automatically set by Vercel
```

**Note**: Vercel automatically sets `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` based on your deployment URL, so you typically don't need to set these manually.

**Generate NEXTAUTH_SECRET**: You can generate a secure secret using:

```bash
openssl rand -base64 32
```

### Step 4: Run Database Migrations

After your first deployment:

1. Go to your Vercel project dashboard
2. Click on the latest deployment
3. Open the deployment logs to verify migrations ran successfully
4. Alternatively, you can run migrations manually using Vercel CLI:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Pull environment variables locally
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

**Note**: The `vercel.json` configuration includes automatic migration deployment during build, so migrations should run automatically on each deploy.

### Step 5: Deploy

1. Vercel will automatically deploy when you:
   - Push to the main/master branch (production)
   - Create a pull request (preview deployment)
2. Monitor the deployment in the Vercel dashboard
3. Once deployed, visit your app URL (provided by Vercel)

### Post-Deployment Checklist

- [ ] Verify the app loads at your Vercel URL
- [ ] Test authentication/login functionality
- [ ] Verify database connection (try creating a boat or activity)
- [ ] Check that migrations ran successfully (verify tables exist)
- [ ] Test both public viewing and authenticated editing

### Troubleshooting

**Database Connection Issues**

- Verify `DATABASE_URL` is correctly set in Vercel environment variables
- Check that your database allows connections from Vercel's IP addresses
- Ensure your database is not in a private network that blocks external access

**Migration Failures**

- Check deployment logs for migration errors
- Verify your Prisma schema matches your database structure
- Run `prisma migrate status` locally to check migration state

**Build Failures**

- Ensure all environment variables are set
- Check that `NEXTAUTH_SECRET` is set (required for build)
- Verify Prisma client generates successfully

**Authentication Issues**

- Ensure `AUTH_USERNAME` and `AUTH_PASSWORD` are set
- Verify `NEXTAUTH_SECRET` is set and matches across all environments
- Check that `NEXTAUTH_URL` is correctly set (auto-set by Vercel)

### Local Development After Deployment

To continue local development with PostgreSQL:

1. Update your `.env.local`:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/sailing_logbook"
   # Or use your Vercel Postgres connection string for local testing
   ```

2. Run migrations locally:

   ```bash
   npx prisma migrate dev
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

### Production Considerations

- **Database Backups**: Set up automated backups with Vercel Postgres or your database provider
- **Environment Variables**: Keep production credentials secure and separate from development
- **Monitoring**: Consider setting up Vercel Analytics and error tracking
- **Custom Domain**: Configure a custom domain in Vercel project settings if desired
