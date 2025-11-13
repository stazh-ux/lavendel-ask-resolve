import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService, profileService } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import SubmitProblemForm from "@/components/SubmitProblemForm";
import ProblemFeed from "@/components/ProblemFeed";
import AdminDashboard from "@/components/AdminDashboard";
import { InstitutionRating } from "@/components/InstitutionRating";
import { RatingAnalytics } from "@/components/RatingAnalytics";
import { NotificationBell } from "@/components/NotificationBell";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import brototypeLogo from "@/assets/brototype-logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"submit" | "feed" | "admin" | "ratings">("feed");

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        }
      }
    );

    authService.getSession().then(({ session }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    const { isAdmin } = await profileService.isAdmin(userId);
    setIsAdmin(isAdmin);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={brototypeLogo} 
                alt="Brototype" 
                className="h-12 w-12 object-cover rounded-xl shadow-md hover:shadow-lg transition-all"
              />
              <div>
                <h1 className="text-xl font-bold text-lavender">
                  Brototype
                </h1>
                <p className="text-xs text-muted-foreground">Student Support Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isAdmin && <NotificationBell userId={user.id} />}
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="rounded-lg"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "feed"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Problem Feed
            </button>
            {!isAdmin && (
              <button
                onClick={() => setActiveTab("submit")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "submit"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Submit Problem
              </button>
            )}
            {!isAdmin && (
              <button
                onClick={() => setActiveTab("ratings")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "ratings"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Ratings
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "admin"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "submit" && !isAdmin && <SubmitProblemForm userId={user.id} />}
        {activeTab === "feed" && <ProblemFeed />}
        {activeTab === "ratings" && !isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InstitutionRating userId={user.id} />
            <RatingAnalytics />
          </div>
        )}
        {activeTab === "admin" && isAdmin && <AdminDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
