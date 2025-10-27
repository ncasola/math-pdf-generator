import type { WorksheetConfig } from "@/components/worksheet/worksheet-generator"

export function generateOperations(config: WorksheetConfig): string[] {
  const operations: string[] = []

  for (let i = 0; i < config.numberOfProblems; i++) {
    let operation: string

    if (config.operationType === "mixed") {
      const types = ["addition", "subtraction", "multiplication", "division"]
      const randomType = types[Math.floor(Math.random() * types.length)]
      operation = generateSingleOperation(randomType as any, config.difficulty, config.operationFormat)
    } else {
      operation = generateSingleOperation(config.operationType, config.difficulty, config.operationFormat)
    }

    operations.push(operation)
  }

  return operations
}

function generateSingleOperation(
  type: "addition" | "subtraction" | "multiplication" | "division",
  difficulty: "easy" | "medium" | "hard",
  format: "linear" | "vertical" | "long-division" = "linear",
): string {
  const ranges = {
    easy: { min: 1, max: 20 },
    medium: { min: 10, max: 100 },
    hard: { min: 50, max: 500 },
  }

  const range = ranges[difficulty]

  const num1 = randomInt(range.min, range.max)
  const num2 = randomInt(range.min, range.max)

  const larger = Math.max(num1, num2)
  const smaller = Math.min(num1, num2)

  switch (type) {
    case "addition":
      if (format === "vertical") {
        return `\\begin{array}{r} ${larger} \\\\ + ${smaller} \\\\ \\hline \\end{array}`
      }
      return `${larger} + ${smaller} =`

    case "subtraction":
      if (format === "vertical") {
        return `\\begin{array}{r} ${larger} \\\\ - ${smaller} \\\\ \\hline \\end{array}`
      }
      return `${larger} - ${smaller} =`

    case "multiplication":
      const mult1 = difficulty === "easy" ? randomInt(1, 12) : num1
      const mult2 = difficulty === "easy" ? randomInt(1, 12) : num2
      const multLarger = Math.max(mult1, mult2)
      const multSmaller = Math.min(mult1, mult2)
      if (format === "vertical") {
        return `\\begin{array}{r} ${multLarger} \\\\ \\times ${multSmaller} \\\\ \\hline \\end{array}`
      }
      return `${multLarger} \\times ${multSmaller} =`

    case "division":
      const divisor = difficulty === "easy" ? randomInt(2, 12) : randomInt(2, 20)
      const quotient = randomInt(range.min, range.max)
      const dividend = divisor * quotient
      if (format === "long-division") {
        return `${divisor} \\overline{) ${dividend}}`
      }
      return `${dividend} \\div ${divisor} =`

    default:
      return `${larger} + ${smaller} =`
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
