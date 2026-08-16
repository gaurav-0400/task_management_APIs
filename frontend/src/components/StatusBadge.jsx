function StatusBadge({ status }) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-yellow-50 text-yellow-700",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-blue-50 text-blue-700",
    },
    completed: {
      label: "Completed",
      className: "bg-green-50 text-green-700",
    },
    blocked: {
      label: "Blocked",
      className: "bg-red-50 text-red-700",
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;