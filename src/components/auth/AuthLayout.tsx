
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Building2, Calendar } from 'lucide-react'

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Visit Tracker</CardTitle>
                <CardDescription className="text-lg">
                  Manage your business visits and customer relationships
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>Manage companies and customers</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Track visits and follow-ups</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Generate detailed reports</span>
                </div>
              </div>
              <SignInButton mode="modal">
                <Button className="w-full" size="lg">
                  Sign In to Continue
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </SignedOut>
      <SignedIn>
        {children}
      </SignedIn>
    </>
  )
}
