'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const dataBR = (iso: string) => iso.split('-').reverse().join('/')

interface Agendamento {
  id: string; pet_nome: string; tutor_nome: string; tutor_telefone: string
  setor: string; data: string; turno: string; status: string
}

const STATUS_CFG: Record<string, { cor: string; bg: string; border: string; emoji: string }> = {
  Pendente:   { cor: '#e8743b', bg: '#fdf0e8', border: '#fdd9b5', emoji: '⏳' },
  Confirmado: { cor: '#13a89e', bg: '#e6f6f5', border: '#b2e0dc', emoji: '✅' },
  Cancelado:  { cor: '#d64545', bg: '#fef2f2', border: '#fca5a5', emoji: '✖️' },
}
const FILTROS = ['Todos', 'Pendente', 'Confirmado', 'Cancelado']

export default function Agendamentos() {
  const [lista, setLista] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('Todos')

  async function carregar() {
    const { data } = await supabase.from('agendamentos').select('*').order('data', { ascending: false })
    setLista((data as Agendamento[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { carregar() }, [])

  async function mudarStatus(a: Agendamento, status: string) {
    await supabase.from('agendamentos').update({ status }).eq('id', a.id)
    carregar()
  }

  const filtrados = filtro === 'Todos' ? lista : lista.filter(a => a.status === filtro)
  const counts = {
    Todos: lista.length,
    Pendente: lista.filter(a => a.status === 'Pendente').length,
    Confirmado: lista.filter(a => a.status === 'Confirmado').length,
    Cancelado: lista.filter(a => a.status === 'Cancelado').length,
  }

  return (
    <div className="page-enter max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[#14302b] mb-6">Agendamentos</h1>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTROS.map(f => {
          const cfg = STATUS_CFG[f]
          const ativo = filtro === f
          return (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: ativo ? (cfg?.cor ?? '#14302b') : 'white',
                color: ativo ? '#fff' : '#5f7a6a',
                boxShadow: '0 2px 8px rgba(0,0,0,.06)',
              }}
            >
              {cfg?.emoji} {f}
              <span
                className="px-1.5 py-0.5 rounded-full text-[11px] font-bold"
                style={{ background: ativo ? 'rgba(255,255,255,.25)' : '#f0f4f2', color: ativo ? '#fff' : '#14302b' }}
              >
                {counts[f as keyof typeof counts]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-[#5f7a6a]">
          <p className="text-4xl mb-3">📭</p>
          <p>Nenhum agendamento nesta categoria.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map(a => {
            const cfg = STATUS_CFG[a.status] ?? STATUS_CFG['Pendente']
            return (
              <div key={a.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4 flex-wrap">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${a.setor === 'Clínica Veterinária' ? 'bg-blue-50' : 'bg-[#e6f6f5]'}`}>
                  {a.setor === 'Clínica Veterinária' ? '🏥' : '✂️'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#14302b] flex items-center gap-2 flex-wrap text-sm sm:text-base">
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

                <span
                  className="text-xs font-bold px-3 py-1 rounded-lg flex-shrink-0"
                  style={{ background: cfg.bg, color: cfg.cor, border: `1px solid ${cfg.border}` }}
                >
                  {cfg.emoji} {a.status}
                </span>

                <div className="flex gap-2 flex-shrink-0">
                  {a.status === 'Pendente' && (
                    <button onClick={() => mudarStatus(a, 'Confirmado')}
                      className="px-3 py-1.5 rounded-lg bg-[#13a89e] text-white text-xs font-bold hover:bg-[#0d8d84] transition-colors">
                      Confirmar
                    </button>
                  )}
                  {a.status !== 'Cancelado' && (
                    <button onClick={() => mudarStatus(a, 'Cancelado')}
                      className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors">
                      Cancelar
                    </button>
                  )}
                  {a.status === 'Cancelado' && (
                    <button onClick={() => mudarStatus(a, 'Pendente')}
                      className="px-3 py-1.5 rounded-lg border border-[#d4e0da] text-[#5f7a6a] text-xs font-bold hover:bg-[#f4f7f6] transition-colors">
                      Reabrir
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
