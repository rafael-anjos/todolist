import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Plus } from 'lucide-react'

const Home = () => {
  return (
    <main className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <Card className="w-lg p-4">
        <div className="flex gap-2">
          <Input placeholder="Adicionar tarefa"/>
          <Button variant="outline"><Plus/>Cadastrar</Button>
        </div>
        <Separator/>
      </Card>
    </main>
  )
}

export default Home