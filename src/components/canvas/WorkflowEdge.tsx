import { useCallback, useState } from "react";
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  Position,
} from "@xyflow/react";
import { Plus, Trash2 } from "lucide-react";
import { useWorkflowStore } from "../../stores/workflowStore";
import { cn } from "../../lib/utils";

export const WorkflowEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { deleteEdge, openAddNodePanel, setAnpEdgeInsertId } =
    useWorkflowStore();

  // Calculate the smoothstep path
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePosition || Position.Right,
    targetX,
    targetY,
    targetPosition: targetPosition || Position.Left,
    borderRadius: 8,
  });

  // Handle delete edge
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteEdge(id);
    },
    [id, deleteEdge],
  );

  // Handle add node - opens the Add Node Panel in insert mode
  const handleAddNode = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Set the edge insert ID first, then open the panel
      setAnpEdgeInsertId(id);
      openAddNodePanel();
    },
    [id, openAddNodePanel, setAnpEdgeInsertId],
  );

  return (
    <>
      {/* Invisible wider path for easier hover detection */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: "pointer" }}
      />

      {/* Visible edge path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={isHovered ? "#3b82f6" : "#94a3b8"}
        strokeWidth={isHovered ? 3 : 2}
        markerEnd={markerEnd}
        style={style}
        className={cn(
          "transition-all duration-200",
          isHovered && "animate-pulse",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Hover buttons at midpoint */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className={cn(
            "flex items-center gap-0.5 transition-all duration-200",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Add Node Button */}
          <button
            onClick={handleAddNode}
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center",
              "bg-white dark:bg-gray-800 border border-blue-500",
              "text-blue-500 hover:bg-blue-500 hover:text-white",
              "shadow-sm hover:shadow-md transition-all duration-200",
              "focus:outline-none focus:ring-1 focus:ring-blue-400",
            )}
            title="Tambah node di sini"
          >
            <Plus size={12} strokeWidth={3} />
          </button>

          {/* Delete Edge Button */}
          <button
            onClick={handleDelete}
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center",
              "bg-white dark:bg-gray-800 border border-red-500",
              "text-red-500 hover:bg-red-500 hover:text-white",
              "shadow-sm hover:shadow-md transition-all duration-200",
              "focus:outline-none focus:ring-1 focus:ring-red-400",
            )}
            title="Hapus koneksi"
          >
            <Trash2 size={10} strokeWidth={2} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
