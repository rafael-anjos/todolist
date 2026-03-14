import type { Priority } from "@/src/types/todo"

export const priorityConfig: Record<Priority, { color: string; label: string }> = {
  high: { color: "bg-red-400 dark:bg-red-500", label: "Alta" },
  medium: { color: "bg-yellow-400 dark:bg-yellow-500", label: "Media" },
  low: { color: "bg-green-400 dark:bg-green-500", label: "Baixa" },
}

export const priorities: Priority[] = ["high", "medium", "low"]

export const VALID_PRIORITIES = new Set<string>(["low", "medium", "high"])

export const TODO_MAX_LENGTH = 500
