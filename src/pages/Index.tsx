import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/supabase";
import { ArrowRight, MessageCircle, Shield, Users } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Brototype
          </h1>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-primary hover:opacity-90 rounded-xl"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Student Support Platform
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Submit your problems, get expert responses, and learn from the community.
            Your questions help everyone grow.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-primary hover:opacity-90 rounded-xl text-lg px-8 py-6 hover-lift"
          >
            Join Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-2xl shadow-soft hover-lift">
            <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Submit Problems</h3>
            <p className="text-muted-foreground">
              Share your challenges and questions with our support team. Include attachments for better clarity.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft hover-lift">
            <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Expert Responses</h3>
            <p className="text-muted-foreground">
              Get detailed responses from our admin team. All answers are public to help the entire community.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft hover-lift">
            <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Learn Together</h3>
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
