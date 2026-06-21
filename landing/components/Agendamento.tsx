'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react'
import { fadeUp, stagger, scaleUp } from '@/lib/motion'

const PHONE_DISPLAY = '(14) 3264-7135'
const PHONE_TEL     = '+551432647135'
const WA_LINK       = 'https://wa.me/551432647135?text=Ol%C3%A1%21+Gostaria+de+agendar+uma+consulta+para+meu+pet.'

const cards = [
  {
    icon: Phone,
    color: 'bg-brand-primarySoft text-brand-primaryDark',
    border: 'hover:border-brand-primary/40',
    title: 'Telefone',
    value: PHONE_DISPLAY,
    sub: 'Seg–Sex 08h–18h · Sáb 08h–12h',
    href: `tel:${PHONE_TEL}`,
    label: 'Ligar agora',
    btnClass: 'bg-brand-primary text-white hover:bg-brand-primaryDark',
  },
  {
    icon: MessageCircle,
    color: 'bg-green-50 text-green-700',
    border: 'hover:border-green-300',
    title: 'WhatsApp',
    value: PHONE_DISPLAY,
    sub: 'Resposta rápida · envie uma mensagem',
    href: WA_LINK,
    label: 'Abrir WhatsApp',
    btnClass: 'bg-green-600 text-white hover:bg-green-700',
    external: true,
  },
  {
    icon: MapPin,
    color: 'bg-amber-50 text-amber-700',
    border: 'hover:border-amber-300',
    title: 'Endereço',
    value: 'Lençóis Paulista / SP',
    sub: 'Atendimento presencial com hora marcada',
    href: 'https://maps.google.com/?q=Lençóis+Paulista+SP',
    label: 'Ver no mapa',
    btnClass: 'bg-amber-500 text-white hover:bg-amber-600',
    external: true,
  },
]

function ContactCard({ card, index }: { card: typeof cards[0]; index: number }) {
  const Icon  = card.icon
  const ref   = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      variants={scaleUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.12 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`bg-white rounded-3xl border border-ink-200 ${card.border} p-7 flex flex-col gap-5 shadow-card transition-all duration-300`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color}`}>
        <Icon size={26} strokeWidth={1.8} />
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1">{card.title}</p>
        <p className="text-xl font-bold text-ink-900">{card.value}</p>
        <p className="text-sm text-ink-500 mt-1">{card.sub}</p>
      </div>

      <a
        href={card.href}
        {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm active:scale-95 transition-all ${card.btnClass}`}
      >
        {card.label}
      </a>
    </motion.div>
  )
}

export default function Agendamento() {
  const headerRef = useRef(null)
  const inView    = useInView(headerRef, { once: true, margin: '-60px' })

  return (
    <section id="agendamento" className="py-24 bg-ink-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          ref={headerRef}
          variants={stagger(0.1)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-14 flex flex-col items-center gap-4"
        >
          <motion.span variants={fadeUp} className="px-4 py-1.5 rounded-full bg-brand-primarySoft text-brand-primaryDark text-sm font-semibold">
            Agendamento
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">
            Agende a consulta do seu pet{' '}
            <span className="gradient-text">com facilidade</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-500 text-lg max-w-xl">
            Entre em contato pelo canal de sua preferência — respondemos rápido e marcamos no melhor horário para você.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <ContactCard key={c.title} card={c} index={i} />
          ))}
        </div>

        {/* Banner de horários */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-white rounded-3xl border border-ink-200 p-7 flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-primarySoft text-brand-primaryDark flex items-center justify-center flex-shrink-0">
            <Clock size={24} strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-ink-900 text-lg">Horários de atendimento</p>
            <p className="text-ink-500 text-sm mt-0.5">
              Segunda a Sexta: 08h às 12h · 13h30 às 18h &nbsp;|&nbsp; Sábado: 08h às 12h
            </p>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-6 py-3 rounded-2xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-primaryDark active:scale-95 transition-all"
          >
            Agendar pelo WhatsApp
          </a>
        </motion.div>

      </div>
    </section>
  )
}
