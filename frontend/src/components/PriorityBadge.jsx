function PriorityBadge({ priority }) {
  const priorityConfig = {
    low: {
      label: "Low",
      className: "bg-gray-100 text-gray-700",
    },
    medium: {
      label: "Medium",
      className: "bg-blue-50 text-blue-700",
    },
    high: {
      label: "High",
      className: "bg-orange-50 text-orange-700",
    },
    urgent: {
      label: "Urgent",
      className: "bg-red-50 text-red-700",
    },
  };

  const config = priorityConfig[priority] || {
    label: priority,
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

export default PriorityBadge;