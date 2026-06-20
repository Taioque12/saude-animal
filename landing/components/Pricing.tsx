'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Zap } from 'lucide-react'
import { fadeUp, stagger, scaleUp } from '@/lib/motion'

const plans = [
  {
    name: 'Básico',
    price: 'R$ 80',
    period: 'por consulta',
    description: 'Ideal para check-ups e vacinações de rotina.',
    cta: 'Agendar consulta',
    highlight: false,
    items: [
      'Consulta clínica geral',
      'Orientação nutricional',
      'Carteira de vacinação',
      'Pesagem e medição',
      'Receituário digital',
    ],
  },
  {
    name: 'Premium',
    price: 'R$ 199',
    period: 'por mês',
    description: 'Plano mensal completo — o mais escolhido pelos tutores.',
    cta: 'Começar agora',
    highlight: true,
    badge: 'Mais popular',
    items: [
      'Consultas ilimitadas',
      'Banho & Tosa mensal incluso',
      'Exames de rotina',
      'Desconto de 20% em exames',
      'Atendimento prioritário',
      'Histórico digital do pet',
    ],
  },
  {
    name: 'Família',
    price: 'R$ 349',
    period: 'por mês',
    description: 'Para quem tem mais de um pet em casa.',
    cta: 'Falar com atendente',
    highlight: false,
    items: [
      'Tudo do plano Premium',
      'Até 3 pets incluídos',
      'Banho & Tosa para todos',
      'Internação com desconto',
      'Consulta de urgência',
      'Atendimento VIP',
    ],
  },
]

export default function Pricing() {
  return (
    <section id="planos" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-16 flex flex-col items-center gap-4"
        >
          <motion.span variants={fadeUp} className="px-4 py-1.5 rounded-full bg-brand-primarySoft text-brand-primaryDark text-sm font-semibold">
            Planos & Preços
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">
            Investimento acessível,{' '}
            <span className="gradient-text">cuidado sem igual</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-500 text-lg max-w-xl">
            Escolha o plano ideal para o seu pet. Sem letras pequenas, sem surpresas.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`relative rounded-3xl border p-7 flex flex-col gap-6 shadow-card transition-all duration-300 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-brand-primary to-brand-primaryDark border-brand-primary text-white ring-2 ring-brand-primary ring-offset-2'
                  : 'bg-white border-ink-200 hover:border-brand-primary/30'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent text-white text-xs font-bold shadow-md">
                  <Zap size={11} />
                  {plan.badge}
                </div>
              )}

              <div>
                <p className={`text-sm font-semibold mb-3 ${plan.highlight ? 'text-white/70' : 'text-ink-500'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-ink-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-white/70' : 'text-ink-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${plan.highlight ? 'text-white/80' : 'text-ink-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="flex flex-col gap-2.5">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2
                      size={16}
                      className={`flex-shrink-0 ${plan.highlight ? 'text-white/90' : 'text-brand-primary'}`}
                    />
                    <span className={plan.highlight ? 'text-white/90' : 'text-ink-700'}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#agendamento"
                className={`mt-auto flex items-center justify-center py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                  plan.highlight
                    ? 'bg-white text-brand-primaryDark hover:bg-brand-primarySoft'
                    : 'bg-brand-primary text-white hover:bg-brand-primaryDark'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-ink-400 text-sm mt-10"
        >
          * Valores para consulta. Entre em contato para orçamentos personalizados.
        </motion.p>
      </div>
    </section>
  )
}
