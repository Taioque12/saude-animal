'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Lock } from 'lucide-react'

const links = [
  { href: '#servicos',      label: 'Serviços'    },
  { href: '#sobre',         label: 'Sobre Nós'   },
  { href: '#identidade',    label: 'Identidade'  },
  { href: '#agendamento',   label: 'Agendamento' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1  }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-card border-b border-ink-200'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" aria-label="Saúde Animal — início" className="group flex-shrink-0">
            <img
              src="/logo.png"
              alt="Saúde Animal"
              className="h-14 w-auto group-hover:opacity-90 transition-opacity duration-150"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Menu principal">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-ink-500 hover:text-brand-primary font-medium transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-ink-200 text-ink-600 text-sm font-semibold hover:border-brand-primary hover:text-brand-primary active:scale-95 transition-all"
            >
              <Lock size={13} />
              Área Restrita
            </a>
            <a
              href="#agendamento"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryDark active:scale-95 transition-all shadow-sm"
            >
              Agendar consulta
            </a>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-ink-700 hover:bg-ink-200 transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
            />
            <motion.nav
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col md:hidden"
              aria-label="Menu mobile"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-ink-200">
                <span className="font-bold text-ink-900">Menu</span>
                <button onClick={closeMenu} aria-label="Fechar menu" className="p-1 rounded-lg hover:bg-ink-100">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col p-5 gap-1 flex-1">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={closeMenu}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-3 py-3 rounded-xl text-ink-700 hover:bg-brand-primarySoft hover:text-brand-primary font-medium transition-colors"
                  >
                    {l.label}
                  </motion.a>
                ))}
              </div>
              <div className="p-5 border-t border-ink-200 flex flex-col gap-2">
                <a
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-ink-200 text-ink-700 font-semibold text-sm hover:border-brand-primary hover:text-brand-primary transition-colors"
                >
                  <Lock size={14} />
                  Área Restrita
                </a>
                <a
                  href="#agendamento"
                  onClick={closeMenu}
                  className="flex items-center justify-center w-full py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primaryDark transition-colors"
                >
                  Agendar consulta
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
