'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Search, Plus, X, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface VacinaRow {
  id: string; pet_nome: string; tutor_nome: string; tutor_telefone: string | null
  vacina: string; data_aplicacao: string; proxima_dose: string | null; observacao: string | null
}

const VAZIO: Partial<VacinaRow> = { pet_nome: '', tutor_nome: '', tutor_telefone: '', vacina: '', data_aplicacao: '', proxima_dose: '', observacao: '' }
const VACINAS_COMUNS = ['V8 (Óctupla)', 'V10 (Déctupla)', 'Antirrábica', 'Gripe canina', 'Giárdia', 'Leishmaniose', 'V3 (Felina)', 'V4 (Felina)', 'V5 (Felina)']
type StatusKey = 'atrasada' | 'breve' | 'emdia' | 'sem'

function statusDose(proxima: string | null): { label: string; cor: string; bg: string; key: StatusKey } {
  if (!proxima) return { label: 'Sem próxima dose', cor: '#8fa89a', bg: '#f0f4f2', key: 'sem' }
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const p = new Date(proxima + 'T00:00:00')
  const dias = Math.round((p.getTime() - hoje.getTime()) / 86400000)
  if (dias <= 0) return { label: `Atrasada há ${Math.abs(dias)}d`, cor: '#d64545', bg: '#fef2f2', key: 'atrasada' }
  if (dias <= 30) return { label: `Em ${dias}d`, cor: '#e8743b', bg: '#fdf0e8', key: 'breve' }
  return { label: 'Em dia', cor: '#13a89e', bg: '#e6f6f5', key: 'emdia' }
}

const dataBR = (iso: string | null) => iso ? iso.split('-').reverse().join('/') : '—'

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="page-enter mb-4">
      <label className="block text-sm font-semibold text-[#14302b] mb-1.5">{label}</label>
      {children}
    </div>
  )
}
const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-[#d4e0da] text-[#14302b] text-sm outline-none focus:border-[#13a89e] transition-colors bg-white'
const FILTROS: { chave: StatusKey | 'todas'; rotulo: string }[] = [
  { chave: 'todas', rotulo: '💉 Todas' },
  { chave: 'atrasada', rotulo: '🔴 Atrasadas' },
  { chave: 'breve', rotulo: '🟡 Em breve' },
  { chave: 'emdia', rotulo: '🟢 Em dia' },
]

export default function Vacinas() {
  const [vacinas, setVacinas] = useState<VacinaRow[]>([])
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<StatusKey | 'todas'>('todas')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Partial<VacinaRow>>(VAZIO)
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    const { data } = await supabase.from('vacinas').select('*').order('proxima_dose', { ascending: true, nullsFirst: false })
    setVacinas((data as VacinaRow[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { carregar() }, [])

  const set = (campo: keyof VacinaRow, valor: string) => setForm(f => ({ ...f, [campo]: valor }))

  async function salvar(e: FormEvent) {
    e.preventDefault()
    if (!form.pet_nome?.trim()) { alert('Informe o nome do pet.'); return }
    if (!form.tutor_nome?.trim()) { alert('Informe o nome do tutor.'); return }
    if (!form.vacina?.trim()) { alert('Informe a vacina.'); return }
    if (!form.data_aplicacao) { alert('Informe a data de aplicação.'); return }
    setSalvando(true)
    const dados = { pet_nome: form.pet_nome, tutor_nome: form.tutor_nome, tutor_telefone: form.tutor_telefone || null, vacina: form.vacina, data_aplicacao: form.data_aplicacao, proxima_dose: form.proxima_dose || null, observacao: form.observacao || null }
    const resp = form.id ? await supabase.from('vacinas').update(dados).eq('id', form.id) : await supabase.from('vacinas').insert(dados)
    setSalvando(false)
    if (resp.error) { alert('Erro: ' + resp.error.message); return }
    setModal(false); carregar()
  }

  async function excluir(v: VacinaRow) {
    if (!confirm(`Excluir ${v.vacina} de ${v.pet_nome}?`)) return
    const { error } = await supabase.from('vacinas').delete().eq('id', v.id)
    if (error) alert('Erro: ' + error.message)
    else carregar()
  }

  const totalAtrasadas = vacinas.filter(v => statusDose(v.proxima_dose).key === 'atrasada').length
  const totalBreve = vacinas.filter(v => statusDose(v.proxima_dose).key === 'breve').length

  const filtradas = vacinas.filter(v => {
    const t = busca.toLowerCase()
    const casaBusca = v.pet_nome.toLowerCase().includes(t) || v.tutor_nome.toLowerCase().includes(t) || v.vacina.toLowerCase().includes(t)
    const casaFiltro = filtro === 'todas' || statusDose(v.proxima_dose).key === filtro
    return casaBusca && casaFiltro
  })

  return (
    <div className="page-enter max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#14302b]">Vacinas</h1>
        <button onClick={() => { setForm(VAZIO); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13a89e] text-white text-sm font-bold hover:bg-[#0d8d84] transition-colors">
          <Plus size={16} /> Nova vacina
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { r: 'Total', v: vacinas.length, cor: '#14302b', em: '💉' },
          { r: 'Atrasadas', v: totalAtrasadas, cor: '#d64545', em: '🔴' },
          { r: 'Em breve', v: totalBreve, cor: '#e8743b', em: '🟡' },
        ].map(c => (
          <div key={c.r} className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-xl mb-1">{c.em}</p>
            <p className="text-2xl font-extrabold leading-none" style={{ color: c.cor }}>{c.v}</p>
            <p className="text-xs text-[#5f7a6a] mt-1">{c.r}</p>
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa89a]" />
        <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d4e0da] text-sm outline-none focus:border-[#13a89e] bg-white"
          placeholder="Buscar por pet, tutor ou vacina..." value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTROS.map(f => (
          <button key={f.chave} onClick={() => setFiltro(f.chave)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filtro === f.chave ? 'bg-[#13a89e] text-white' : 'bg-white text-[#5f7a6a]'}`}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
            {f.rotulo}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" />
        </div>
      ) : filtradas.length === 0 ? (
        <div className="text-center py-16 text-[#5f7a6a]"><p className="text-4xl mb-3">💉</p><p>Nenhuma vacina encontrada.</p></div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtradas.map(v => {
            const st = statusDose(v.proxima_dose)
            return (
              <div key={v.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4 flex-wrap"
                style={{ borderLeft: `4px solid ${st.cor}` }}>
                <div className="w-12 h-12 rounded-xl bg-[#e6f6f5] flex items-center justify-center text-2xl flex-shrink-0">💉</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#14302b] text-sm flex items-center gap-2 flex-wrap">
                    {v.pet_nome}
                    <span className="text-[10px] font-semibold bg-[#f0f4f2] text-[#5f7a6a] px-2 py-0.5 rounded">{v.vacina}</span>
                  </div>
                  <p className="text-xs text-[#5f7a6a] mt-0.5">👤 {v.tutor_nome}{v.tutor_telefone ? ` · 📱 ${v.tutor_telefone}` : ''}</p>
                  <p className="text-xs text-[#5f7a6a]">
                    Última: <strong className="text-[#14302b]">{dataBR(v.data_aplicacao)}</strong>
                    {' · '}Próxima: <strong className="text-[#14302b]">{dataBR(v.proxima_dose)}</strong>
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-lg flex-shrink-0" style={{ background: st.bg, color: st.cor }}>{st.label}</span>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setForm(v); setModal(true) }} className="p-2 rounded-lg border border-[#d4e0da] text-[#5f7a6a] hover:bg-[#f4f7f6] transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => excluir(v)} className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(false)} />
          <div className="modal-panel relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0f2925] to-[#13a89e] rounded-t-3xl">
              <h2 className="text-white font-extrabold">{form.id ? '✏️ Editar vacina' : '💉 Nova vacina'}</h2>
              <button onClick={() => setModal(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6">
              <form onSubmit={salvar}>
                <Campo label="Nome do pet *"><input className={inp} value={form.pet_nome ?? ''} onChange={e => set('pet_nome', e.target.value)} placeholder="Nome do animal" /></Campo>
                <Campo label="Nome do tutor *"><input className={inp} value={form.tutor_nome ?? ''} onChange={e => set('tutor_nome', e.target.value)} placeholder="Responsável pelo pet" /></Campo>
                <Campo label="Telefone"><input className={inp} value={form.tutor_telefone ?? ''} onChange={e => set('tutor_telefone', e.target.value)} placeholder="(14) 99999-9999" /></Campo>
                <Campo label="Vacina aplicada *">
                  <input className={inp} list="vacinas-comuns" value={form.vacina ?? ''} onChange={e => set('vacina', e.target.value)} placeholder="Ex.: V10, Antirrábica..." />
                  <datalist id="vacinas-comuns">{VACINAS_COMUNS.map(x => <option key={x} value={x} />)}</datalist>
                </Campo>
                <Campo label="Data de aplicação *"><input className={inp} type="date" value={form.data_aplicacao ?? ''} onChange={e => set('data_aplicacao', e.target.value)} /></Campo>
                <Campo label="Próxima dose"><input className={inp} type="date" value={form.proxima_dose ?? ''} onChange={e => set('proxima_dose', e.target.value)} /></Campo>
                <Campo label="Observações"><textarea className={inp + ' resize-y min-h-[68px]'} value={form.observacao ?? ''} onChange={e => set('observacao', e.target.value)} placeholder="Lote, reações..." /></Campo>
                <button type="submit" disabled={salvando} className="w-full py-3 rounded-xl bg-[#13a89e] hover:bg-[#0d8d84] text-white font-bold transition-colors disabled:opacity-60 mt-2">
                  {salvando ? 'Salvando...' : 'Salvar vacina'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
