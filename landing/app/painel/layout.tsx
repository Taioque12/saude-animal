'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, CalendarDays, PawPrint, Users, Syringe,
  Package, TrendingUp, UserCog, LogOut, Menu, X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

const NAV = [
  { href: '/painel/dashboard',    icon: LayoutDashboard, label: 'Dashboard'      },
  { href: '/painel/agendamentos', icon: CalendarDays,    label: 'Agendamentos'   },
  { href: '/painel/pacientes',    icon: PawPrint,        label: 'Pacientes'      },
  { href: '/painel/tutores',      icon: Users,           label: 'Tutores'        },
  { href: '/painel/vacinas',      icon: Syringe,         label: 'Vacinas'        },
  { href: '/painel/estoque',      icon: Package,         label: 'Estoque'        },
  { href: '/painel/financeiro',   icon: TrendingUp,      label: 'Financeiro'     },
  { href: '/painel/usuarios',     icon: UserCog,         label: 'Usuários'       },
]

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !session) router.replace('/login')
  }, [session, loading, router])

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" style={{ borderWidth: 3 }} />
          <p className="text-sm text-[#5f7a6a]">Carregando painel...</p>
        </div>
      </div>
    )
  }

  async function sair() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={mobile
      ? 'flex flex-col w-64 h-full bg-[#0f2925] text-white'
      : 'hidden lg:flex flex-col w-64 min-h-screen bg-[#0f2925] text-white fixed top-0 left-0 z-30'
    }>
      {/* Logo */}
      <div className="flex items-center justify-center px-5 py-4 border-b border-white/10">
        <div className="bg-white rounded-xl px-4 py-2.5">
          <img src="/logo.png" alt="Saúde Animal" className="h-9 w-auto" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[#13a89e] text-white shadow-[0_4px_12px_rgba(19,168,158,.4)]'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-white/10">
        <div className="px-2 mb-3">
          <p className="text-xs text-white/40 truncate">{session.user.email}</p>
        </div>
        <button
          onClick={sair}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-[#f4f7f6]">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer mobile */}
      <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-200 ease-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar mobile />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-[#e8f0ec] sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-[#f4f7f6]">
            <Menu size={20} className="text-[#14302b]" />
          </button>
          <div className="flex items-center">
            <img src="/logo.png" alt="Saúde Animal" className="h-8 w-auto" />
          </div>
          <div className="w-8" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
