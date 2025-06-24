
import { UserButton } from '@clerk/clerk-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export const AuthHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Visit Tracker</h1>
        <p className="text-lg text-muted-foreground">Manage your business visits, companies, and customer relationships</p>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}
