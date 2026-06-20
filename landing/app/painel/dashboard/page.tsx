'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, PawPrint, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const hojeISO = () => new Date().toISOString().slice(0, 10)
const dataBR = (iso: string) => iso.split('-').reverse().join('/')
const diaSemana = () => new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

interface Agendamento {
  id: string; pet_nome: string; tutor_nome: string; tutor_telefone: string
  setor: string; data: string; turno: string; status: string
}

const CARDS = [
  { key: 'hoje',      label: 'Confirmados hoje',      icon: CheckCircle2, cor: '#13a89e', bg: '#e6f6f5' },
  { key: 'pendentes', label: 'Agendamentos pendentes', icon: Clock,        cor: '#e8743b', bg: '#fdf0e8' },
  { key: 'pets',      label: 'Pacientes cadastrados',  icon: PawPrint,     cor: '#3b82f6', bg: '#eff6ff' },
  { key: 'tutores',   label: 'Tutores cadastrados',    icon: Users,        cor: '#a855f7', bg: '#f5f0ff' },
]

export default function Dashboard() {
  const [stats, setStats] = useState({ tutores: 0, pets: 0, pendentes: 0, hoje: 0 })
  const [pendentes, setPendentes] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const hoje = hojeISO()
      const [t, p, pend, conf, listaPend] = await Promise.all([
        supabase.from('tutores').select('*', { count: 'exact', head: true }),
        supabase.from('pets').select('*', { count: 'exact', head: true }),
        supabase.from('agendamentos').select('*', { count: 'exact', head: true }).eq('status', 'Pendente'),
        supabase.from('agendamentos').select('*', { count: 'exact', head: true }).eq('status', 'Confirmado').eq('data', hoje),
        supabase.from('agendamentos').select('*').eq('status', 'Pendente').order('data').limit(10),
      ])
      setStats({ tutores: t.count ?? 0, pets: p.count ?? 0, pendentes: pend.count ?? 0, hoje: conf.count ?? 0 })
      setPendentes((listaPend.data as Agendamento[]) ?? [])
      setLoading(false)
    })()
  }, [])

  return (
    <div className="page-enter max-w-5xl mx-auto">
      {/* Boas-vindas */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0f2925] to-[#13a89e] p-6 sm:p-8 mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-white/60 text-sm capitalize mb-1">{diaSemana()}</p>
          <h1 className="text-white font-extrabold text-xl sm:text-2xl">Bem-vindo ao painel da Cia Pet 🐾</h1>
          <p className="text-white/60 text-sm mt-1">Gerencie agendamentos, pacientes, estoque e financeiro.</p>
        </div>
        <span className="text-5xl opacity-20 hidden sm:block">🏥</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {CARDS.map((c) => {
          const Icon = c.icon
          const val = stats[c.key as keyof typeof stats]
          return (
            <div key={c.key} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                <Icon size={22} style={{ color: c.cor }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none" style={{ color: c.cor }}>
                  {loading ? '—' : val}
                </p>
                <p className="text-xs text-[#5f7a6a] mt-1 leading-tight">{c.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lista pendentes */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8f0ec]">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#e8743b]" />
            <h2 className="font-bold text-[#14302b]">Agendamentos pendentes</h2>
          </div>
          {pendentes.length > 0 && (
            <span className="text-xs font-bold bg-[#fdf0e8] text-[#e8743b] px-3 py-1 rounded-full">
              {pendentes.length} pendente{pendentes.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" />
          </div>
        ) : pendentes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">✅</p>
            <p className="text-[#5f7a6a] font-medium">Nenhuma pendência. Tudo em dia!</p>
          </div>
        ) : (
          <div>
            {pendentes.map((a, i) => (
              <div key={a.id} className={`flex items-center gap-4 px-6 py-4 flex-wrap ${i < pendentes.length - 1 ? 'border-b border-[#f0f4f2]' : ''}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${a.setor === 'Clínica Veterinária' ? 'bg-blue-50' : 'bg-[#e6f6f5]'}`}>
                  {a.setor === 'Clínica Veterinária' ? '🏥' : '✂️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#14302b] text-sm flex items-center gap-2 flex-wrap">
                    {a.pet_nome}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${a.setor === 'Clínica Veterinária' ? 'bg-blue-50 text-blue-600' : 'bg-[#e6f6f5] text-[#13a89e]'}`}>
                      {a.setor}
                    </span>
                  </div>
                  <p className="text-xs text-[#5f7a6a] mt-0.5">👤 {a.tutor_nome} · 📞 {a.tutor_telefone}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-[#14302b] text-sm">{dataBR(a.data)}</p>
                  <p className="text-xs text-[#5f7a6a]">{a.turno}</p>
                </div>
                <span className="text-xs font-bold bg-[#fdf0e8] text-[#e8743b] border border-[#fdd9b5] px-3 py-1 rounded-lg flex-shrink-0">
                  ⏳ Pendente
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
