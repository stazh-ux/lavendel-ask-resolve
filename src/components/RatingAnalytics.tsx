import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ratingService } from "@/lib/supabase";
import { Star } from "lucide-react";

export const RatingAnalytics = () => {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    setLoading(true);
    const { data } = await ratingService.getAllRatings();
    setRatings(data || []);
    setLoading(false);
  };

  const calculateStats = () => {
    if (ratings.length === 0) return { average: 0, distribution: [], total: 0 };

    const distribution = [1, 2, 3, 4, 5].map((star) => ({
      name: `${star} Star${star > 1 ? 's' : ''}`,
      value: ratings.filter((r) => r.rating === star).length,
      rating: star,
    }));

    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    return { average, distribution, total: ratings.length };
  };

  const stats = calculateStats();

  const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#F5E6D3', '#22C55E'];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rating Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-[#F5E6D3] text-[#F5E6D3]" />
          Rating Analytics
        </CardTitle>
        <CardDescription>
          Brototype institution ratings overview
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stats.total === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No ratings yet. Be the first to rate!
          </p>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">
                {stats.average.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Average rating from {stats.total} review{stats.total !== 1 ? 's' : ''}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${value}` : ''}
                >
                  {stats.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} ratings`, 'Count']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
