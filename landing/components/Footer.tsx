'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react'

const navLinks = [
  { href: '#servicos',    label: 'Serviços'    },
  { href: '#sobre',       label: 'Sobre Nós'   },
  { href: '#identidade',  label: 'Identidade'  },
  { href: '#agendamento', label: 'Agendamento' },
  { href: '/login',       label: 'Área Restrita' },
]

const services = [
  'Consultas & Exames',
  'Banho & Tosa',
  'Vacinação',
  'Cirurgias',
  'Internação',
  'Emergências',
]

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white">
      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="gradient-bg py-14 px-4"
      >
        <div className="mx-auto max-w-3xl text-center flex flex-col items-center gap-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-balance">
            Agende agora e garanta o melhor cuidado para seu pet
          </h2>
          <p className="text-white/80">
            Atendimento presencial em Lençóis Paulista/SP · Seg–Sex 08h–18h · Sáb 08h–12h
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              id="agendamento"
              href="tel:+5514999999999"
              className="px-6 py-3 rounded-2xl bg-white text-brand-primaryDark font-bold text-sm hover:bg-brand-primarySoft active:scale-95 transition-all"
            >
              Ligar agora
            </a>
            <a
              href="https://wa.me/5514999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-white/20 border border-white/40 text-white font-bold text-sm hover:bg-white/30 active:scale-95 transition-all"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </motion.div>

      {/* Corpo do footer */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Marca */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <a href="#">
            <div className="inline-block bg-white rounded-xl px-4 py-2.5">
              <img src="/logo.png" alt="Saúde Animal" className="h-10 w-auto" />
            </div>
          </a>
          <p className="text-ink-400 text-sm leading-relaxed">
            Cuidado veterinário especializado em Lençóis Paulista/SP. Fundada pelo Dr. Ighor Morales.
          </p>
          <div className="flex gap-3 mt-1">
            {[
              { icon: Instagram, label: 'Instagram', href: '#' },
              { icon: Facebook,  label: 'Facebook',  href: '#' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-ink-400 hover:bg-brand-primary hover:text-white transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4">Menu</h4>
          <ul className="flex flex-col gap-2.5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-ink-400 text-sm hover:text-brand-primary transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Serviços */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4">Serviços</h4>
          <ul className="flex flex-col gap-2.5">
            {services.map((s) => (
              <li key={s} className="text-ink-400 text-sm">{s}</li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4">Contato</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-3">
              <MapPin size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
              <span className="text-ink-400 text-sm">
                R. Rio Grande do Sul — Jardim Cruzeiro<br />
                Lençóis Paulista / SP · CEP 18680-550
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
              <a href="tel:+551432647135" className="text-ink-400 text-sm hover:text-brand-primary transition-colors">
                (14) 3264-7135
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
              <span className="text-ink-400 text-sm">
                Seg–Sex: 08h–12h · 13h30–18h<br />Sáb: 08h–12h
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Base */}
      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-500">
          <p>CNPJ: 12.624.267/0001-39 · Cia Pet Clínica Veterinária Ltda.</p>
          <p>© {new Date().getFullYear()} Cia Pet. Todos os direitos reservados. · Dr. Ighor Morales · CRMV-SP 00000</p>
        </div>
      </div>
    </footer>
  )
}
