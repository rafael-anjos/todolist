"use client"

import { useState, useRef, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { SquarePen, Trash, Check, X } from "lucide-react"
import type { Todo, Priority } from "@/src/types/todo"
import { priorityConfig, priorities, TODO_MAX_LENGTH } from "@/src/lib/priority-config"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
  onEditPriority: (id: string, priority: Priority) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, onEditPriority }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [showPriority, setShowPriority] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const priorityRef = useRef<HTMLDivElement>(null)

  // Sync editText when todo.text changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditText(todo.text)
    }
  }, [todo.text, isEditing])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setShowPriority(false)
      }
    }
    if (showPriority) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showPriority])

  function handleSave() {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed)
    } else {
      setEditText(todo.text)
    }
    setIsEditing(false)
  }

  function handleCancel() {
    setEditText(todo.text)
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave()
    if (e.key === "Escape") handleCancel()
  }

  function handlePriorityKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setShowPriority(false)
  }

  const config = priorityConfig[todo.priority]
  const truncatedText = todo.text.length > 80 ? todo.text.slice(0, 80) + "\u2026" : todo.text

  return (
    <div
      className={cn(
        "group flex items-center gap-3 border-t px-1 py-2.5 transition-colors hover:bg-muted/50",
        todo.completed && "opacity-60"
      )}
    >
      {/* Priority bar */}
      <div className="relative" ref={priorityRef}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "w-3 h-8 rounded-full cursor-pointer transition-colors p-0",
                config.color
              )}
              onClick={() => setShowPriority(!showPriority)}
              aria-expanded={showPriority}
              aria-haspopup="listbox"
              aria-label={`Prioridade: ${config.label}`}
            />
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Prioridade: {config.label}</p>
          </TooltipContent>
        </Tooltip>

        {showPriority && (
          <div
            className="absolute left-4 top-0 z-10 flex flex-col gap-1 rounded-md border bg-popover p-1.5 shadow-md"
            role="listbox"
            aria-label="Selecionar prioridade"
            onKeyDown={handlePriorityKeyDown}
          >
            {priorities.map((p) => (
              <button
                key={p}
                role="option"
                aria-selected={todo.priority === p}
                className={cn(
                  "flex items-center gap-2 rounded px-2 py-1 text-xs hover:bg-muted cursor-pointer",
                  todo.priority === p && "bg-muted"
                )}
                onClick={() => {
                  onEditPriority(todo.id, p)
                  setShowPriority(false)
                }}
              >
                <div className={cn("w-2 h-2 rounded-full", priorityConfig[p].color)} />
                {priorityConfig[p].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Checkbox */}
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="cursor-pointer"
        aria-label={`Marcar "${truncatedText}" como ${todo.completed ? "pendente" : "concluida"}`}
      />

      {/* Text or edit input */}
      {isEditing ? (
        <div className="flex flex-1 items-center gap-1.5">
          <Input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={TODO_MAX_LENGTH}
            className="h-7 text-sm"
          />
          <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer" onClick={handleSave} aria-label="Salvar">
            <Check size={14} />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer" onClick={handleCancel} aria-label="Cancelar">
            <X size={14} />
          </Button>
        </div>
      ) : (
        <p
          className={cn(
            "flex-1 text-sm select-none break-words",
            todo.completed && "line-through text-muted-foreground"
          )}
        >
          {todo.text}
        </p>
      )}

      {/* Actions - visible on hover AND focus-within for keyboard users */}
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 cursor-pointer"
                onClick={() => setIsEditing(true)}
                aria-label="Editar tarefa"
              >
                <SquarePen size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 cursor-pointer text-destructive hover:text-destructive"
                    aria-label="Excluir tarefa"
                  >
                    <Trash size={14} />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Excluir</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir &ldquo;{truncatedText}&rdquo;?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => onDelete(todo.id)}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}
