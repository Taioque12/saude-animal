'use client'

import { motion } from 'framer-motion'
import { Calendar, Phone, Star, Shield, Clock } from 'lucide-react'
import { fadeUp, stagger } from '@/lib/motion'

const badges = [
  { icon: Shield, text: 'CRMV Credenciado' },
  { icon: Clock,  text: 'Atendimento rápido' },
  { icon: Star,   text: '5★ pelos tutores' },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Fundo degradê suave */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-brand-primarySoft via-white to-brand-accentSoft"
      />

      {/* Blob decorativo top-right */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.08, 1], rotate: [0, 6, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-brand-primary/10 blur-3xl pointer-events-none"
      />
      {/* Blob decorativo bottom-left */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.12, 1], rotate: [0, -8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-40 -left-24 w-[440px] h-[440px] rounded-full bg-brand-accent/10 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* ── Coluna texto ── */}
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Pill */}
          <motion.span
            variants={fadeUp}
            className="inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primaryDark text-sm font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            Lençóis Paulista / SP
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-balance"
          >
            Seu pet merece{' '}
            <span className="gradient-text">cuidado de verdade</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={fadeUp}
            className="text-lg text-ink-500 leading-relaxed max-w-md"
          >
            Clínica veterinária completa e serviço de banho &amp; tosa com toda a atenção
            que o seu companheiro de quatro patas merece — do Dr. Ighor Morales e equipe.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <a
              href="#agendamento"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-primary text-white font-semibold text-base hover:bg-brand-primaryDark active:scale-95 transition-all shadow-md hover:shadow-glow"
            >
              <Calendar size={18} />
              Agendar agora
            </a>
            <a
              href="tel:+5514999999999"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-ink-200 text-ink-700 font-semibold text-base hover:border-brand-primary hover:text-brand-primary active:scale-95 transition-all bg-white/70"
            >
              <Phone size={18} />
              Ligar agora
            </a>
          </motion.div>

          {/* Badges */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
            {badges.map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-ink-200 text-xs font-medium text-ink-700 shadow-sm"
              >
                <Icon size={13} className="text-brand-primary" />
                {text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Coluna ilustração ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 32 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Card flutuante principal */}
          <div className="relative w-full max-w-sm mx-auto">
            {/* Círculo de fundo */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-accent opacity-10 blur-2xl scale-110" />

            <div className="relative bg-white rounded-3xl shadow-card border border-ink-200 p-8 flex flex-col items-center gap-5">
              {/* SVG pet illustration */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 200 200" className="w-40 h-40" aria-hidden>
                  {/* Corpo */}
                  <ellipse cx="100" cy="130" rx="54" ry="44" fill="#13a89e" opacity=".15" />
                  <ellipse cx="100" cy="125" rx="44" ry="38" fill="#13a89e" opacity=".8" />
                  {/* Cabeça */}
                  <circle cx="100" cy="78" r="32" fill="#13a89e" />
                  {/* Orelhas */}
                  <ellipse cx="74"  cy="52" rx="12" ry="18" fill="#0d8d84" transform="rotate(-15 74 52)" />
                  <ellipse cx="126" cy="52" rx="12" ry="18" fill="#0d8d84" transform="rotate(15 126 52)" />
                  {/* Focinho */}
                  <ellipse cx="100" cy="88" rx="16" ry="11" fill="#e2f4f1" />
                  <ellipse cx="100" cy="91" rx="6"  ry="4"  fill="#0d8d84" opacity=".5" />
                  {/* Olhos */}
                  <circle cx="88"  cy="74" r="5" fill="white" />
                  <circle cx="112" cy="74" r="5" fill="white" />
                  <circle cx="89"  cy="75" r="2.5" fill="#14302b" />
                  <circle cx="113" cy="75" r="2.5" fill="#14302b" />
                  <circle cx="90"  cy="74" r="1"   fill="white" />
                  <circle cx="114" cy="74" r="1"   fill="white" />
                  {/* Patinhas */}
                  <ellipse cx="74"  cy="162" rx="12" ry="8" fill="#0d8d84" opacity=".8" />
                  <ellipse cx="126" cy="162" rx="12" ry="8" fill="#0d8d84" opacity=".8" />
                  {/* Cauda */}
                  <path d="M148 140 Q170 110 162 90" stroke="#e8743b" strokeWidth="8" strokeLinecap="round" fill="none" />
                  {/* Cruz / símbolo saúde */}
                  <rect x="93" y="106" width="14" height="4" rx="2" fill="white" opacity=".9" />
                  <rect x="98" y="101" width="4"  height="14" rx="2" fill="white" opacity=".9" />
                </svg>
              </motion.div>

              <div className="text-center">
                <p className="font-bold text-ink-900 text-lg">Cia Pet</p>
                <p className="text-ink-500 text-sm">Clínica Veterinária & Banho e Tosa</p>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3 w-full pt-2 border-t border-ink-200">
                {[
                  { n: '5+',   l: 'Anos' },
                  { n: '1k+',  l: 'Pets' },
                  { n: '100%', l: 'Amor' },
                ].map(({ n, l }) => (
                  <div key={l} className="text-center">
                    <p className="font-extrabold text-brand-primary text-xl">{n}</p>
                    <p className="text-ink-400 text-xs">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating chip — agendamento */}
          <motion.div
            initial={{ opacity: 0, x: 32, y: -16 }}
            animate={{ opacity: 1, x: 0,  y: 0   }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-4 -right-4 bg-white border border-ink-200 shadow-card rounded-2xl px-4 py-2.5 flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-ink-700">Atendendo agora</span>
          </motion.div>

          {/* Floating chip — estrelas */}
          <motion.div
            initial={{ opacity: 0, x: -32, y: 16 }}
            animate={{ opacity: 1, x: 0,   y: 0  }}
            transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-4 -left-4 bg-white border border-ink-200 shadow-card rounded-2xl px-4 py-2.5"
          >
            <div className="flex gap-0.5 mb-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs font-semibold text-ink-700">+200 avaliações</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Seta de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-ink-400 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-ink-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
