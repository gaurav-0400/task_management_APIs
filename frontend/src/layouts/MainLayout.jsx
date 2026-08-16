import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/") {
      return "Dashboard";
    }

    if (location.pathname === "/tasks") {
      return "Tasks";
    }

    if (location.pathname.startsWith("/tasks/")) {
      return "Task Details";
    }

    if (location.pathname === "/users") {
      return "Users";
    }

    return "TaskFlow";
  };

  const navLinkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-gray-100 text-gray-900"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
        <h1 className="text-lg font-bold text-gray-900">
          TaskFlow
        </h1>

        <button
          type="button"
          onClick={() =>
            setSidebarOpen((current) => !current)
          }
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white p-5 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            TaskFlow
          </h1>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-100 lg:hidden"
          >
            ×
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            className={navLinkClass}
            onClick={() => setSidebarOpen(false)}
          >
            Tasks
          </NavLink>

          <NavLink
            to="/users"
            className={navLinkClass}
            onClick={() => setSidebarOpen(false)}
          >
            Users
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {/* Desktop top bar */}
          <div className="hidden h-16 items-center border-b border-gray-200 bg-white px-8 lg:flex">
            <p className="text-sm font-medium text-gray-500">
              {getPageTitle()}
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;