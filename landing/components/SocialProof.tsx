'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { fadeUp, stagger, scaleUp } from '@/lib/motion'

const testimonials = [
  {
    name: 'Ana Souza',
    role: 'Tutora do Thor (Labrador)',
    stars: 5,
    text: 'O Dr. Ighor é incrível! Muito atencioso com o Thor e sempre explica tudo com detalhes. A equipe inteira é super carinhosa. Nunca mais levo meu cachorro em outro lugar.',
    avatar: 'AS',
    bg: 'bg-brand-primarySoft',
    color: 'text-brand-primaryDark',
  },
  {
    name: 'Carlos Lima',
    role: 'Tutor da Mel (Poodle)',
    stars: 5,
    text: 'Serviço de banho e tosa impecável! A Mel sempre sai cheirosa e feliz. O ambiente é limpo, tranquilo e o atendimento é muito profissional. Super recomendo!',
    avatar: 'CL',
    bg: 'bg-brand-accentSoft',
    color: 'text-brand-accentDark',
  },
  {
    name: 'Marina Costa',
    role: 'Tutora do Bob (Gato Persa)',
    stars: 5,
    text: 'Meu gato é super estressado em clínicas, mas na Cia Pet ele ficou tranquilo! A equipe sabe lidar com felinos. A cirurgia foi um sucesso e a recuperação perfeita.',
    avatar: 'MC',
    bg: 'bg-purple-50',
    color: 'text-purple-700',
  },
  {
    name: 'Pedro Alves',
    role: 'Tutor da Nina (Shih-tzu)',
    stars: 5,
    text: 'Estou há 3 anos na Cia Pet e nunca me decepcionaram. Sempre pontuais, preço justo e qualidade excepcional. A Nina é tratada como uma rainha lá!',
    avatar: 'PA',
    bg: 'bg-amber-50',
    color: 'text-amber-700',
  },
  {
    name: 'Juliana Ferreira',
    role: 'Tutora do Rex (Pastor Alemão)',
    stars: 5,
    text: 'Precisei de atendimento de urgência e fui muito bem recebida. O Dr. Ighor agiu rápido e o Rex se recuperou completamente. Sou eternamente grata!',
    avatar: 'JF',
    bg: 'bg-green-50',
    color: 'text-green-700',
  },
  {
    name: 'Roberto Santos',
    role: 'Tutor da Lola (Dachshund)',
    stars: 5,
    text: 'O melhor custo-benefício da cidade! Atendimento humanizado, estrutura moderna e profissionais que realmente amam animais. A Lola fica empolgada quando vê o logo da clínica!',
    avatar: 'RS',
    bg: 'bg-sky-50',
    color: 'text-sky-700',
  },
]

const stats = [
  { value: '1.000+', label: 'Pets atendidos' },
  { value: '5 anos',  label: 'De experiência' },
  { value: '98%',     label: 'Satisfação' },
  { value: '5★',      label: 'Avaliação média' },
]

export default function SocialProof() {
  return (
    <section id="depoimentos" className="py-24 bg-ink-100 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-16 flex flex-col items-center gap-4"
        >
          <motion.span variants={fadeUp} className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
            Depoimentos
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">
            Quem cuida com a gente{' '}
            <span className="gradient-text">nunca para</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-500 text-lg max-w-xl">
            Mais de mil famílias já confiaram o cuidado dos seus pets à Cia Pet.
          </motion.p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
        >
          {stats.map(({ value, label }) => (
            <motion.div
              key={label}
              variants={scaleUp}
              className="bg-white rounded-2xl border border-ink-200 p-5 text-center shadow-card"
            >
              <p className="text-3xl font-extrabold gradient-text mb-1">{value}</p>
              <p className="text-ink-500 text-sm">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Cards de depoimentos */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl border border-ink-200 p-6 flex flex-col gap-4 shadow-card cursor-default"
            >
              {/* Aspas */}
              <Quote size={22} className="text-brand-primary/30" />

              {/* Estrelas */}
              <div className="flex gap-0.5">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Texto */}
              <p className="text-ink-600 text-sm leading-relaxed flex-1">"{t.text}"</p>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-2 border-t border-ink-100">
                <div className={`w-10 h-10 rounded-full ${t.bg} ${t.color} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-ink-900 text-sm">{t.name}</p>
                  <p className="text-ink-400 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-14"
        >
          <p className="text-ink-500 text-base mb-4">
            Junte-se a centenas de tutores que já confiam na Cia Pet
          </p>
          <a
            href="#agendamento"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-base hover:bg-brand-primaryDark active:scale-95 transition-all shadow-md hover:shadow-glow"
          >
            Agendar minha primeira consulta
          </a>
        </motion.div>
      </div>
    </section>
  )
}
