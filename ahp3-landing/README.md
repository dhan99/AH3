# AHP3 Landing Page

This project is a pixel-perfect implementation of the Intact Insurance A&H eCommerce Acquisition App landing page, based on the Figma design.

## Tech Stack

- **Frontend Framework**: React with Next.js (TypeScript)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: Auth0
- **Backend**: Supabase with PostgreSQL
- **Testing**: Jest

## Features

- Responsive design that matches the Figma specification
- Authentication with Auth0
- Seamless integration with Supabase backend
- State management with Zustand
- Comprehensive test coverage with Jest

## Project Structure

- `/src/components/landing`: Contains all the landing page components
- `/src/components/ui`: Contains reusable UI components
- `/src/store`: Contains Zustand store configuration
- `/src/utils`: Contains utility functions for Auth0 and Supabase
- `/src/app`: Contains Next.js app router pages

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:

```
# Auth0
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Testing

Run the tests with:

```bash
npm test
# or
yarn test
```

## Deployment

This project can be deployed on Vercel or any other hosting platform that supports Next.js.

## License

This project is licensed under the MIT License.
