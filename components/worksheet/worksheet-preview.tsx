"use client"
import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "react-toastify"
import type { WorksheetConfig } from "./worksheet-generator"
import { generatePDF } from "@/lib/pdf-generator"

interface WorksheetPreviewProps {
  config: WorksheetConfig
  operations: string[]
}

export default function WorksheetPreview({ config, operations }: WorksheetPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const answersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load MathJax
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
    script.async = true
    script.onload = () => {
      if (window.MathJax) {
        window.MathJax.typesetPromise?.()
      }
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    // Retypeset when operations change
    if (window.MathJax) {
      window.MathJax.typesetPromise?.()
    }
  }, [operations])

  const handleDownloadPDF = () => {
    try {
      generatePDF(config, operations, previewRef, answersRef)
      toast.success("Abriendo ventana de impresión...")
    } catch (error) {
      toast.error("Error al abrir la ventana de impresión. Verifica que los pop-ups estén permitidos.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Download Button */}
      <div className="flex justify-end">
        <Button onClick={handleDownloadPDF} size="lg">
          <Download className="w-4 h-4 mr-2" />
          Descargar PDF
        </Button>
      </div>

      {/* Problems Preview */}
      <Card className="p-6 md:p-8">
        <div ref={previewRef} className="space-y-6">
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold">{config.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">Nombre: _________________ Fecha: _________________</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {operations.map((op, idx) => (
              <div key={idx} className="border rounded-lg p-3 flex flex-col items-center justify-center min-h-[80px]">
                <div className="text-lg font-medium mb-2">{idx + 1}.</div>
                <div className="text-center" dangerouslySetInnerHTML={{ __html: `\$$${op}\$$` }} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Answers Preview */}
      {config.includeAnswers && (
        <Card className="p-6 md:p-8">
          <div ref={answersRef} className="space-y-6">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">Respuestas - {config.title}</h2>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {operations.map((op, idx) => {
                const answer = evaluateLatex(op)
                return (
                  <div key={idx} className="border rounded-lg p-2 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {idx + 1}. {answer}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

function evaluateLatex(latex: string): string {
  try {
    // Handle vertical format (array) for addition, subtraction, and multiplication
    if (latex.includes("\\begin{array}")) {
      // Addition: \begin{array}{r} num1 \\ + num2 \\ \hline \end{array}
      const addMatch = latex.match(/\\begin{array}{r}\s*(\d+)\s*\\\\\s*\+\s*(\d+)\s*\\\\/)
      if (addMatch) {
        const num1 = Number.parseInt(addMatch[1])
        const num2 = Number.parseInt(addMatch[2])
        return (num1 + num2).toString()
      }

      // Subtraction: \begin{array}{r} num1 \\ - num2 \\ \hline \end{array}
      const subMatch = latex.match(/\\begin{array}{r}\s*(\d+)\s*\\\\\s*-\s*(\d+)\s*\\\\/)
      if (subMatch) {
        const num1 = Number.parseInt(subMatch[1])
        const num2 = Number.parseInt(subMatch[2])
        return (num1 - num2).toString()
      }

      // Multiplication: \begin{array}{r} num1 \\ \times num2 \\ \hline \end{array}
      const multMatch = latex.match(/\\begin{array}{r}\s*(\d+)\s*\\\\\s*\\times\s*(\d+)\s*\\\\/)
      if (multMatch) {
        const num1 = Number.parseInt(multMatch[1])
        const num2 = Number.parseInt(multMatch[2])
        return (num1 * num2).toString()
      }
    }

    if (latex.includes("\\overline")) {
      const divMatch = latex.match(/(\d+)\s*\\overline{\)\s*(\d+)}/)
      if (divMatch) {
        const divisor = Number.parseInt(divMatch[1])
        const dividend = Number.parseInt(divMatch[2])
        return (dividend / divisor).toString()
      }
    }

    // Handle linear format
    const cleaned = latex
      .replace(/\\div/g, "/")
      .replace(/\\times/g, "*")
      .replace(/=/g, "")
      .trim()

    const result = eval(cleaned)
    return Math.round(result * 100) / 100 + ""
  } catch {
    return "?"
  }
}

// Extend Window type for MathJax
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>
    }
  }
}
