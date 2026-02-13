import { Loader2 } from "lucide-react"

const AuthLoading = () => {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-foreground/40 via-background to-primary/60 flex items-center justify-center">
        <div className="text-center">
            <div className="relative">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <div className="absolute inset-0 w-12 h-12 border-2 border-primary/40 rounded-full animate-pulse mx-auto"></div>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">
                Authentication...
            </h2>
            <p className="text-foreground">
                Please wait while we prepare your onboarding experience.
            </p>
        </div>
    </div>
  )
}

export default AuthLoading