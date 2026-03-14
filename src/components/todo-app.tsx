"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useTodos } from "@/src/hooks/use-todos"
import { TodoHeader } from "./todo-header"
import { TodoFilters } from "./todo-filters"
import { TodoItem } from "./todo-item"
import { TodoProgress } from "./todo-progress"
import { ThemeToggle } from "./theme-toggle"
import { ClipboardList, SearchX, FilterX } from "lucide-react"

export function TodoApp() {
  const {
    todos,
    stats,
    filter,
    search,
    hydrated,
    setFilter,
    setSearch,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    editTodoPriority,
    clearCompleted,
  } = useTodos()

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="flex items-center justify-center py-12">
            <div role="status" aria-label="Carregando tarefas">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList size={20} className="text-primary" />
              <h1 className="text-lg font-semibold">Minhas Tarefas</h1>
            </div>
            <ThemeToggle />
          </div>
          <TodoHeader search={search} onSearchChange={setSearch} onAdd={addTodo} />
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Separator />

          <TodoFilters filter={filter} onFilterChange={setFilter} stats={stats} />

          {/* Todo list */}
          <div className="border-b">
            {todos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                {search ? (
                  <>
                    <SearchX size={32} className="mb-2 opacity-40" />
                    <p className="text-sm">Nenhum resultado para &ldquo;{search}&rdquo;</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-1 h-auto p-0 text-xs cursor-pointer"
                      onClick={() => setSearch("")}
                    >
                      Limpar busca
                    </Button>
                  </>
                ) : filter !== "all" ? (
                  <>
                    <FilterX size={32} className="mb-2 opacity-40" />
                    <p className="text-sm">
                      {filter === "completed"
                        ? "Nenhuma tarefa concluida"
                        : "Nenhuma tarefa pendente"}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-1 h-auto p-0 text-xs cursor-pointer"
                      onClick={() => setFilter("all")}
                    >
                      Ver todas
                    </Button>
                  </>
                ) : (
                  <>
                    <ClipboardList size={40} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">Nenhuma tarefa ainda</p>
                    <p className="text-xs opacity-70 mt-1">Adicione sua primeira tarefa acima</p>
                  </>
                )}
              </div>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                  onEditPriority={editTodoPriority}
                />
              ))
            )}
          </div>

          <TodoProgress stats={stats} onClearCompleted={clearCompleted} />
        </CardContent>
      </Card>
    </main>
  )
}
