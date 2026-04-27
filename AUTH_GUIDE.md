# IT Support Portal - Authentication & User Management

## Overview

This application implements a complete authentication and authorization system using **Netlify Identity** for TanStack Start. It provides:

- **User authentication** via email/password login
- **Role-based access control** (Admin vs User)
- **Protected routes** with automatic redirects
- **Admin dashboard** for managing user accounts and subscriptions
- **User dashboard** for viewing subscription status (read-only)
- **WhatsApp support integration** for customer support

## Architecture

### Authentication Flow

```
Unauthenticated User
        ↓
    Login Page (/login)
        ↓
   Enter Credentials
        ↓
    Authentication ✓
        ↓
   Check Role
   ├─→ Admin → Admin Dashboard (/admin)
   └─→ User → User Dashboard (/dashboard)
```

### Protected Routes

- `/` - Redirects to `/login` if not authenticated, or to `/dashboard`/`/admin` based on role
- `/login` - Public login page
- `/dashboard` - Protected user dashboard (requires authentication, user role)
- `/admin` - Protected admin dashboard (requires authentication, admin role)

## File Structure

```
src/
├── lib/
│   ├── auth.ts              # Auth utilities & server functions
│   └── identity-context.tsx # React context for auth state
├── middleware/
│   └── identity.ts          # Middleware for route protection
└── routes/
    ├── __root.tsx           # Root layout with IdentityProvider
    ├── index.tsx            # Landing page (redirects based on auth)
    ├── login.tsx            # Login page
    ├── dashboard.tsx        # User dashboard (read-only subscriptions)
    └── admin.tsx            # Admin dashboard (user management)
```

## Key Files

### `src/lib/auth.ts`

Server functions for authentication:

```typescript
getServerUser()        // Get current authenticated user
hasRole(user, role)    // Check if user has a specific role
isAdmin(user)          // Check if user is admin
clientLogin(email, password)   // Client-side login
clientLogout()         // Client-side logout
```

### `src/lib/identity-context.tsx`

React context providing auth state to components:

```typescript
useIdentity() // Hook to access:
  // - user: Current user object or null
  // - ready: Whether auth state has been initialized
  // - logout: Function to logout
  // - isAdmin: Boolean indicating admin status
```

### Route Loaders

Each protected route uses `beforeLoad` to verify authentication:

```typescript
beforeLoad: async () => {
  const user = await getServerUser()
  if (!user) throw redirect({ to: '/login' })
  if (user.user_metadata?.role !== 'admin') {
    throw redirect({ to: '/dashboard' })
  }
}
```

## User Roles

Users are assigned roles via Netlify Identity's `user_metadata.role`:

| Role | Capabilities |
|------|--------------|
| `user` | View their own subscriptions (read-only) |
| `admin` | Create/manage user accounts, assign subscriptions, deactivate users |

### Setting User Roles

In Netlify Dashboard:

1. Go to **Site settings** → **Identity**
2. Click on a user
3. Edit **User metadata** JSON:

```json
{
  "role": "admin"
}
```

Or for regular users:

```json
{
  "role": "user"
}
```

## Development Setup

### Prerequisites

1. Node.js 18+
2. Netlify CLI: `npm install -g netlify-cli`
3. A Netlify site with Identity enabled

### Local Development

1. Clone repository
2. Install dependencies: `npm install`
3. Create `.env` file:

```env
VITE_NETLIFY_SITE_URL=https://your-site.netlify.app
```

4. Deploy to Netlify (staging/production)
5. Run development server: `netlify dev`
6. Visit http://localhost:8888

⚠️ **Important**: Netlify Identity only works on actual Netlify deployments. Local development with `npm run dev` will not have authentication. Always use `netlify dev` for testing auth features.

### Production Build

```bash
npm run build
netlify deploy --prod
```

## User Flow

### Admin User Flow

1. Admin logs in with their credentials
2. Redirected to `/admin` dashboard
3. Can:
   - View all user accounts
   - Create new user accounts (email is auto-generated login credential)
   - Activate/deactivate user accounts
   - Send login credentials to users via secure means (not via WhatsApp)

### Regular User Flow

1. User receives login credentials from admin
2. Visits the app and logs in
3. Redirected to `/dashboard` with their subscription status
4. Can:
   - View active/expiring/expired subscriptions
   - See renewal dates and days remaining
   - Contact support via WhatsApp button
5. Cannot edit or modify any subscription information

## WhatsApp Integration

WhatsApp support link: `https://wa.me/message/IIIBPBTDMJ66O1`

The app includes a floating WhatsApp button on all authenticated pages. Users can click to:
- Ask about subscription renewals
- Report issues
- Request support

## Customization

### Changing WhatsApp Link

Update in:
- `src/routes/dashboard.tsx` - Line with `wa.me/message/...`
- `src/routes/index.tsx` - `WHATSAPP_LINK` constant

### Changing Login UI

Edit `src/routes/login.tsx` to customize styling, error handling, or add features like "Forgot Password" or "Remember Me".

### Adding Subscription Management

Modify `src/routes/admin.tsx`:
- Replace mock `mockUsers` with API calls
- Add subscription assignment logic
- Integrate with a database

## Mobile Responsiveness

All pages are fully responsive:
- Breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Tailwind CSS utility classes
- Touch-friendly buttons (44px minimum height on mobile)

## Security Considerations

1. **Never store sensitive data locally** - Netlify Identity handles token storage securely
2. **Use server functions for sensitive operations** - Database queries, API keys, etc.
3. **JWT tokens** - Automatically validated by `@netlify/identity`
4. **HTTPS only** - All Identity features require secure connections
5. **Role enforcement** - Always verify roles on the server, not just the client

## Troubleshooting

### "Authentication required" Error

- Ensure you're logged in to a Netlify-deployed site (not localhost)
- Check that Netlify Identity is enabled in site settings
- Verify user credentials are correct

### Redirect Loop

- Check `beforeLoad` logic in route files
- Ensure `getServerUser()` is being called
- Verify environment variables are set

### Users Can't Log In

- Check Netlify Identity settings (registration open vs invite-only)
- Verify user has email confirmed (check Netlify Identity panel)
- Ensure user metadata role is set correctly

## Next Steps

1. **Deploy to Netlify** - Test authentication on a real deployment
2. **Configure Identity** - Set registration to "Invite only" in production
3. **Add database integration** - Connect admin functions to store subscription data
4. **Implement email notifications** - Send password resets, subscription alerts via Netlify Functions
5. **Add subscription management** - Let admins assign and manage services per user

## References

- [Netlify Identity Documentation](https://docs.netlify.com/identity/overview/)
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [@netlify/identity API](https://www.npmjs.com/package/@netlify/identity)
