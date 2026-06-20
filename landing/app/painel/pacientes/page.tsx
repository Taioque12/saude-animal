'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Search, Plus, X, FileText, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PetRow {
  id: string; nome: string; especie: string; raca: string | null
  porte: string | null; nascimento: string | null; tutor_id: string
  alergias: string | null; condicoes: string | null
  tutores: { nome: string } | null
}
interface TutorOpc { id: string; nome: string }

const VAZIO: Partial<PetRow> = { nome: '', especie: '', raca: '', porte: '', nascimento: '', tutor_id: '', alergias: '', condicoes: '' }
const ESPECIES: Record<string, string> = { Canino: '🐶', Felino: '🐱', Ave: '🐦', Roedor: '🐹', Réptil: '🦎', Outro: '🐾' }

function idade(nascimento: string | null): string {
  if (!nascimento) return '—'
  const n = new Date(nascimento), h = new Date()
  let anos = h.getFullYear() - n.getFullYear()
  if (h.getMonth() < n.getMonth() || (h.getMonth() === n.getMonth() && h.getDate() < n.getDate())) anos--
  return anos <= 0 ? 'menos de 1 ano' : `${anos} ${anos === 1 ? 'ano' : 'anos'}`
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="page-enter mb-4">
      <label className="block text-sm font-semibold text-[#14302b] mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-[#d4e0da] text-[#14302b] text-sm outline-none focus:border-[#13a89e] transition-colors bg-white'

export default function Pacientes() {
  const [pets, setPets] = useState<PetRow[]>([])
  const [tutoresOpc, setTutoresOpc] = useState<TutorOpc[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Partial<PetRow>>(VAZIO)
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    const [p, t] = await Promise.all([
      supabase.from('pets').select('id, nome, especie, raca, porte, nascimento, tutor_id, alergias, condicoes, tutores(nome)').order('nome'),
      supabase.from('tutores').select('id, nome').order('nome'),
    ])
    setPets((p.data as unknown as PetRow[]) ?? [])
    setTutoresOpc((t.data as TutorOpc[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { carregar() }, [])

  const set = (campo: keyof PetRow, valor: string) => setForm(f => ({ ...f, [campo]: valor }))

  async function salvar(e: FormEvent) {
    e.preventDefault()
    if (!form.nome?.trim()) { alert('Informe o nome do pet.'); return }
    if (!form.tutor_id) { alert('Selecione o tutor.'); return }
    if (!form.especie) { alert('Selecione a espécie.'); return }
    setSalvando(true)
    const dados = { nome: form.nome, especie: form.especie, raca: form.raca, porte: form.porte || null, nascimento: form.nascimento || null, tutor_id: form.tutor_id, alergias: form.alergias, condicoes: form.condicoes }
    const resp = form.id ? await supabase.from('pets').update(dados).eq('id', form.id) : await supabase.from('pets').insert(dados)
    setSalvando(false)
    if (resp.error) { alert('Erro: ' + resp.error.message); return }
    setModal(false); carregar()
  }

  async function excluir(p: PetRow) {
    if (!confirm(`Excluir ${p.nome}?`)) return
    const { error } = await supabase.from('pets').delete().eq('id', p.id)
    if (error) alert('Erro: ' + error.message)
    else carregar()
  }

  const filtrados = pets.filter(p => {
    const t = busca.toLowerCase()
    return p.nome.toLowerCase().includes(t) || (p.raca ?? '').toLowerCase().includes(t) || (p.tutores?.nome ?? '').toLowerCase().includes(t)
  })

  return (
    <div className="page-enter max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#14302b]">Pacientes</h1>
        <button onClick={() => { setForm(VAZIO); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13a89e] text-white text-sm font-bold hover:bg-[#0d8d84] transition-colors">
          <Plus size={16} /> Novo paciente
        </button>
      </div>

      {/* Busca */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa89a]" />
        <input
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d4e0da] text-sm outline-none focus:border-[#13a89e] transition-colors bg-white"
          placeholder="Buscar por nome, raça ou tutor..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-[#5f7a6a]">
          <p className="text-4xl mb-3">🐾</p>
          <p>Nenhum paciente encontrado.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4 flex-wrap">
              <div className="w-12 h-12 rounded-xl bg-[#e6f6f5] flex items-center justify-center text-2xl flex-shrink-0">
                {ESPECIES[p.especie] ?? '🐾'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#14302b] flex items-center gap-2 flex-wrap text-sm sm:text-base">
                  {p.nome}
                  {p.porte && <span className="text-[10px] font-semibold bg-[#f0f4f2] text-[#5f7a6a] px-2 py-0.5 rounded">{p.porte}</span>}
                </div>
                <p className="text-xs text-[#5f7a6a] mt-0.5">{p.especie}{p.raca ? ` · ${p.raca}` : ''} · {idade(p.nascimento)}</p>
                <p className="text-xs text-[#5f7a6a]">👤 {p.tutores?.nome ?? '—'}</p>
              </div>
              {p.alergias && (
                <span className="text-xs font-bold bg-[#fdf0e8] text-[#e8743b] border border-[#fdd9b5] px-2.5 py-1 rounded-lg">⚠️ Alergia</span>
              )}
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/painel/pacientes/${p.id}/prontuarios`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors">
                  <FileText size={13} /> Prontuários
                </Link>
                <button onClick={() => { setForm(p); setModal(true) }}
                  className="p-2 rounded-lg border border-[#d4e0da] text-[#5f7a6a] hover:bg-[#f4f7f6] transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => excluir(p)}
                  className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(false)} />
          <div className="modal-panel relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0f2925] to-[#13a89e] rounded-t-3xl">
              <h2 className="text-white font-extrabold">{form.id ? '✏️ Editar paciente' : '🐾 Novo paciente'}</h2>
              <button onClick={() => setModal(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <form onSubmit={salvar}>
                <Campo label="Tutor responsável *">
                  <select className={inp} value={form.tutor_id ?? ''} onChange={e => set('tutor_id', e.target.value)}>
                    <option value="">Selecione o tutor...</option>
                    {tutoresOpc.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </Campo>
                <Campo label="Nome do pet *">
                  <input className={inp} value={form.nome ?? ''} onChange={e => set('nome', e.target.value)} placeholder="Nome do animal" />
                </Campo>
                <Campo label="Espécie *">
                  <select className={inp} value={form.especie ?? ''} onChange={e => set('especie', e.target.value)}>
                    <option value="">Selecione a espécie...</option>
                    {Object.keys(ESPECIES).map(x => <option key={x} value={x}>{ESPECIES[x]} {x}</option>)}
                  </select>
                </Campo>
                <Campo label="Raça">
                  <input className={inp} value={form.raca ?? ''} onChange={e => set('raca', e.target.value)} placeholder="Ex.: Dachshund, SRD" />
                </Campo>
                <Campo label="Porte">
                  <select className={inp} value={form.porte ?? ''} onChange={e => set('porte', e.target.value)}>
                    <option value="">Selecione...</option>
                    {['Pequeno', 'Médio', 'Grande', 'Gigante'].map(x => <option key={x} value={x}>{x}</option>)}
                  </select>
                </Campo>
                <Campo label="Data de nascimento">
                  <input className={inp} type="date" value={form.nascimento ?? ''} onChange={e => set('nascimento', e.target.value)} />
                </Campo>
                <Campo label="Alergias">
                  <textarea className={inp + ' resize-y min-h-[72px]'} value={form.alergias ?? ''} onChange={e => set('alergias', e.target.value)} placeholder="Vital para medicação e shampoos" />
                </Campo>
                <Campo label="Condições preexistentes">
                  <textarea className={inp + ' resize-y min-h-[72px]'} value={form.condicoes ?? ''} onChange={e => set('condicoes', e.target.value)} placeholder="Doenças, cirurgias anteriores..." />
                </Campo>
                <button type="submit" disabled={salvando}
                  className="w-full py-3 rounded-xl bg-[#13a89e] hover:bg-[#0d8d84] text-white font-bold transition-colors disabled:opacity-60 mt-2">
                  {salvando ? 'Salvando...' : 'Salvar paciente'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
