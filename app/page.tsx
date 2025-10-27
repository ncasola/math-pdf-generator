"use client"
import WorksheetGenerator from "@/components/worksheet/worksheet-generator"
import BottomNav from "@/components/common/bottom-nav"
import Sidebar from "@/components/common/sidebar"

export default function HomePage() {
  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-balance">Generador de Hojas de Ejercicios</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Crea hojas de ejercicios matemáticos personalizadas en PDF con LaTeX y MathJax
            </p>
          </div>

          {/* Generator Component */}
          <WorksheetGenerator />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  )
}
