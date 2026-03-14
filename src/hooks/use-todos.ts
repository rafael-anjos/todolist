"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { Todo, Priority, FilterType, TodoStats } from "@/src/types/todo"
import { VALID_PRIORITIES, TODO_MAX_LENGTH } from "@/src/lib/priority-config"

const STORAGE_KEY = "todolist-next-todos"

function generateId(): string {
  return crypto.randomUUID()
}

function isValidTodo(obj: unknown): obj is Todo {
  if (typeof obj !== "object" || obj === null) return false
  const t = obj as Record<string, unknown>
  return (
    typeof t.id === "string" &&
    typeof t.text === "string" &&
    t.text.length > 0 &&
    t.text.length <= TODO_MAX_LENGTH &&
    typeof t.completed === "boolean" &&
    VALID_PRIORITIES.has(t.priority as string) &&
    typeof t.createdAt === "number"
  )
}

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidTodo)
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    return true
  } catch {
    return false
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [search, setSearch] = useState("")
  const [hydrated, setHydrated] = useState(false)
  const [saveError, setSaveError] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setTodos(loadTodos())
    setHydrated(true)
  }, [])

  // Persist to localStorage on changes
  useEffect(() => {
    if (hydrated) {
      const success = saveTodos(todos)
      setSaveError(!success)
    }
  }, [todos, hydrated])

  // Cross-tab sync via storage event
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        try {
          const updated = JSON.parse(e.newValue)
          if (Array.isArray(updated)) {
            setTodos(updated.filter(isValidTodo))
          }
        } catch {
          // ignore malformed external writes
        }
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const addTodo = useCallback((text: string, priority: Priority = "medium") => {
    const trimmed = text.trim()
    if (!trimmed || trimmed.length > TODO_MAX_LENGTH) return
    setTodos((prev) => [
      {
        id: generateId(),
        text: trimmed,
        completed: false,
        priority,
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }, [])

  const editTodo = useCallback((id: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed || trimmed.length > TODO_MAX_LENGTH) return
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    )
  }, [])

  const editTodoPriority = useCallback((id: string, priority: Priority) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t))
    )
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }, [])

  const filteredTodos = useMemo(() => {
    let result = todos

    // Apply text search
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter((t) => t.text.toLowerCase().includes(term))
    }

    // Apply filter
    switch (filter) {
      case "pending":
        return result.filter((t) => !t.completed)
      case "completed":
        return result.filter((t) => t.completed)
      default:
        return result
    }
  }, [todos, filter, search])

  const stats: TodoStats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const pending = total - completed
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, pending, progress }
  }, [todos])

  return {
    todos: filteredTodos,
    stats,
    filter,
    search,
    hydrated,
    saveError,
    setFilter,
    setSearch,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    editTodoPriority,
    clearCompleted,
  }
}
