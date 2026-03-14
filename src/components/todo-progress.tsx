"use client"

import { Button } from "@/components/ui/button"
import { Trash, ListCheck, Sigma } from "lucide-react"
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
import type { TodoStats } from "@/src/types/todo"

interface TodoProgressProps {
  stats: TodoStats
  onClearCompleted: () => void
}

export function TodoProgress({ stats, onClearCompleted }: TodoProgressProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Completed count + clear button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListCheck size={16} />
          <p className="text-xs text-muted-foreground">
            Concluidas ({stats.completed}/{stats.total})
          </p>
        </div>

        {stats.completed > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="text-xs h-7 cursor-pointer" variant="outline" size="sm">
                <Trash size={12} />
                Limpar concluidas
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Excluir {stats.completed} {stats.completed === 1 ? "tarefa concluida" : "tarefas concluidas"}?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={onClearCompleted}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-md bg-muted" role="progressbar" aria-valuenow={stats.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso das tarefas">
        <div
          className="h-full rounded-md bg-primary transition-all duration-500 ease-out"
          style={{ width: `${stats.progress}%` }}
        />
      </div>

      {/* Total count */}
      <div className="flex items-center justify-end gap-2">
        <Sigma size={16} />
        <p className="text-xs text-muted-foreground">
          {stats.total} {stats.total === 1 ? "tarefa" : "tarefas"} no total
        </p>
      </div>
    </div>
  )
}
