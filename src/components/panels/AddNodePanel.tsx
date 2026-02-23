import { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Search, ArrowRight } from "lucide-react";
import { useWorkflowStore } from "../../stores/workflowStore";
import {
  categories,
  getNodesByCategory,
  searchNodes,
  getNodeDefinition,
} from "../../utils/nodeConfig";
import { getIcon } from "../../lib/icons";
import { cn } from "../../lib/utils";

export const AddNodePanel: React.FC = () => {
  const {
    isAddNodePanelOpen,
    closeAddNodePanel,
    anpCategory,
    setAnpCategory,
    anpSearchQuery,
    setAnpSearchQuery,
    anpEdgeInsertId,
    anpSourceNodeId,
    anpSourceHandle,
    addNode,
    insertNodeOnEdge,
    addNodeAndConnect,
    openRightPanel,
  } = useWorkflowStore();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when panel opens
  useEffect(() => {
    if (isAddNodePanelOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isAddNodePanelOpen]);

  const handleNodeClick = (nodeType: string) => {
    if (anpEdgeInsertId) {
      // Insert node on edge
      const edgeId = anpEdgeInsertId;
      closeAddNodePanel();
      setTimeout(() => {
        insertNodeOnEdge(edgeId, nodeType);
        openRightPanel();
      }, 100);
    } else if (anpSourceNodeId) {
      // Add node and connect to source
      const sourceId = anpSourceNodeId;
      const sourceHandle = anpSourceHandle;
      closeAddNodePanel();
      setTimeout(() => {
        addNodeAndConnect(nodeType, sourceId, sourceHandle || undefined);
        openRightPanel();
      }, 100);
    } else {
      // Add new node to canvas
      addNode(nodeType);
      closeAddNodePanel();
      setTimeout(() => {
        openRightPanel();
      }, 100);
    }
  };

  const handleBack = () => {
    setAnpCategory(null);
    setAnpSearchQuery("");
  };

  const filteredNodes = anpSearchQuery ? searchNodes(anpSearchQuery) : [];
  const categoryNodes = anpCategory ? getNodesByCategory(anpCategory) : [];
  const currentCategory = categories.find((c) => c.id === anpCategory);

  if (!isAddNodePanelOpen) {
    return null;
  }

  return (
    <aside className="w-[340px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full relative z-40">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {anpEdgeInsertId && (
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                Insert node
              </span>
            )}
            {anpSourceNodeId && !anpEdgeInsertId && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                Add next node
              </span>
            )}
            {!anpEdgeInsertId && !anpSourceNodeId && (
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                What happens next?
              </h2>
            )}
          </div>
          <button
            onClick={closeAddNodePanel}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={anpSearchQuery}
            onChange={(e) => setAnpSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Insert Mode Banner */}
        {anpEdgeInsertId && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">
              Pilih node untuk disisipkan di antara koneksi
            </p>
          </div>
        )}

        {/* Add Next Node Banner */}
        {anpSourceNodeId && !anpEdgeInsertId && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Pilih node untuk melanjutkan flow
            </p>
          </div>
        )}

        {/* Search Results */}
        {anpSearchQuery && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Search Results ({filteredNodes.length})
            </div>
            {filteredNodes.map((node) => (
              <NodeRow
                key={node.id}
                node={node}
                onClick={() => handleNodeClick(node.id)}
              />
            ))}
            {filteredNodes.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No nodes found
              </p>
            )}
          </div>
        )}

        {/* Category View */}
        {!anpSearchQuery && !anpCategory && (
          <div className="space-y-2">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => setAnpCategory(category.id)}
              />
            ))}
          </div>
        )}

        {/* Node List View */}
        {!anpSearchQuery && anpCategory && (
          <div className="space-y-2">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to categories
            </button>

            {/* Category Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                {getIcon(currentCategory?.icon || "Box", {
                  className: "w-5 h-5 text-gray-600 dark:text-gray-400",
                })}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {currentCategory?.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentCategory?.description}
                </p>
              </div>
            </div>

            {/* Node List */}
            {categoryNodes.map((node) => (
              <NodeRow
                key={node.id}
                node={node}
                onClick={() => handleNodeClick(node.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Hint */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
            Tab
          </kbd>{" "}
          to toggle ·{" "}
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
            Esc
          </kbd>{" "}
          to close
        </div>
      </div>
    </aside>
  );
};

// Category Card Component
interface CategoryCardProps {
  category: (typeof categories)[0];
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors text-left group"
    >
      <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
        {getIcon(category.icon, {
          className: "w-5 h-5 text-gray-600 dark:text-gray-400",
        })}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-white">
          {category.label}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {category.description}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
    </button>
  );
};

// Node Row Component
interface NodeRowProps {
  node: ReturnType<typeof getNodeDefinition>;
  onClick: () => void;
}

const NodeRow: React.FC<NodeRowProps> = ({ node, onClick }) => {
  if (!node) return null;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-all text-left"
    >
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center",
          node.color.iconBg || node.color.bg,
        )}
      >
        {getIcon(node.icon, {
          className: cn("w-4 h-4 text-white"),
        })}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-white text-sm">
          {node.label}
        </div>
        {node.subtitle && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {node.subtitle}
          </div>
        )}
      </div>
    </button>
  );
};
