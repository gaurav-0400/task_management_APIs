import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { createTask, getTasks } from "../services/taskService";

import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
// import { getTasks } from "../services/taskService";
import { getUsers } from "../services/userService";

function Tasks() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    assigned_to: "",
    due_date: "",
    });

    const [formError, setFormError] = useState("");
    const [creating, setCreating] = useState(false);

    const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
        ...current,
        [name]: value,
    }));
    };

    const resetForm = () => {
    setFormData({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    assigned_to: "",
    due_date: "",
  });

  setFormError("");
};

    const closeCreateModal = () => {
    if (creating) {
        return;
    }

    setIsCreateModalOpen(false);
    resetForm();
};

    const handleCreateTask = async (event) => {
  event.preventDefault();

  setFormError("");

  if (!formData.title.trim()) {
    setFormError("Task title is required.");
    return;
  }

  try {
    setCreating(true);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      status: formData.status,
      priority: formData.priority,
      assigned_to: formData.assigned_to
        ? Number(formData.assigned_to)
        : null,
      due_date: formData.due_date || null,
    };

    await createTask(payload);

    setIsCreateModalOpen(false);
    resetForm();

    setPage(1);

    await fetchTasks(1);
  } catch (error) {
    console.error(error);

    setFormError(
      error.response?.data?.detail ||
        "Unable to create task. Please try again."
    );
  } finally {
    setCreating(false);
  }
};

    
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");  // to update  because react dosn't support update directly
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");

  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



//   const fetchTasks = async () => {
    const fetchTasks = async (requestedPage = page) => {
    const params = {
    page: requestedPage,
    limit,
    sort_by: sortBy,
    order,
    };

    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit,
        sort_by: sortBy,
        order,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      if (priority) {
        params.priority = priority;
      }

      if (assignee) {
        params.assignee = Number(assignee);
      }

      const data = await getTasks(params);

      setTasks(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [
    page,
    searchTerm,
    status,
    priority,
    assignee,
    sortBy,
    order,
  ]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    loadUsers();
  }, []);

//   const handleSearch = (event) => {
//     event.preventDefault();
//     setPage(1);
//     fetchTasks();
//   };
    const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);
    setSearchTerm(search.trim());
    };


  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setAssignee("");
    setSortBy("created_at");
    setOrder("desc");
    setPage(1);
  };

  const getUserName = (userId) => {
    const user = users.find(
      (item) => item.id === userId
    );

    return user ? user.name : "Unassigned";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track your team's tasks.
          </p>
        </div>

        {/* <button
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Create Task
        </button> */}
        <button
  type="button"
  onClick={() => {
    resetForm();
    setIsCreateModalOpen(true);
    }}
    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
    >
    + Create Task
    </button>

      </div>

      {/* Filters */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="grid gap-3 lg:grid-cols-6"
        >
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black lg:col-span-2"
          />

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">
              In Progress
            </option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={priority}
            onChange={(event) => {
              setPriority(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            value={assignee}
            onChange={(event) => {
              setAssignee(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
          >
            <option value="">All Assignees</option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Search
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={`${sortBy}-${order}`}
            onChange={(event) => {
              const [newSortBy, newOrder] =
                event.target.value.split("-");

              setSortBy(newSortBy);
              setOrder(newOrder);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="created_at-desc">
              Newest
            </option>

            <option value="created_at-asc">
              Oldest
            </option>

            <option value="due_date-asc">
              Due Date
            </option>

            <option value="title-asc">
              Title A-Z
            </option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="font-semibold text-gray-900">
              No tasks found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your filters or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Task
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Assignee
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Priority
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Due Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {task.title}
                      </Link>

                      <p className="mt-1 max-w-sm truncate text-xs text-gray-500">
                        {task.description || "No description"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {getUserName(task.assigned_to)}
                    </td>

                    <td className="px-5 py-4">
                      <PriorityBadge
                        priority={task.priority}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={task.status}
                      />
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {task.due_date
                        ? task.due_date
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && tasks.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {total} task{total !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
      <Modal
  isOpen={isCreateModalOpen}
  onClose={closeCreateModal}
  title="Create Task"
>
  <form
    onSubmit={handleCreateTask}
    className="space-y-5"
  >
    {formError && (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {formError}
      </div>
    )}

    {/* Task Title */}
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        Task Name
      </label>

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleFormChange}
        placeholder="e.g. Fix Shopify checkout"
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
      />
    </div>

    {/* Description */}
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        Description
      </label>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleFormChange}
        rows={4}
        placeholder="Describe the task..."
        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
      />
    </div>

    {/* Status + Priority */}
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleFormChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">
            In Progress
          </option>
          <option value="completed">
            Completed
          </option>
          <option value="blocked">
            Blocked
          </option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Priority
        </label>

        <select
          name="priority"
          value={formData.priority}
          onChange={handleFormChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>

    {/* Assignee + Due Date */}
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Assignee
        </label>

        <select
          name="assigned_to"
          value={formData.assigned_to}
          onChange={handleFormChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none"
        >
          <option value="">Unassigned</option>

          {users.map((user) => (
            <option
              key={user.id}
              value={user.id}
            >
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Due Date
        </label>

        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleFormChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none"
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
      <button
        type="button"
        onClick={closeCreateModal}
        disabled={creating}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={creating}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {creating ? "Creating..." : "Create Task"}
      </button>
    </div>
  </form>
</Modal>
    </div>
  );
}

export default Tasks;