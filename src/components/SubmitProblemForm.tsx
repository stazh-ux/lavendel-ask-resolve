import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { problemService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Upload, ArrowRight } from "lucide-react";
import { z } from "zod";

const problemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000),
});

interface SubmitProblemFormProps {
  userId: string;
}

const SubmitProblemForm = ({ userId }: SubmitProblemFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = problemSchema.parse({ title, description });

      const { data: problem, error: problemError } = await problemService.createProblem(
        validated.title,
        validated.description,
        userId
      );

      if (problemError) throw problemError;

      if (files && problem) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          await problemService.uploadAttachment(problem.id, file);
        }
      }

      toast({
        title: "Success!",
        description: "Your problem has been submitted successfully.",
      });

      setTitle("");
      setDescription("");
      setFiles(null);
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit problem. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-elegant">
      <CardHeader>
        <CardTitle className="text-2xl text-lavender">Submit a Problem</CardTitle>
        <CardDescription>
          Describe your issue and our admin team will respond publicly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Problem Title</Label>
            <Input
              id="title"
              placeholder="Brief description of your problem"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Problem Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about your problem..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Attachments (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFiles(e.target.files)}
                className="rounded-xl"
              />
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Accepted formats: PDF, JPG, PNG (Max 5MB each)
            </p>
          </div>

          <Button
            type="submit"
            className={`w-full bg-gradient-primary hover:opacity-90 rounded-xl group transition-all duration-300 hover-lift ${
              loading ? "btn-submit loading" : "btn-submit"
            }`}
            disabled={loading}
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                Submit Problem
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubmitProblemForm;
