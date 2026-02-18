import { useEffect } from "react";
import { Toolbar } from "./components/toolbar/Toolbar";
import { LeftSidebar } from "./components/sidebar/LeftSidebar";
import { WorkflowCanvas } from "./components/canvas/WorkflowCanvas";
import { RightPanel } from "./components/panels/RightPanel";
import { AddNodePanel } from "./components/panels/AddNodePanel";
import { useWorkflowStore } from "./stores/workflowStore";

function App() {
  const { loadFromLocalStorage, isDarkMode, isAddNodePanelOpen } =
    useWorkflowStore();

  // Load saved data on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Apply dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="h-screen w-screen flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Workflow List */}
        <LeftSidebar />

        {/* Main Canvas */}
        <WorkflowCanvas />

        {/* Right Panel - Node Editor (hidden when Add Node Panel is open) */}
        {!isAddNodePanelOpen && <RightPanel />}

        {/* Add Node Panel */}
        <AddNodePanel />
      </div>
    </div>
  );
}

export default App;
