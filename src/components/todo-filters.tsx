"use client"

import { List, ArrowDownRight, Check } from "lucide-react"
import type { FilterType, TodoStats } from "@/src/types/todo"
import { cn } from "@/lib/utils"

interface TodoFiltersProps {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  stats: TodoStats
}

const filters: { value: FilterType; label: string; icon: typeof List }[] = [
  { value: "all", label: "Todas", icon: List },
  { value: "pending", label: "Pendentes", icon: ArrowDownRight },
  { value: "completed", label: "Concluidas", icon: Check },
]

export function TodoFilters({ filter, onFilterChange, stats }: TodoFiltersProps) {
  function getCount(value: FilterType) {
    switch (value) {
      case "all":
        return stats.total
      case "pending":
        return stats.pending
      case "completed":
        return stats.completed
    }
  }

  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar tarefas">
      {filters.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={filter === value}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            filter === value
              ? "border-transparent bg-primary text-primary-foreground"
              : "border-border bg-transparent text-foreground hover:bg-muted"
          )}
          onClick={() => onFilterChange(value)}
        >
          <Icon size={12} />
          {label}
          <span className="ml-0.5 text-[10px] opacity-70">({getCount(value)})</span>
        </button>
      ))}
    </div>
  )
}
