'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { fadeUp, stagger } from '@/lib/motion'

const faqs = [
  {
    q: 'Quais espécies a clínica atende?',
    a: 'Atendemos cães e gatos de todas as raças e idades, desde filhotes até animais seniores. Para outras espécies, entre em contato para verificar disponibilidade.',
  },
  {
    q: 'Preciso de agendamento para consultas?',
    a: 'Recomendamos agendar pelo nosso site ou WhatsApp para garantir seu horário. Em casos de urgência, atendemos sem agendamento prévio, sujeito à disponibilidade.',
  },
  {
    q: 'O que inclui o serviço de banho e tosa?',
    a: 'Banho completo com shampoo dermatológico, secagem, escovação, limpeza de ouvidos, corte de unhas e, se incluído, tosa higiênica ou de raça. Tudo com produtos de alta qualidade.',
  },
  {
    q: 'Como funciona o plano mensal Premium?',
    a: 'O plano Premium inclui consultas ilimitadas, um banho e tosa por mês, exames de rotina básicos e 20% de desconto em exames complementares. O pagamento é mensal, sem fidelidade.',
  },
  {
    q: 'A clínica realiza cirurgias?',
    a: 'Sim! Contamos com centro cirúrgico equipado para cirurgias eletivas (castração, nodulectomia, entre outras) e de urgência. Todas realizadas pelo Dr. Ighor Morales com anestesia monitorada.',
  },
  {
    q: 'Vocês têm serviço de internação?',
    a: 'Sim. Nossa UTI veterinária oferece monitoramento constante para pets em pós-operatório ou que precisem de cuidados intensivos. Enviamos atualizações para os tutores regularmente.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Aceitamos dinheiro, Pix, cartões de débito e crédito (em até 6x sem juros). Para planos mensais, o pagamento é via cartão de crédito com recorrência automática.',
  },
]

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className="border border-ink-200 rounded-2xl overflow-hidden bg-white shadow-sm"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-ink-100 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-ink-900 text-sm sm:text-base">{faq.q}</span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-brand-primary text-white' : 'bg-ink-100 text-ink-500'}`}>
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-ink-500 text-sm leading-relaxed border-t border-ink-100 pt-4">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-ink-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-12 flex flex-col items-center gap-4"
        >
          <motion.span variants={fadeUp} className="px-4 py-1.5 rounded-full bg-brand-primarySoft text-brand-primaryDark text-sm font-semibold">
            Dúvidas frequentes
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">
            Ainda tem dúvidas?{' '}
            <span className="gradient-text">A gente responde</span>
          </motion.h2>
        </motion.div>

        {/* Perguntas */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>

        {/* CTA extra */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center p-8 bg-white border border-ink-200 rounded-3xl shadow-card"
        >
          <p className="font-bold text-ink-900 text-lg mb-1">Não encontrou sua resposta?</p>
          <p className="text-ink-500 text-sm mb-5">Nossa equipe está pronta para ajudar via WhatsApp.</p>
          <a
            href="https://wa.me/5514999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 active:scale-95 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.522 5.849L.057 23.887l6.198-1.625A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.806 9.806 0 01-4.99-1.365l-.358-.214-3.678.964.981-3.587-.234-.369A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            Falar no WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
