import type React from "react"
import type { WorksheetConfig } from "@/components/worksheet/worksheet-generator"

export function generatePDF(
  config: WorksheetConfig,
  operations: string[],
  previewRef: React.RefObject<HTMLDivElement>,
  answersRef: React.RefObject<HTMLDivElement>,
) {
  // Create a new window for printing
  const printWindow = window.open("", "_blank")

  if (!printWindow) {
    throw new Error("No se pudo abrir la ventana de impresión. Verifica que los pop-ups estén permitidos.")
  }

  // Get the content to print
  const previewContent = previewRef.current?.innerHTML || ""
  const answersContent = config.includeAnswers && answersRef.current ? answersRef.current.innerHTML : ""

  // Build the HTML for the print window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${config.title}</title>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
        <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: system-ui, -apple-system, sans-serif;
            padding: 2rem;
            background: white;
            color: black;
          }
          
          .page {
            max-width: 210mm;
            margin: 0 auto 2rem;
            page-break-after: always;
          }
          
          h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-align: center;
          }
          
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
          }
          
          .problem {
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            min-height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          @media print {
            body {
              padding: 1rem;
            }
            
            .page {
              page-break-after: always;
            }
            
            @page {
              margin: 1cm;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          ${previewContent}
        </div>
        ${answersContent ? `<div class="page">${answersContent}</div>` : ""}
        
        <script>
          // Wait for MathJax to load and render, then trigger print
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\$$', '\\\$$']],
              displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
            },
            startup: {
              ready: () => {
                MathJax.startup.defaultReady();
                MathJax.startup.promise.then(() => {
                  setTimeout(() => {
                    window.print();
                  }, 500);
                });
              }
            }
          };
        </script>
      </body>
    </html>
  `)

  printWindow.document.close()
}
