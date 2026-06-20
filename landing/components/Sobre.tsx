'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Heart } from 'lucide-react'
import { fadeUp, stagger, slideLeft, scaleUp } from '@/lib/motion'

const checks = [
  'Estrutura própria para clínica e estética',
  'Equipe formada e em constante atualização',
  'Histórico clínico digital de cada paciente',
]

export default function Sobre() {
  return (
    <section id="sobre" className="py-24 bg-ink-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Arte / card visual */}
          <motion.div
            variants={scaleUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <div className="relative w-full max-w-xs mx-auto">
              {/* Blob de fundo */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-primarySoft to-brand-accentSoft blur-2xl scale-110 opacity-70" />

              <div className="relative bg-white rounded-3xl border border-ink-200 shadow-card p-10 flex flex-col items-center gap-6">
                {/* Coração animado */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Heart
                    size={88}
                    strokeWidth={1.2}
                    className="text-brand-primary"
                    style={{ filter: 'drop-shadow(0 0 20px rgba(19,168,158,.3))' }}
                  />
                </motion.div>

                {/* Ano fundação */}
                <div className="text-center bg-brand-primarySoft rounded-2xl px-8 py-4 w-full">
                  <p className="text-4xl font-extrabold text-brand-primary">2013</p>
                  <p className="text-ink-500 text-sm mt-0.5">Ano de fundação</p>
                </div>

                {/* Fundador */}
                <div className="text-center">
                  <p className="font-bold text-ink-900">Dr. Ighor Morales</p>
                  <p className="text-ink-400 text-sm">Médico Veterinário · CRMV-SP 00000</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Texto */}
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-5"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex w-fit px-4 py-1.5 rounded-full bg-brand-primarySoft text-brand-primaryDark text-sm font-semibold"
            >
              Sobre Nós
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-tight text-balance"
            >
              Nossa história{' '}
              <span className="gradient-text">e fundação</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-ink-500 leading-relaxed">
              A <strong className="text-ink-900">Cia Pet</strong> nasceu em{' '}
              <strong className="text-ink-900">2013</strong>, do sonho do médico veterinário{' '}
              <strong className="text-ink-900">Dr. Ighor Morales</strong>, que uniu experiência
              clínica e paixão pelos animais para criar um espaço de cuidado de verdade.
            </motion.p>

            <motion.p variants={fadeUp} className="text-ink-500 leading-relaxed">
              O que começou como um pequeno consultório de bairro cresceu e se tornou uma clínica
              completa, com setor de estética (banho e tosa) e uma equipe dedicada. Em mais de uma
              década, já cuidamos de milhares de pets — sempre com o mesmo princípio:{' '}
              <em className="text-ink-700">tratar cada animal como se fosse nosso.</em>
            </motion.p>

            <motion.ul variants={stagger(0.08)} className="flex flex-col gap-3 mt-1">
              {checks.map((item) => (
                <motion.li
                  key={item}
                  variants={slideLeft}
                  className="flex items-center gap-3 text-ink-700 text-sm"
                >
                  <CheckCircle2 size={18} className="text-brand-primary flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.a
              variants={fadeUp}
              href="#agendamento"
              className="inline-flex w-fit items-center gap-2 mt-2 px-6 py-3 rounded-2xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primaryDark active:scale-95 transition-all shadow-md"
            >
              Agendar uma consulta
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
