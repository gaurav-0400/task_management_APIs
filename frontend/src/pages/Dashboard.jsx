import { useEffect, useState } from "react";

import StatCard from "../components/StatCard";
import { getDashboard } from "../services/dashboardService";
import ExternalUsers from "../components/ExternalUsers";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary current user.
  // Later from authenticated user 
  const currentUserId = 1;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboard(currentUserId);

        setDashboard(data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load dashboard data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-gray-200"
              
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your team's tasks.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Tasks"
          value={dashboard.total_tasks}
        />

        <StatCard
          title="Pending Tasks"
          value={dashboard.pending_tasks}
        />

        <StatCard
          title="In Progress"
          value={dashboard.in_progress_tasks}
        />

        <StatCard
          title="Completed Tasks"
          value={dashboard.completed_tasks}
        />

        <StatCard
          title="Overdue Tasks"
          value={dashboard.overdue_tasks}
        />

        <StatCard
          title="My Tasks"
          value={dashboard.my_tasks}
          
        />
        <ExternalUsers />
      </div>
    </div>
  );
}

export default Dashboard;