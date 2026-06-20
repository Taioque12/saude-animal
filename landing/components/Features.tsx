'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Stethoscope, Scissors, HeartPulse, CheckCircle2 } from 'lucide-react'
import { fadeUp, stagger, scaleUp } from '@/lib/motion'

const features = [
  {
    icon: Stethoscope,
    color: 'bg-brand-primarySoft text-brand-primaryDark',
    border: 'hover:border-brand-primary/40',
    title: 'Consultas & Exames',
    description:
      'Avaliação clínica completa, exames laboratoriais, diagnóstico por imagem e acompanhamento preventivo com Dr. Ighor Morales.',
    items: ['Clínica geral', 'Vacinação', 'Exames de sangue', 'Ultrassom'],
  },
  {
    icon: Scissors,
    color: 'bg-brand-accentSoft text-brand-accentDark',
    border: 'hover:border-brand-accent/40',
    title: 'Banho & Tosa',
    description:
      'Profissionais treinados, produtos dermatológicos premium e ambiente tranquilo para deixar seu pet cheiroso e feliz.',
    items: ['Banho completo', 'Tosa higiênica', 'Tosa padrão de raça', 'Escovação'],
    destaque: true,
  },
  {
    icon: HeartPulse,
    color: 'bg-purple-50 text-purple-700',
    border: 'hover:border-purple-300',
    title: 'Internação & Cirurgia',
    description:
      'Centro cirúrgico equipado e UTI veterinária com monitoramento 24h para os casos que exigem maior cuidado.',
    items: ['Cirurgias eletivas', 'Internação monitorada', 'Pós-operatório', 'Emergências'],
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon
  const ref  = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.article
      ref={ref}
      variants={scaleUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`relative bg-white rounded-3xl border border-ink-200 ${feature.border} p-7 flex flex-col gap-5 shadow-card transition-all duration-300 cursor-default group`}
    >
      {feature.destaque && (
        <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-brand-accent text-white text-xs font-bold shadow">
          Mais procurado
        </span>
      )}

      {/* Ícone */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color}`}>
        <Icon size={26} strokeWidth={1.8} />
      </div>

      {/* Texto */}
      <div>
        <h3 className="text-xl font-bold text-ink-900 mb-2">{feature.title}</h3>
        <p className="text-ink-500 leading-relaxed text-sm">{feature.description}</p>
      </div>

      {/* Checklist */}
      <ul className="flex flex-col gap-2 mt-auto">
        {feature.items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-ink-700">
            <CheckCircle2 size={15} className="text-brand-primary flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      {/* Linha de fundo decorativa */}
      <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.article>
  )
}

export default function Features() {
  const headerRef = useRef(null)
  const inView    = useInView(headerRef, { once: true, margin: '-60px' })

  return (
    <section id="servicos" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          ref={headerRef}
          variants={stagger(0.1)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16 flex flex-col items-center gap-4"
        >
          <motion.span variants={fadeUp} className="px-4 py-1.5 rounded-full bg-brand-primarySoft text-brand-primaryDark text-sm font-semibold">
            Nossos Serviços
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">
            Tudo que seu pet precisa,{' '}
            <span className="gradient-text">em um só lugar</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-500 text-lg max-w-xl">
            Da consulta preventiva ao banho relaxante — cuidamos com carinho e tecnologia.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>

        {/* Banner de horários */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-brand-primary to-brand-primaryDark rounded-3xl p-7 flex flex-col sm:flex-row items-center justify-between gap-6 text-white"
        >
          <div>
            <p className="font-bold text-xl mb-1">Horários de atendimento</p>
            <p className="text-white/80 text-sm">Seg – Sex: 08h às 12h · 13h30 às 18h&nbsp;&nbsp;|&nbsp;&nbsp;Sáb: 08h às 12h</p>
          </div>
          <a
            href="#agendamento"
            className="flex-shrink-0 px-6 py-3 rounded-2xl bg-white text-brand-primaryDark font-bold text-sm hover:bg-brand-primarySoft active:scale-95 transition-all"
          >
            Agendar consulta
          </a>
        </motion.div>
      </div>
    </section>
  )
}
