#Planificador de clases con IA 
 
Generador de Instrumentos, Planificaciones y Correcciones
TL;DR Un dashboard para docentes que, con ayuda de IA, genera rúbricas, planificaciones inversas, actividades interactivas y corrige trabajos de forma automática.


✨ Características
Módulo	¿Qué hace?
Instrumentos	Rúbricas (tabla de cotejo / matriz de niveles), listas de indicadores y fórmulas de nota.
Planificación inversa	Crea guiones de clase, documento UTP y exporta a DOCX.
Actividades IA	Sopa de letras, crucigrama, cloze, problemas matemáticos, flashcards, etc.
Corrección automática	Sube múltiples archivos, aplica la rúbrica y devuelve retroalimentación.
Historial	Lista tus últimas creaciones y métricas básicas.

🚀 Stack
Layer	Tecnologías
Frontend	Next.js 14 (App Router) · TypeScript · React-Hook-Form · Tailwind CSS · shadcn/ui · Framer-Motion
IA / Prompts	DeepSeek (se puede cambiar a OpenAI)
Archivos	uploadthing (drag-&-drop)
DOCX export	docx + file-saver
Dev	ESLint · Prettier · Husky + lint-staged

🛠️ Instalación local
bash
Copiar
Editar
git clone https://github.com/tu-usuario/planificador-ia.git
cd planificador-ia
pnpm i            # o npm install / yarn
cp .env.example .env.local
Rellena las variables de .env.local:

env
Copiar
Editar
# 🔑 Tu API key del modelo
OPENAI_API_KEY=sk-...

# (opcional) clave DeepSeek u otro proveedor
DEEPSEEK_API_KEY=...
Inicia el modo desarrollo:

bash
Copiar
Editar
pnpm dev
Abre http://localhost:3000.

Nota: toda la IA se ejecuta en localhost para evitar latencias durante el desarrollo.

📦 Comandos útiles
Acción	Script
Dev server + HMR	pnpm dev
Build production	pnpm build
Preview build	pnpm start
Lint & format	pnpm lint
Test prettier	pnpm format

🗺️ Roadmap
 Integrar autenticación (NextAuth).

 Guardar historial en Supabase.

 Exportar a PDF.

 Sincronizar con Google Classroom.

 Panel de analytics para UTP.

🤝 Contribuir
Fork el repo y crea tu rama (git checkout -b feat/nueva-funcionalidad).

Haz commit de tus cambios (git commit -m "feat: algo nuevo").

Push a tu rama (git push origin feat/nueva-funcionalidad).

Abre un Pull Request.

¡Se agradecen issues, ideas y todo tipo de feedback!

📝 Licencia
Este proyecto se distribuye bajo la licencia MIT – consulta el archivo LICENSE para más información.

Abre un Pull Request.

¡Se agradecen issues, ideas y todo tipo de feedback!

📝 Licencia
Este proyecto se distribuye bajo la licencia MIT – consulta el archivo LICENSE para más información.
