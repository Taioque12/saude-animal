'use client'

import { motion } from 'framer-motion'
import { Eye, Navigation, Heart } from 'lucide-react'
import { fadeUp, stagger, scaleUp } from '@/lib/motion'

const pilares = [
  {
    icon: Eye,
    titulo: 'Visão',
    texto:
      'Ser reconhecida como referência regional em medicina veterinária e estética animal, unindo tecnologia, ética e acolhimento como padrão de cuidado.',
    color: 'bg-brand-primarySoft text-brand-primaryDark',
    border: 'hover:border-brand-primary/40',
    tag: 'Para onde vamos',
  },
  {
    icon: Navigation,
    titulo: 'Missão',
    texto:
      'Promover saúde, bem-estar e qualidade de vida aos animais por meio de um atendimento responsável, ágil e humano — buscando excelência contínua nos serviços.',
    color: 'bg-brand-accentSoft text-brand-accentDark',
    border: 'hover:border-brand-accent/40',
    tag: 'O que fazemos',
    destaque: true,
  },
  {
    icon: Heart,
    titulo: 'Valores',
    texto:
      'Ética e respeito à vida animal · Compromisso com o bem-estar · Transparência com os tutores · Empatia · Responsabilidade e atualização profissional contínua.',
    color: 'bg-purple-50 text-purple-700',
    border: 'hover:border-purple-300',
    tag: 'Como agimos',
  },
]

export default function Identidade() {
  return (
    <section id="identidade" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-16 flex flex-col items-center gap-4"
        >
          <motion.span
            variants={fadeUp}
            className="px-4 py-1.5 rounded-full bg-brand-primarySoft text-brand-primaryDark text-sm font-semibold"
          >
            Identidade Organizacional
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance"
          >
            Visão, Missão{' '}
            <span className="gradient-text">e Valores</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-500 text-lg max-w-xl">
            Os princípios que guiam cada atendimento na Cia Pet — desde a recepção até o pós-consulta.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilares.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.article
                key={p.titulo}
                variants={scaleUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`relative bg-white rounded-3xl border border-ink-200 ${p.border} p-8 flex flex-col gap-5 shadow-card transition-all duration-300 cursor-default group`}
              >
                {/* Tag */}
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink-400">
                  {p.tag}
                </span>

                {/* Ícone */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${p.color}`}>
                  <Icon size={26} strokeWidth={1.8} />
                </div>

                {/* Título */}
                <h3 className="text-2xl font-extrabold text-ink-900">{p.titulo}</h3>

                {/* Texto */}
                <p className="text-ink-500 leading-relaxed text-sm flex-1">{p.texto}</p>

                {/* Linha de fundo */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
