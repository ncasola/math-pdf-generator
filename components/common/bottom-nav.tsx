"use client"
import Gravatar from "react-gravatar"
import { useTheme } from "next-themes"
import { Moon, Sun, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BottomNav() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">MathPDF</span>
        </div>

        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <Gravatar email="user@example.com" className="rounded-full" size={32} />
      </div>
    </nav>
  )
}
