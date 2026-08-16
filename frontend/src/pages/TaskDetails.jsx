import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";

import {createComment,getComments,
} from "../services/commentService";
import { getUsers } from "../services/userService";
import {
  deleteTask,getTask,updateTask,
} from "../services/taskService";
import Modal from "../components/Modal";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [commentText, setCommentText] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [commentError, setCommentError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteTask = async () => {
  try {
    setDeleting(true);
    setDeleteError("");

    await deleteTask(id);

    setIsDeleteModalOpen(false);

    navigate("/tasks");
  } catch (err) {
    console.error(err);

    setDeleteError(
      err.response?.data?.detail ||
        "Unable to delete task. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };


  // Temporary current user
  const currentUserId = 1;

  useEffect(() => {
    const loadTaskDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [taskData, commentsData, usersData] =
          await Promise.all([
            getTask(id),
            getComments(id),
            getUsers(),
          ]);

        setTask(taskData);
        setComments(commentsData);
        setUsers(usersData);

        setEditData({
          title: taskData.title,
          description: taskData.description || "",
          status: taskData.status,
          priority: taskData.priority,
          assigned_to: taskData.assigned_to || "",
          due_date: taskData.due_date || "",
        });
      } catch (err) {
        console.error(err);

        if (err.response?.status === 404) {
          setError("Task not found.");
        } else {
          setError(
            "Unable to load task details."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadTaskDetails();
  }, [id]);

  const getUserName = (userId) => {
    const user = users.find(
      (item) => item.id === userId
    );

    return user ? user.name : "Unknown User";
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSaveTask = async (event) => {
    event.preventDefault();

    if (!editData.title.trim()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: editData.title.trim(),
        description:
          editData.description.trim() || null,
        status: editData.status,
        priority: editData.priority,
        assigned_to: editData.assigned_to
          ? Number(editData.assigned_to)
          : null,
        due_date: editData.due_date || null,
      };

      const updatedTask = await updateTask(
        id,
        payload
      );

      setTask(updatedTask);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to update task. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!commentText.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    try {
      setAddingComment(true);
      setCommentError("");

      const newComment = await createComment(
        id,
        {
          user_id: currentUserId,
          comment: commentText.trim(),
        }
      );

      setComments((current) => [
        ...current,
        newComment,
      ]);

      setCommentText("");
    } catch (err) {
      console.error(err);

      setCommentError(
        err.response?.data?.detail ||
          "Unable to add comment."
      );
    } finally {
      setAddingComment(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />

        <div className="mt-6 h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div>
        <Link
          to="/tasks"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Tasks
        </Link>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error || "Task not found."}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link
            to="/tasks"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to Tasks
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            {task.title}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Task #{task.id}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing((current) => !current)}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {isEditing ? "Cancel Edit" : "Edit Task"}
        </button>
      </div>

      <div className="flex gap-2">
  <button
    type="button"
    onClick={() => setIsEditing((current) => !current)}
    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
  >
    {isEditing ? "Cancel Edit" : "Edit Task"}
  </button>

  <button
    type="button"
    onClick={() => setIsDeleteModalOpen(true)}
    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
  >
    Delete
  </button>
</div>

      {/* Main Information */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {isEditing ? (
              <form
                onSubmit={handleSaveTask}
                className="space-y-5"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Task Name
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    rows={6}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Status
                    </label>

                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleEditChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                    >
                      <option value="pending">
                        Pending
                      </option>
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
                      value={editData.priority}
                      onChange={handleEditChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                    >
                      <option value="low">
                        Low
                      </option>
                      <option value="medium">
                        Medium
                      </option>
                      <option value="high">
                        High
                      </option>
                      <option value="urgent">
                        Urgent
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Assignee
                    </label>

                    <select
                      name="assigned_to"
                      value={editData.assigned_to}
                      onChange={handleEditChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                    >
                      <option value="">
                        Unassigned
                      </option>

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
                      value={editData.due_date}
                      onChange={handleEditChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </h2>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {task.description ||
                      "No description provided."}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Comments */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Comments
            </h2>

            <div className="mt-5 space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No comments yet.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        {getUserName(comment.user_id)}
                      </span>

                      <span className="text-xs text-gray-400">
                        {new Date(
                          comment.created_at
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {comment.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleAddComment}
              className="mt-5 border-t border-gray-200 pt-5"
            >
              {commentError && (
                <p className="mb-3 text-sm text-red-600">
                  {commentError}
                </p>
              )}

              <textarea
                value={commentText}
                onChange={(event) =>
                  setCommentText(event.target.value)
                }
                rows={3}
                placeholder="Write a comment..."
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={addingComment}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {addingComment
                    ? "Adding..."
                    : "Add Comment"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Task Information */}
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Task Information
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Status
                </p>

                <div className="mt-2">
                  <StatusBadge
                    status={task.status}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Priority
                </p>

                <div className="mt-2">
                  <PriorityBadge
                    priority={task.priority}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Assigned To
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {task.assigned_to
                    ? getUserName(task.assigned_to)
                    : "Unassigned"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Due Date
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {task.due_date || "No due date"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Created
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {new Date(
                    task.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Last Updated
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {new Date(
                    task.updated_at
                  ).toLocaleString()}
                </p>


                <Modal
  isOpen={isDeleteModalOpen}
  onClose={() => {
    if (!deleting) {
      setIsDeleteModalOpen(false);
    }
  }}
  title="Delete Task"
>
  <div className="space-y-5">
    <p className="text-sm leading-6 text-gray-600">
      Are you sure you want to delete{" "}
      <span className="font-semibold text-gray-900">
        "{task.title}"
      </span>
      ?
      <br />
      This action cannot be undone.
    </p>

    {deleteError && (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {deleteError}
      </div>
    )}

    <div className="flex justify-end gap-3">
      <button
        type="button"
        disabled={deleting}
        onClick={() => setIsDeleteModalOpen(false)}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="button"
        disabled={deleting}
        onClick={handleDeleteTask}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete Task"}
      </button>
    </div>
  </div>
</Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;