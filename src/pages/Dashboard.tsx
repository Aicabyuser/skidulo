import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata.full_name || 'User'}!</h1>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/profile">Profile</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/settings">Settings</Link>
            </Button>
            <Button variant="destructive" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions Card */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Button className="w-full" asChild>
                <Link to="/calendar">View Calendar</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/appointments">Manage Appointments</Link>
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-highlight-purple">0</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-highlight-blue">0</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground text-center py-8">
                No recent activity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 