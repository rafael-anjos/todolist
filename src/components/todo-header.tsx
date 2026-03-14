"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, ChevronDown } from "lucide-react"
import type { Priority } from "@/src/types/todo"
import { priorityConfig, priorities, TODO_MAX_LENGTH } from "@/src/lib/priority-config"
import { cn } from "@/lib/utils"

interface TodoHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  onAdd: (text: string, priority: Priority) => void
}

export function TodoHeader({ search, onSearchChange, onAdd }: TodoHeaderProps) {
  const [input, setInput] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [showPriorityPicker, setShowPriorityPicker] = useState(false)
  const priorityPickerRef = useRef<HTMLDivElement>(null)

  // Click-outside handler for priority picker
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (priorityPickerRef.current && !priorityPickerRef.current.contains(e.target as Node)) {
        setShowPriorityPicker(false)
      }
    }
    if (showPriorityPicker) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showPriorityPicker])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onAdd(input, priority)
    setInput("")
    setPriority("medium")
  }

  function handlePriorityKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setShowPriorityPicker(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 sm:flex-nowrap">
        <div className="relative flex-1 min-w-0">
          <Input
            placeholder="Adicionar tarefa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={TODO_MAX_LENGTH}
            className="pr-10"
          />
          {/* Priority selector inside input */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={priorityPickerRef}>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-medium cursor-pointer hover:bg-muted",
              )}
              onClick={() => setShowPriorityPicker(!showPriorityPicker)}
              aria-expanded={showPriorityPicker}
              aria-haspopup="listbox"
              aria-label={`Prioridade: ${priorityConfig[priority].label}`}
            >
              <div className={cn("w-2 h-2 rounded-full", priorityConfig[priority].color)} />
              <ChevronDown size={10} />
            </button>

            {showPriorityPicker && (
              <div
                className="absolute right-0 top-full z-10 mt-1 flex flex-col gap-1 rounded-md border bg-popover p-1.5 shadow-md"
                role="listbox"
                aria-label="Selecionar prioridade"
                onKeyDown={handlePriorityKeyDown}
              >
                {priorities.map((p) => (
                  <button
                    type="button"
                    key={p}
                    role="option"
                    aria-selected={priority === p}
                    className={cn(
                      "flex items-center gap-2 rounded px-2 py-1 text-xs hover:bg-muted cursor-pointer whitespace-nowrap",
                      priority === p && "bg-muted"
                    )}
                    onClick={() => {
                      setPriority(p)
                      setShowPriorityPicker(false)
                    }}
                  >
                    <div className={cn("w-2 h-2 rounded-full", priorityConfig[p].color)} />
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <Button type="submit" className="cursor-pointer bg-primary hover:bg-primary/90">
          <Plus size={16} />
          Cadastrar
        </Button>
      </form>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 pl-8 text-sm"
          aria-label="Buscar tarefas"
        />
      </div>
    </div>
  )
}
