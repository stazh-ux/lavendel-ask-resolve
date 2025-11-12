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
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={brototypeLogo} 
              alt="Brototype" 
              className="h-14 w-14 object-cover rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-105"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Brototype
              </h1>
              <p className="text-xs text-muted-foreground">Student Support Portal</p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-primary hover:shadow-glow rounded-xl transition-all"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-8">
          <h2 className="text-6xl font-bold mb-6 leading-tight bg-gradient-hero bg-clip-text text-transparent">
            Student Support Platform
          </h2>
          <p className="text-2xl text-muted-foreground mb-10 leading-relaxed">
            Submit your problems, get expert responses, and learn from the community.
            Your questions help everyone grow.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-primary hover:shadow-glow rounded-2xl text-lg px-12 py-7 shadow-elegant transition-all hover:scale-105"
          >
            Join Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-gradient-card p-10 rounded-3xl shadow-glow hover-lift border-2 border-border/50 transition-all">
            <div className="bg-gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Submit Problems</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Share your challenges and questions with our support team. Include attachments for better clarity.
            </p>
          </div>

          <div className="bg-gradient-card p-10 rounded-3xl shadow-glow hover-lift border-2 border-border/50 transition-all">
            <div className="bg-gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Expert Responses</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Get detailed responses from our admin team. All answers are public to help the entire community.
            </p>
          </div>

          <div className="bg-gradient-card p-10 rounded-3xl shadow-glow hover-lift border-2 border-border/50 transition-all">
            <div className="bg-gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Learn Together</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
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
