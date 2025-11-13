import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/supabase";
import { ArrowRight, MessageCircle, Shield, Users } from "lucide-react";
import brototypeLogo from "@/assets/brototype-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getSession().then(({ session }) => {
      if (session) {
        navigate("/dashboard");
      }
      setLoading(false);
    });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={brototypeLogo} 
              alt="Brototype" 
              className="h-12 w-12 object-cover rounded-xl shadow-md hover:shadow-lg transition-all"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Brototype
              </h1>
              <p className="text-xs text-muted-foreground">Student Support Portal</p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="rounded-lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <h2 className="text-5xl font-bold mb-4 leading-tight text-foreground">
            Student Support Platform
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Submit your problems, get expert responses, and learn from the community.
            Your questions help everyone grow.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="rounded-lg text-lg px-8 py-6"
          >
            Join Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-lg border border-border transition-all">
            <div className="bg-primary w-14 h-14 rounded-xl flex items-center justify-center mb-5">
              <MessageCircle className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Submit Problems</h3>
            <p className="text-muted-foreground">
              Share your challenges and questions with our support team. Include attachments for better clarity.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-lg border border-border transition-all">
            <div className="bg-primary w-14 h-14 rounded-xl flex items-center justify-center mb-5">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Expert Responses</h3>
            <p className="text-muted-foreground">
              Get detailed responses from our admin team. All answers are public to help the entire community.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-lg border border-border transition-all">
            <div className="bg-primary w-14 h-14 rounded-xl flex items-center justify-center mb-5">
              <Users className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Learn Together</h3>
            <p className="text-muted-foreground">
              Browse all problems and solutions. Learn from others' questions and contribute to the knowledge base.
            </p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 Brototype. All rights reserved.</p>
          <p className="mt-2">Terms of Service · Privacy Policy</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
