'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Search, Plus, X, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Insumo {
  id: string; nome: string; categoria: string; unidade: string
  quantidade: number; minimo: number; validade: string | null; observacao: string | null
}

const CATEGORIAS = ['Medicamentos', 'Vacinas', 'Materiais Cirúrgicos', 'Higiene / Cosméticos', 'Alimentação', 'Administrativo', 'Outros']
const CAT_EMOJI: Record<string, string> = {
  'Medicamentos': '💊', 'Vacinas': '💉', 'Materiais Cirúrgicos': '🔬',
  'Higiene / Cosméticos': '🧴', 'Alimentação': '🍖', 'Administrativo': '📋', 'Outros': '📦',
}
const VAZIO = { nome: '', categoria: '', unidade: '', quantidade: '0', minimo: '0', validade: '', observacao: '' }

function diasParaVencer(validade: string | null): number | null {
  if (!validade) return null
  return Math.ceil((new Date(validade).getTime() - new Date().setHours(0, 0, 0, 0)) / 864e5)
}

function situacao(i: Insumo): 'vencido' | 'vencendo' | 'baixo' | 'ok' {
  const dias = diasParaVencer(i.validade)
  if (dias !== null && dias < 0) return 'vencido'
  if (dias !== null && dias <= 30) return 'vencendo'
  if (i.quantidade <= i.minimo) return 'baixo'
  return 'ok'
}

const SIT: Record<string, { bg: string; cor: string; label: (i: Insumo) => string }> = {
  vencido:  { bg: '#fef2f2', cor: '#d64545', label: () => '❌ Vencido' },
  vencendo: { bg: '#fdf0e8', cor: '#e8743b', label: (i) => `⚠️ Vence em ${diasParaVencer(i.validade)}d` },
  baixo:    { bg: '#fdf0e8', cor: '#e8743b', label: () => '📉 Estoque baixo' },
  ok:       { bg: '#e6f6f5', cor: '#13a89e', label: () => '✅ OK' },
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

export default function Estoque() {
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [busca, setBusca] = useState('')
  const [catFiltro, setCatFiltro] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<typeof VAZIO & { id?: string }>(VAZIO)
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    const { data } = await supabase.from('insumos').select('*').order('nome')
    setInsumos((data as Insumo[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { carregar() }, [])

  const set = (campo: string, valor: string) => setForm(f => ({ ...f, [campo]: valor }))

  async function salvar(e: FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) { alert('Informe o nome.'); return }
    if (!form.categoria) { alert('Selecione a categoria.'); return }
    if (!form.unidade.trim()) { alert('Informe a unidade.'); return }
    setSalvando(true)
    const dados = { nome: form.nome, categoria: form.categoria, unidade: form.unidade, quantidade: parseInt(form.quantidade) || 0, minimo: parseInt(form.minimo) || 0, validade: form.validade || null, observacao: form.observacao || null }
    const resp = form.id ? await supabase.from('insumos').update(dados).eq('id', form.id) : await supabase.from('insumos').insert(dados)
    setSalvando(false)
    if (resp.error) { alert('Erro: ' + resp.error.message); return }
    setModal(false); carregar()
  }

  async function excluir(i: Insumo) {
    if (!confirm(`Excluir "${i.nome}"?`)) return
    const { error } = await supabase.from('insumos').delete().eq('id', i.id)
    if (error) alert('Erro: ' + error.message)
    else carregar()
  }

  async function movimentar(i: Insumo, tipo: 'entrada' | 'saida') {
    const label = tipo === 'entrada' ? 'Entrada (repor estoque)' : 'Saída (dar baixa)'
    const qtdStr = prompt(`${label}\n${i.nome} — atual: ${i.quantidade} ${i.unidade}\n\nQuantidade:`, '1')
    if (qtdStr === null) return
    const qtd = parseInt(qtdStr, 10)
    if (isNaN(qtd) || qtd <= 0) { alert('Quantidade inválida.'); return }
    const nova = tipo === 'entrada' ? i.quantidade + qtd : i.quantidade - qtd
    if (nova < 0) { alert('Estoque insuficiente.'); return }
    const { error } = await supabase.from('insumos').update({ quantidade: nova }).eq('id', i.id)
    if (error) alert('Erro: ' + error.message)
    else carregar()
  }

  const filtrados = insumos.filter(i => {
    const t = busca.toLowerCase()
    return (!catFiltro || i.categoria === catFiltro) &&
      (i.nome.toLowerCase().includes(t) || (i.observacao ?? '').toLowerCase().includes(t))
  })

  const totalBaixo = insumos.filter(i => situacao(i) === 'baixo').length
  const totalAlerta = insumos.filter(i => { const s = situacao(i); return s === 'vencido' || s === 'vencendo' }).length
  const totalCats = new Set(insumos.map(i => i.categoria)).size

  return (
    <div className="page-enter max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#14302b]">Estoque / Insumos</h1>
        <button onClick={() => { setForm(VAZIO); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13a89e] text-white text-sm font-bold hover:bg-[#0d8d84] transition-colors">
          <Plus size={16} /> Novo item
        </button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { l: 'Total de itens', v: insumos.length, cor: '#13a89e' },
          { l: 'Estoque baixo', v: totalBaixo, cor: totalBaixo > 0 ? '#e8743b' : '#8fa89a' },
          { l: 'Validade / Vencido', v: totalAlerta, cor: totalAlerta > 0 ? '#d64545' : '#8fa89a' },
          { l: 'Categorias', v: totalCats, cor: '#3b82f6' },
        ].map(c => (
          <div key={c.l} className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-extrabold" style={{ color: c.cor }}>{loading ? '—' : c.v}</p>
            <p className="text-xs text-[#5f7a6a] mt-1">{c.l}</p>
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa89a]" />
        <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d4e0da] text-sm outline-none focus:border-[#13a89e] bg-white"
          placeholder="Buscar insumo..." value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {/* Filtro categoria */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['', ...CATEGORIAS].map(c => (
          <button key={c} onClick={() => setCatFiltro(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${catFiltro === c ? 'bg-[#13a89e] text-white' : 'bg-white text-[#5f7a6a]'}`}
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,.06)' }}>
            {c ? `${CAT_EMOJI[c]} ${c}` : 'Todos'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-[#5f7a6a]"><p className="text-4xl mb-3">📦</p><p>Nenhum insumo encontrado.</p></div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map(i => {
            const sit = situacao(i)
            const badge = SIT[sit]
            const pct = i.minimo > 0 ? Math.min(100, Math.round((i.quantidade / (i.minimo * 2)) * 100)) : 100
            return (
              <div key={i.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4 flex-wrap">
                <div className="w-12 h-12 rounded-xl bg-[#f0f4f2] flex items-center justify-center text-2xl flex-shrink-0">
                  {CAT_EMOJI[i.categoria] ?? '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#14302b] text-sm">{i.nome}</p>
                  <p className="text-xs text-[#5f7a6a]">{i.categoria}</p>
                  {i.observacao && <p className="text-xs text-[#8fa89a]">{i.observacao}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-[#f0f4f2] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: sit === 'ok' ? '#13a89e' : sit === 'baixo' ? '#e8743b' : '#d64545' }} />
                    </div>
                    <span className="text-xs font-bold text-[#14302b] whitespace-nowrap">
                      {i.quantidade} <span className="text-[#5f7a6a] font-normal">{i.unidade}</span>
                    </span>
                    <span className="text-xs text-[#8fa89a]">/ mín. {i.minimo}</span>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-lg flex-shrink-0" style={{ background: badge.bg, color: badge.cor }}>
                  {badge.label(i)}
                </span>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => movimentar(i, 'entrada')} title="Entrada"
                    className="w-8 h-8 rounded-lg bg-[#e6f6f5] text-[#13a89e] font-bold hover:bg-[#b2e0dc] transition-colors flex items-center justify-center">＋</button>
                  <button onClick={() => movimentar(i, 'saida')} title="Saída"
                    className="w-8 h-8 rounded-lg bg-[#fdf0e8] text-[#e8743b] font-bold hover:bg-[#fdd9b5] transition-colors flex items-center justify-center">－</button>
                  <button onClick={() => { setForm({ id: i.id, nome: i.nome, categoria: i.categoria, unidade: i.unidade, quantidade: String(i.quantidade), minimo: String(i.minimo), validade: i.validade ?? '', observacao: i.observacao ?? '' }); setModal(true) }}
                    className="w-8 h-8 rounded-lg border border-[#d4e0da] text-[#5f7a6a] hover:bg-[#f4f7f6] transition-colors flex items-center justify-center">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => excluir(i)}
                    className="w-8 h-8 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center">
                    <Trash2 size={13} />
                  </button>
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
              <h2 className="text-white font-extrabold">{form.id ? '✏️ Editar insumo' : '📦 Novo insumo'}</h2>
              <button onClick={() => setModal(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6">
              <form onSubmit={salvar}>
                <Campo label="Nome *"><input className={inp} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex.: Amoxicilina 500mg" /></Campo>
                <Campo label="Categoria *">
                  <select className={inp} value={form.categoria} onChange={e => set('categoria', e.target.value)}>
                    <option value="">Selecione...</option>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{CAT_EMOJI[c]} {c}</option>)}
                  </select>
                </Campo>
                <Campo label="Unidade *"><input className={inp} value={form.unidade} onChange={e => set('unidade', e.target.value)} placeholder="un, ml, kg, caixa" /></Campo>
                <div className="flex gap-3">
                  <div className="flex-1"><Campo label="Qtd. em estoque"><input className={inp} type="number" value={form.quantidade} onChange={e => set('quantidade', e.target.value)} /></Campo></div>
                  <div className="flex-1"><Campo label="Qtd. mínima"><input className={inp} type="number" value={form.minimo} onChange={e => set('minimo', e.target.value)} /></Campo></div>
                </div>
                <Campo label="Validade"><input className={inp} type="date" value={form.validade} onChange={e => set('validade', e.target.value)} /></Campo>
                <Campo label="Observação"><textarea className={inp + ' resize-y min-h-[68px]'} value={form.observacao} onChange={e => set('observacao', e.target.value)} placeholder="Ex.: Manter refrigerado" /></Campo>
                <button type="submit" disabled={salvando} className="w-full py-3 rounded-xl bg-[#13a89e] hover:bg-[#0d8d84] text-white font-bold transition-colors disabled:opacity-60 mt-2">
                  {salvando ? 'Salvando...' : 'Salvar insumo'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
