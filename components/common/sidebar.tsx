"use client"
import Gravatar from "react-gravatar"
import { useTheme } from "next-themes"
import { Moon, Sun, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const { theme, setTheme } = useTheme()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur sticky top-0 h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MathPDF</h1>
            <p className="text-xs text-muted-foreground">Generador</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-2">
          <div className="px-3 py-2 rounded-lg bg-secondary">
            <p className="text-sm font-medium">Inicio</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gravatar email="ncasolajimenez@gmail.com" className="rounded-full" size={32} />
            <a
              href="https://github.com/ncasola"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Nestor Casola
            </a>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>Generador de hojas matemáticas</p>
          <p className="mt-1">100% cliente • Sin registro</p>
        </div>
      </div>
    </aside>
  )
}
