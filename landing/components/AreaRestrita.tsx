'use client'

import { motion } from 'framer-motion'
import { Lock, LayoutDashboard, ClipboardList, Users, Package, TrendingUp, ArrowRight } from 'lucide-react'
import { fadeUp, stagger, scaleUp } from '@/lib/motion'

const modulos = [
  { icon: LayoutDashboard, label: 'Dashboard',     desc: 'Visão geral do dia'         },
  { icon: ClipboardList,   label: 'Agendamentos',  desc: 'Gestão de consultas'        },
  { icon: Users,           label: 'Pacientes',     desc: 'Fichas e prontuários'       },
  { icon: Package,         label: 'Estoque',       desc: 'Insumos e medicamentos'     },
  { icon: TrendingUp,      label: 'Financeiro',    desc: 'Caixa por setor'            },
  { icon: Users,           label: 'Tutores',       desc: 'Cadastro de responsáveis'   },
]

export default function AreaRestrita() {
  return (
    <section id="area-restrita" className="py-24 bg-ink-900 overflow-hidden relative">

      {/* Decoração de fundo */}
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none"
      />
      <motion.div
        aria-hidden
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/10 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Texto */}
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-6"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-sm font-semibold border border-white/10"
            >
              <Lock size={13} />
              Exclusivo para a equipe
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold text-white leading-tight text-balance"
            >
              Painel interno{' '}
              <span className="gradient-text">Cia Pet</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-white/60 leading-relaxed text-base">
              Sistema completo de gestão veterinária — acesso exclusivo para veterinários e colaboradores
              da Cia Pet. Gerencie agendamentos, prontuários, estoque e financeiro em um só lugar.
            </motion.p>

            <motion.ul variants={stagger(0.06)} className="flex flex-col gap-2.5">
              {[
                'Prontuário digital de cada paciente',
                'Controle financeiro por setor (Clínica e Banho & Tosa)',
                'Gestão de insumos e medicamentos',
                'Agendamentos em tempo real',
              ].map((item) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  className="flex items-center gap-3 text-white/70 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-primaryDark active:scale-95 transition-all shadow-glow"
              >
                <Lock size={16} />
                Acessar área restrita
                <ArrowRight size={16} />
              </a>
            </motion.div>
          </motion.div>

          {/* Grid de módulos */}
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {modulos.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                variants={scaleUp}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 cursor-default hover:bg-white/10 hover:border-brand-primary/40 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                  <Icon size={20} className="text-brand-primary" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
