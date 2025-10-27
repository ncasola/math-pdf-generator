"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "react-toastify"
import { generateOperations } from "@/lib/math-generator"
import WorksheetPreview from "./worksheet-preview"
import { Eye, Sparkles } from "lucide-react"

export type OperationType = "addition" | "subtraction" | "multiplication" | "division" | "mixed"
export type DifficultyLevel = "easy" | "medium" | "hard"
export type OperationFormat = "linear" | "vertical" | "long-division"

export interface WorksheetConfig {
  operationType: OperationType
  difficulty: DifficultyLevel
  numberOfProblems: number
  includeAnswers: boolean
  title: string
  operationFormat: OperationFormat
}

export default function WorksheetGenerator() {
  const [config, setConfig] = useState<WorksheetConfig>({
    operationType: "addition",
    difficulty: "easy",
    numberOfProblems: 20,
    includeAnswers: true,
    title: "Hoja de Ejercicios Matemáticos",
    operationFormat: "linear",
  })

  const [operations, setOperations] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerate = () => {
    try {
      const ops = generateOperations(config)
      setOperations(ops)
      setShowPreview(true)
      toast.success("¡Hoja generada exitosamente!")
    } catch (error) {
      toast.error("Error al generar la hoja")
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="p-6 md:p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Configuración
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Título de la hoja</Label>
            <Input
              id="title"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              placeholder="Ej: Práctica de Sumas"
            />
          </div>

          {/* Operation Type */}
          <div className="space-y-2">
            <Label htmlFor="operation">Tipo de operación</Label>
            <Select
              value={config.operationType}
              onValueChange={(value: OperationType) => setConfig({ ...config, operationType: value })}
            >
              <SelectTrigger id="operation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="addition">Suma (+)</SelectItem>
                <SelectItem value="subtraction">Resta (−)</SelectItem>
                <SelectItem value="multiplication">Multiplicación (×)</SelectItem>
                <SelectItem value="division">División (÷)</SelectItem>
                <SelectItem value="mixed">Mixto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">Nivel de dificultad</Label>
            <Select
              value={config.difficulty}
              onValueChange={(value: DifficultyLevel) => setConfig({ ...config, difficulty: value })}
            >
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Medio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format Selector for Addition, Subtraction, and Multiplication */}
          {(config.operationType === "addition" ||
            config.operationType === "subtraction" ||
            config.operationType === "multiplication") && (
            <div className="space-y-2">
              <Label htmlFor="format">Formato</Label>
              <Select
                value={config.operationFormat}
                onValueChange={(value: OperationFormat) => setConfig({ ...config, operationFormat: value })}
              >
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">
                    Lineal (
                    {config.operationType === "addition"
                      ? "3 + 5 ="
                      : config.operationType === "subtraction"
                        ? "8 - 3 ="
                        : "4 × 3 ="}
                    )
                  </SelectItem>
                  <SelectItem value="vertical">Vertical (columna)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Format Selector for Division */}
          {config.operationType === "division" && (
            <div className="space-y-2">
              <Label htmlFor="format">Formato</Label>
              <Select
                value={config.operationFormat}
                onValueChange={(value: OperationFormat) => setConfig({ ...config, operationFormat: value })}
              >
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Lineal (12 ÷ 3 =)</SelectItem>
                  <SelectItem value="long-division">División larga</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Number of Problems */}
          <div className="space-y-2">
            <Label htmlFor="problems">Número de ejercicios</Label>
            <Input
              id="problems"
              type="number"
              min="5"
              max="100"
              value={config.numberOfProblems}
              onChange={(e) =>
                setConfig({
                  ...config,
                  numberOfProblems: Number.parseInt(e.target.value) || 20,
                })
              }
            />
          </div>

          {/* Include Answers */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="answers"
              checked={config.includeAnswers}
              onCheckedChange={(checked) => setConfig({ ...config, includeAnswers: checked as boolean })}
            />
            <Label
              htmlFor="answers"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Incluir hoja de respuestas
            </Label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-8">
          <Button onClick={handleGenerate} size="lg" className="w-full md:w-auto">
            <Eye className="w-4 h-4 mr-2" />
            Generar Vista Previa
          </Button>
        </div>
      </Card>

      {/* Preview */}
      {showPreview && operations.length > 0 && <WorksheetPreview config={config} operations={operations} />}
    </div>
  )
}
