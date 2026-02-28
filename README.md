# FitFlow Studio - Auth0 Demo

A Next.js demo application showcasing Auth0 authentication, RBAC (Role-Based Access Control), and progressive email verification for a fitness studio membership platform.

## Features

✅ **Three-Tier Access Control**
- Public home page (no authentication)
- Members area (authentication required)
- Premium content (authentication + "premium" role required)

✅ **Auth0 Integration**
- Social and email/password login
- Secure session management
- User profile data

✅ **RBAC (Role-Based Access Control)**
- Premium role enforcement
- Roles extracted from Auth0 access tokens
- Protected routes and content

✅ **Progressive Email Verification**
- First login allowed without verification (explore the app)
- Subsequent logins blocked until email verified
- Resend verification email functionality

✅ **Upgrade Request System**
- Members can request premium access
- Form submission with JSON storage
- Admin dashboard to view pending requests

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Authentication**: Auth0 Next.js SDK
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Storage**: JSON files (demo purposes)

## Prerequisites

- Node.js 18+ and npm
- Auth0 account (free tier works)

## Auth0 Setup

### 1. Create Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new application (type: "Regular Web Application")
3. Note your Domain, Client ID, and Client Secret

### 2. Configure Application Settings

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:3000
```

### 3. Create Roles

1. Go to User Management > Roles
2. Create a new role called `premium`
3. (Optional) Assign the role to test users

### 4. Add Roles to Access Token

Create an Auth0 Action to add roles to the access token:

1. Go to Actions > Flows > Login
2. Create a new Custom Action named "Add Roles to Token"
3. Add this code:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  if (event.authorization) {
    // Add roles to access token
    api.accessToken.setCustomClaim('roles', event.authorization.roles);
  }
};
```

4. Deploy the action and add it to your Login flow

### 5. Enable Email Verification

1. Go to Authentication > Templates > Verification Email
2. Ensure email verification is enabled
3. Customize the template if desired

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/weegrafter/fitness-studio-auth0-demo.git
   cd fitness-studio-auth0-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   
   Edit `.env.local` with your Auth0 credentials:
   ```env
   AUTH0_SECRET=<generate-random-32-char-string>
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.auth0.com
   AUTH0_CLIENT_ID=<your-client-id>
   AUTH0_CLIENT_SECRET=<your-client-secret>
   ```

   To generate AUTH0_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Create data directory**
   ```bash
   mkdir -p data
   cp data/premium-content.example.json data/premium-content.json
   cp data/upgrade-requests.example.json data/upgrade-requests.json
   ```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npx tsc --noEmit
```

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── auth/[auth0]/      # Auth0 authentication routes
│   │   ├── resend-verification/ # Email verification resend
│   │   └── upgrade-request/    # Upgrade request API
│   ├── admin/
│   │   └── upgrade-requests/   # Admin dashboard
│   ├── members/                # Members area
│   │   └── upgrade/            # Upgrade request form
│   ├── premium/                # Premium content (RBAC)
│   ├── verify-email/           # Email verification page
│   ├── layout.tsx
│   └── page.tsx                # Public home page
├── lib/
│   ├── auth0.ts                # Auth0 utilities
│   └── email-verification.ts  # Email verification logic
├── types/
│   ├── auth.ts                 # Auth type definitions
│   └── data.ts                 # Data type definitions
├── tests/                      # Test files
├── data/                       # JSON storage (gitignored)
└── middleware.ts               # Route protection
```

## How It Works

### Authentication Flow

1. User clicks "Sign In" → redirected to Auth0
2. User authenticates with Auth0
3. Auth0 redirects back to `/api/auth/callback`
4. Session created and user logged in

### Progressive Email Verification

1. **First login**: User can access the app even if email is unverified
2. Cookie set to track first login: `first_login_{userId}`
3. **Subsequent logins**: If email still unverified, user redirected to `/verify-email`
4. User can resend verification email via the verification page
5. After verifying email in their inbox, user can log in normally

### RBAC (Premium Content)

1. Auth0 Action adds user roles to access token
2. Backend extracts roles from token (checks multiple namespaces)
3. Premium page checks for "premium" role
4. Users without role see upgrade prompt

### Upgrade Requests

1. Member submits upgrade request via form
2. Request saved to `data/upgrade-requests.json`
3. Admin views requests at `/admin/upgrade-requests`
4. (In production, admin would approve/reject and assign roles)

## Testing Scenarios

### Test User Without Premium

1. Sign up for a new account
2. Access Members area → ✅ works
3. Try to access Premium → ❌ shows upgrade prompt
4. Submit upgrade request
5. View request in admin dashboard

### Test Email Verification

1. Sign up with new unverified email
2. First login → ✅ allowed to access Members
3. Logout and login again → ❌ redirected to verify-email
4. Click "Resend Verification Email"
5. Check inbox and verify email
6. Login again → ✅ works normally

### Test Premium User

1. Create user in Auth0
2. Assign "premium" role
3. Login
4. Access Premium content → ✅ works
5. See exclusive workout videos

## Production Considerations

This is a demo app. For production, you should:

- [ ] Replace JSON storage with a real database (PostgreSQL, MongoDB, etc.)
- [ ] Add proper admin authentication (Auth0 roles/permissions)
- [ ] Implement actual payment processing for premium upgrades
- [ ] Add rate limiting for API routes
- [ ] Implement proper logging and monitoring
- [ ] Add email templates for notifications
- [ ] Secure the admin dashboard properly
- [ ] Add pagination for large datasets
- [ ] Implement proper error boundaries
- [ ] Add comprehensive E2E tests

## License

MIT

## Support

For issues or questions:
- Check [Auth0 Documentation](https://auth0.com/docs)
- Open an issue on GitHub
