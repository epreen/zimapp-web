import { Roles, Plans } from '@/lib/tier-config'

export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
      plan?: Plans
    }
  }
}