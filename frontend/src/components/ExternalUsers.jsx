import { useEffect, useState } from "react";

import { getExternalUsers } from "../services/externalService";

function ExternalUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getExternalUsers();

        setUsers(data.slice(0, 5));
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load external user data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          External Team Directory
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Data fetched through an external API integration.
        </p>
      </div>

      {loading && (
        <p className="mt-5 text-sm text-gray-500">
          Loading external users...
        </p>
      )}

      {error && (
        <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="mt-5 space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {user.name}
                </p>

                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

              <p className="text-sm text-gray-600">
                {user.company}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExternalUsers;