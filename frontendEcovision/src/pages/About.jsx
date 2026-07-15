import { Leaf, Sprout, Sparkles, HeartHandshake } from 'lucide-react'
import SectionCard from '../components/common/SectionCard.jsx'

const TECH_STACK = [
  { name: 'React', role: 'Frontend' },
  { name: 'FastAPI', role: 'Backend' },
  { name: 'YOLOv8', role: 'Detección de objetos' },
  { name: 'Gemini 2.5 Flash', role: 'Recomendaciones (LLM)' },
  { name: 'PostgreSQL', role: 'Base de datos' },
  { name: 'Docker', role: 'Contenerización' },
]

const HIGHLIGHTS = [
  {
    icon: Sprout,
    title: 'Sostenibilidad',
    text: 'Promueve mejores prácticas de separación en la fuente mediante recomendaciones comprensibles y oportunas.',
  },
  {
    icon: Sparkles,
    title: 'Innovación',
    text: 'Aplica un agente visual multimodal que combina visión computacional con un modelo de lenguaje grande.',
  },
  {
    icon: HeartHandshake,
    title: 'Aplicación de IA responsable',
    text: 'Considera sesgos del modelo, falsos positivos/negativos, privacidad de imágenes y manejo de errores.',
  },
  {
    icon: Leaf,
    title: 'Impacto positivo',
    text: 'Cada detección busca fortalecer la educación ambiental y reducir errores en la disposición de residuos.',
  },
]

const TEAM = [
  'Johan Sebastian Acosta Restrepo',
  'Wilson Andres Martinez Rivera',
  'Juan Manuel Perea Coronado',
  'Hassen David Ortiz Álvarez',
  'Heidy Mina Garcia',
]

export default function About() {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <Leaf size={30} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">EcoVision</h2>
          <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Agente visual inteligente para la clasificación responsable de residuos. Identifica residuos en tiempo real
            mediante visión computacional y complementa la detección con recomendaciones generadas por un modelo de
            lenguaje, fortaleciendo la educación ambiental mediante una interacción sencilla.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Tecnologías utilizadas">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TECH_STACK.map((tech) => (
            <div key={tech.name} className="rounded-xl2 border border-slate-100 p-3 text-center dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{tech.name}</p>
              <p className="text-xs text-slate-400">{tech.role}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {HIGHLIGHTS.map((item) => (
          <SectionCard key={item.title}>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                <item.icon size={17} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.text}</p>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Nuestro equipo" subtitle="Proyecto Integrador II · Universidad del Valle">
        <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {TEAM.map((name) => (
            <li key={name} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
              {name}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
