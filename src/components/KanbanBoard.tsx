"use client";

import { useState, useEffect } from "react";
import { Plus, GripVertical, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  title: string;
  status: "Not Started" | "In Progress" | "Done";
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Generate project idea",
    status: "Not Started",
  },
  {
    id: "2",
    title: "Develop project",
    status: "In Progress",
  },
  {
    id: "3",
    title: "Deploy project",
    status: "Done",
  },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTaskTitle,
          status: "Not Started",
        },
      ]);
      setNewTaskTitle("");
    }
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const columns: Array<"Not Started" | "In Progress" | "Done"> = [
    "Not Started",
    "In Progress",
    "Done",
  ];

  const onDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (
    e: React.DragEvent,
    status: Task["status"],
    targetTaskId?: string
  ) => {
    e.preventDefault();
    if (!draggedTask) return;

    const updatedTasks = tasks.filter((task) => task.id !== draggedTask.id);
    const updatedDraggedTask = { ...draggedTask, status };

    if (targetTaskId) {
      const targetIndex = updatedTasks.findIndex(
        (task) => task.id === targetTaskId
      );
      updatedTasks.splice(targetIndex, 0, updatedDraggedTask);
    } else {
      updatedTasks.push(updatedDraggedTask);
    }

    setTasks(updatedTasks);
    setDraggedTask(null);
  };

  if (!isClient) {
    return (
      <div className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">
          Task Board
        </h2>
        <div className="h-[400px]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700"
    >
      <h2 className="text-2xl font-semibold text-gray-100 mb-6">Task Board</h2>

      {/* Add task input */}
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 bg-gray-700/50 border-0 text-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-500"
        />
        <Button
          onClick={addTask}
          className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 gap-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Kanban columns */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {columns.map((column) => (
          <div
            key={column}
            className="space-y-2"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column)}
          >
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
              {column}
            </h3>
            <motion.div
              className="bg-gray-700/30 rounded-lg p-4 min-h-[12rem]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {tasks
                  .filter((task) => task.status === column)
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      draggable
                      onDragStart={() => onDragStart(task)}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, column, task.id)}
                      className="group bg-gray-600/50 text-gray-200 text-sm p-3 rounded-lg backdrop-filter backdrop-blur-sm cursor-move flex items-center justify-between gap-2 mb-2 border border-transparent hover:border-gray-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{task.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Remove task</span>
                      </Button>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
