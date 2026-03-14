export type Priority = "low" | "medium" | "high"

export type FilterType = "all" | "pending" | "completed"

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
  createdAt: number
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  progress: number
}
