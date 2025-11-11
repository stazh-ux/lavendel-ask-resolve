import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { problemService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { FileText, Send } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  status: string;
  admin_response: string | null;
  created_at: string;
  problem_attachments?: Array<{
    file_name: string;
    file_path: string;
  }>;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    const { data, error } = await problemService.getAllProblems();
    if (!error && data) {
      setProblems(data);
      const initialResponses: { [key: string]: string } = {};
      data.forEach((problem) => {
        initialResponses[problem.id] = problem.admin_response || "";
      });
      setResponses(initialResponses);
    }
    setLoading(false);
  };

  const handleRespond = async (problemId: string, status: string) => {
    setSubmitting({ ...submitting, [problemId]: true });

    const { error } = await problemService.updateProblem(
      problemId,
      responses[problemId],
      status
    );

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update problem. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Problem updated successfully.",
      });
      loadProblems();
    }

    setSubmitting({ ...submitting, [problemId]: false });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      {problems.map((problem) => (
        <Card key={problem.id} className="shadow-soft">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{problem.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(problem.created_at), { addSuffix: true })}
                </p>
              </div>
              <Badge variant={problem.status === "resolved" ? "default" : "secondary"}>
                {problem.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Problem Description:</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{problem.description}</p>
            </div>

            {problem.problem_attachments && problem.problem_attachments.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Attachments:</h4>
                <div className="flex flex-wrap gap-2">
                  {problem.problem_attachments.map((attachment, index) => (
                    <Badge key={index} variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      {attachment.file_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-semibold">Admin Response:</h4>
              <Textarea
                value={responses[problem.id] || ""}
                onChange={(e) =>
                  setResponses({ ...responses, [problem.id]: e.target.value })
                }
                placeholder="Write your response here..."
                rows={4}
                className="rounded-xl resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleRespond(problem.id, "resolved")}
                disabled={submitting[problem.id] || !responses[problem.id]?.trim()}
                className="bg-gradient-primary hover:opacity-90 rounded-xl"
              >
                <Send className="mr-2 h-4 w-4" />
                {problem.status === "resolved" ? "Update & Keep Resolved" : "Respond & Resolve"}
              </Button>
              {problem.status === "resolved" && (
                <Button
                  onClick={() => handleRespond(problem.id, "pending")}
                  disabled={submitting[problem.id]}
                  variant="outline"
                  className="rounded-xl"
                >
                  Mark as Pending
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDashboard;
