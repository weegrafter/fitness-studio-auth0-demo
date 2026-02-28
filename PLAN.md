# Auth0 Fitness Studio Demo - Consolidated Plan

## 🚨 CRITICAL CONSTRAINT
**MAXIMUM 5 USER STORIES. NO EXCEPTIONS.**

Any implementation plan with more than 5 stories is a failure. Combine related work into broad, meaningful chunks. Each story should represent a complete functional area, not micro-tasks.

---

## Goal
Build a Next.js demo showcasing Auth0 authentication, RBAC, and progressive email verification for a fitness studio.

## Tech Stack
- Next.js 15 App Router + TypeScript
- Auth0 Next.js SDK
- Tailwind CSS
- JSON file storage (already exists: premium-content.json, upgrade-requests.json)

---

## User Stories (5 MAXIMUM)

### US-1: Complete Auth0 Integration
**What**: Full Auth0 setup from SDK to helpers
- Install and configure Auth0 Next.js SDK
- Environment variables and configuration
- Auth API routes (`/api/auth/[auth0]`)
- Session management utilities (getUser, getSession helpers)
- User context and session helpers
- TypeScript types for User/Session
- Basic tests to verify Auth0 setup works

**Deliverable**: Login/logout works, session persists, user data accessible throughout app

---

### US-2: Three-Tier Page Structure
**What**: All three pages with appropriate access control
- **Public Home page** - Hero, auth status, login/logout buttons, membership tier overview
- **Members page** - Protected (auth required), member content, welcome message, upgrade CTA
- **Premium page** - Protected (auth + RBAC), premium content from JSON, role check
- Auth middleware for route protection
- Role-checking utilities (hasRole, requireRole)
- Navigation between pages

**Deliverable**: Three working pages with correct access control - public/authenticated/RBAC

---

### US-3: Progressive Email Verification
**What**: Complete email verification flow
- Check `email_verified` flag from Auth0 user
- Allow first login without verified email (set session flag)
- Block subsequent logins if email still unverified
- Email verification required page with messaging
- "Resend verification email" button
- API route to trigger Auth0 verification email
- Session tracking for first-login exception

**Deliverable**: New users log in first time, get blocked second time if unverified, can resend verification

---

### US-4: Upgrade Request System
**What**: Complete upgrade request flow
- Upgrade request form on Members page
- Form validation and submission
- API route to save requests to JSON file (upgrade-requests.json)
- Success confirmation after submission
- Simple admin view page showing all pending upgrade requests
- API route to read upgrade requests
- Display request details (user, email, timestamp, status)

**Deliverable**: Members can request upgrades, data persists, admin can view pending requests

---

### US-5: Polish & Testing
**What**: Production-ready code quality
- Error handling and loading states for all pages
- Better UI/styling with Tailwind
- Comprehensive test coverage:
  - Auth flows (login/logout/session)
  - Protected routes (redirect when unauthenticated)
  - RBAC (premium role checking)
  - Email verification logic
  - Upgrade request flow
  - API routes
- Environment variable validation
- README with setup instructions
- Code cleanup and documentation

**Deliverable**: Production-ready app with full test coverage, proper error handling, good UX

---

## Data Files (Already Exist)
- `data/premium-content.json` - Premium workout videos
- `data/upgrade-requests.json` - Upgrade requests
- Both have .example files committed

## Auth0 Setup Required
- Regular Web Application
- Callback: `http://localhost:3000/api/auth/callback`
- Logout: `http://localhost:3000`
- Create "premium" role
- Add roles to access token via Action/Rule

## Environment Variables
```
AUTH0_SECRET=<generate-random>
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.auth0.com
AUTH0_CLIENT_ID=<from-auth0>
AUTH0_CLIENT_SECRET=<from-auth0>
```

---

## Success Criteria
✅ All 5 user stories complete
✅ Three-tier access working (public/auth/RBAC)
✅ Progressive email verification enforced
✅ Upgrade requests persist and viewable
✅ Clean code with TypeScript
✅ Comprehensive test coverage
✅ Production-ready quality
