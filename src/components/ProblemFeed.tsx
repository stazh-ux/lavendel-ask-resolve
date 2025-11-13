import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { problemService } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { FileText, CheckCircle, Clock } from "lucide-react";

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

const ProblemFeed = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    const { data, error } = await problemService.getAllProblems();
    if (!error && data) {
      setProblems(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading problems...</p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No problems yet</h3>
        <p className="text-muted-foreground">Be the first to submit a problem!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">All Problems</h2>
        <p className="text-muted-foreground mt-2">Browse student questions and admin responses</p>
      </div>
      
      {problems.map((problem) => (
        <Card key={problem.id} className="shadow-md hover:shadow-lg transition-all border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{problem.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(new Date(problem.created_at), { addSuffix: true })}
                </CardDescription>
              </div>
              <Badge
                variant={problem.status === "resolved" ? "default" : "secondary"}
                className="ml-4"
              >
                {problem.status === "resolved" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {problem.status === "resolved" ? "Resolved" : "Pending"}
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

            {problem.admin_response && (
              <div className="bg-secondary p-4 rounded-lg mt-4 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Admin Response:
                </h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{problem.admin_response}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProblemFeed;
