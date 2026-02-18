import {
  Zap,
  Play,
  Workflow,
  Clock,
  Sun,
  Moon,
  MoreHorizontal,
} from "lucide-react";
import { useWorkflowStore } from "../../stores/workflowStore";

export const Toolbar: React.FC = () => {
  const { workflows, activeWorkflowId, isDarkMode, toggleDarkMode } =
    useWorkflowStore();

  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId);

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white hidden sm:inline">
            Workflow
          </span>
        </div>

        {/* Workflow Name */}
        <div className="flex items-center gap-2 ml-4">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Workflows</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {activeWorkflow?.name || "Untitled"}
            </span>
          </nav>
        </div>

        {/* Execution Counter */}
        {activeWorkflow && (
          <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              {activeWorkflow.executionCount}
            </span>
            <span className="text-gray-400 dark:text-gray-500">/</span>
            <span className="text-gray-400 dark:text-gray-500">1000</span>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Execute Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors">
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Execute</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

        {/* Icon Buttons */}
        <div className="flex items-center gap-1">
          {/* Templates Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            title="Templates (Coming Soon)"
          >
            <Workflow className="w-5 h-5" />
          </button>

          {/* History Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            title="History (Coming Soon)"
          >
            <Clock className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* More Options */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            title="More Options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
