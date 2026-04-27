import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { IdentityProvider } from '../lib/identity-context'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'IT Support Portal – My Subscriptions',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <IdentityProvider>
          {children}
        </IdentityProvider>
        <Scripts />
      </body>
    </html>
  )
}
