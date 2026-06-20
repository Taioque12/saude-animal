'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Search, Plus, X, Edit2, Trash2, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

interface Lancamento {
  id: string; setor: string; tipo: string; categoria: string | null
  descricao: string; valor: number; data: string; forma: string | null; status: string
}
interface Nota {
  id: string; setor: string; numero: string; tipo: string; descricao: string
  parte: string | null; valor: number; data_emissao: string | null
  data_pagamento: string | null; boleto: string | null; status: string
}

const SETORES = ['Clínica Veterinária', 'Banho e Tosa']
const FORMAS = ['Dinheiro', 'PIX', 'Cartão de débito', 'Cartão de crédito', 'Transferência', 'Boleto', 'Cheque']
const CATS_E = ['Consultas', 'Cirurgias', 'Vacinas', 'Exames', 'Banho e Tosa', 'Produtos', 'Outras receitas']
const CATS_S = ['Folha de pagamento', 'Fornecedores', 'Aluguel', 'Energia/Água/Internet', 'Impostos', 'Equipamentos', 'Medicamentos/Insumos', 'Outras despesas']

const hoje = () => new Date().toISOString().slice(0, 10)
const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const dataBR = (s: string | null) => s ? new Date(s + 'T12:00:00').toLocaleDateString('pt-BR') : '—'
const ehMes = (s: string | null) => { if (!s) return false; const d = new Date(s + 'T12:00:00'), n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }
const notaVencida = (n: Nota) => { if (n.status === 'Pago' || !n.data_pagamento) return false; return new Date(n.data_pagamento + 'T12:00:00') < new Date(hoje() + 'T12:00:00') }

const VZ_C = { setor: '', tipo: 'Entrada', categoria: '', descricao: '', valor: '', data: hoje(), forma: '', status: 'Pago' }
const VZ_N = { setor: '', numero: '', tipo: 'Entrada', descricao: '', parte: '', valor: '', data_emissao: hoje(), data_pagamento: '', boleto: '', status: 'Pendente' }

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mb-4"><label className="block text-sm font-semibold text-[#14302b] mb-1.5">{label}</label>{children}</div>
}
const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-[#d4e0da] text-[#14302b] text-sm outline-none focus:border-[#13a89e] transition-colors bg-white'

export default function Financeiro() {
  const [aba, setAba] = useState<'caixa' | 'notas'>('caixa')
  const [setor, setSetor] = useState('')
  const [lancamentos, setLanc] = useState<Lancamento[]>([])
  const [notas, setNotas] = useState<Nota[]>([])
  const [busca, setBusca] = useState('')
  const [fTipo, setFTipo] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalC, setModalC] = useState(false)
  const [modalN, setModalN] = useState(false)
  const [formC, setFormC] = useState<typeof VZ_C & { id?: string }>(VZ_C)
  const [formN, setFormN] = useState<typeof VZ_N & { id?: string }>(VZ_N)
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    const [l, n] = await Promise.all([
      supabase.from('financeiro').select('*').order('data', { ascending: false }),
      supabase.from('notas_fiscais').select('*').order('data_emissao', { ascending: false }),
    ])
    setLanc((l.data as Lancamento[]) ?? [])
    setNotas((n.data as Nota[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { carregar() }, [])

  const base = lancamentos.filter(m => !setor || m.setor === setor)
  const pagos = base.filter(m => m.status === 'Pago')
  const totalE = pagos.filter(m => m.tipo === 'Entrada').reduce((s, m) => s + Number(m.valor), 0)
  const totalS = pagos.filter(m => m.tipo === 'Saída').reduce((s, m) => s + Number(m.valor), 0)
  const mesE = pagos.filter(m => m.tipo === 'Entrada' && ehMes(m.data)).reduce((s, m) => s + Number(m.valor), 0)
  const mesS = pagos.filter(m => m.tipo === 'Saída' && ehMes(m.data)).reduce((s, m) => s + Number(m.valor), 0)
  const baseN = notas.filter(n => !setor || n.setor === setor)
  const aReceber = baseN.filter(n => n.tipo === 'Entrada' && n.status === 'Pendente').reduce((s, n) => s + Number(n.valor), 0)
  const aPagar = baseN.filter(n => n.tipo === 'Saída' && n.status === 'Pendente').reduce((s, n) => s + Number(n.valor), 0)
  const vencidas = baseN.filter(notaVencida).length

  const lancsFilt = base
    .filter(m => !fTipo || m.tipo === fTipo)
    .filter(m => !fStatus || m.status === fStatus)
    .filter(m => { const t = busca.toLowerCase(); return !t || m.descricao.toLowerCase().includes(t) || (m.categoria ?? '').toLowerCase().includes(t) })

  const notasFilt = baseN
    .filter(n => !fTipo || n.tipo === fTipo)
    .filter(n => { if (!fStatus) return true; if (fStatus === 'Vencida') return notaVencida(n); return n.status === fStatus })
    .filter(n => { const t = busca.toLowerCase(); return !t || n.descricao.toLowerCase().includes(t) || n.numero.includes(t) || (n.parte ?? '').toLowerCase().includes(t) })

  const setC = (c: string, v: string) => setFormC(f => ({ ...f, [c]: v }))
  async function salvarCaixa(e: FormEvent) {
    e.preventDefault()
    if (!formC.setor) { alert('Selecione o setor.'); return }
    if (!formC.descricao.trim()) { alert('Informe a descrição.'); return }
    if (!formC.valor || isNaN(parseFloat(formC.valor))) { alert('Informe o valor.'); return }
    setSalvando(true)
    const dados = { setor: formC.setor, tipo: formC.tipo, categoria: formC.categoria || null, descricao: formC.descricao, valor: parseFloat(formC.valor), data: formC.data, forma: formC.forma || null, status: formC.status }
    const resp = formC.id ? await supabase.from('financeiro').update(dados).eq('id', formC.id) : await supabase.from('financeiro').insert(dados)
    setSalvando(false)
    if (resp.error) { alert('Erro: ' + resp.error.message); return }
    setModalC(false); carregar()
  }

  const setN = (c: string, v: string) => setFormN(f => ({ ...f, [c]: v }))
  async function salvarNota(e: FormEvent) {
    e.preventDefault()
    if (!formN.setor) { alert('Selecione o setor.'); return }
    if (!formN.numero.trim()) { alert('Informe o número.'); return }
    if (!formN.descricao.trim()) { alert('Informe a descrição.'); return }
    if (!formN.valor || isNaN(parseFloat(formN.valor))) { alert('Informe o valor.'); return }
    setSalvando(true)
    const dados = { setor: formN.setor, numero: formN.numero, tipo: formN.tipo, descricao: formN.descricao, parte: formN.parte || null, valor: parseFloat(formN.valor), data_emissao: formN.data_emissao || null, data_pagamento: formN.data_pagamento || null, boleto: formN.boleto || null, status: formN.status }
    const resp = formN.id ? await supabase.from('notas_fiscais').update(dados).eq('id', formN.id) : await supabase.from('notas_fiscais').insert(dados)
    setSalvando(false)
    if (resp.error) { alert('Erro: ' + resp.error.message); return }
    setModalN(false); carregar()
  }

  async function darBaixa(n: Nota) {
    if (!confirm(`Dar baixa na NF ${n.numero} e lançar no caixa?`)) return
    const dataPag = n.data_pagamento || hoje()
    await Promise.all([
      supabase.from('notas_fiscais').update({ status: 'Pago', data_pagamento: dataPag }).eq('id', n.id),
      supabase.from('financeiro').insert({ setor: n.setor, tipo: n.tipo, categoria: n.tipo === 'Entrada' ? 'Outras receitas' : 'Fornecedores', descricao: `NF ${n.numero} — ${n.descricao}`, valor: Number(n.valor), data: dataPag, forma: n.boleto ? 'Boleto' : 'Transferência', status: 'Pago' }),
    ])
    carregar()
  }

  function exportar() {
    const label = setor || 'Consolidado'
    const lBase = setor ? lancamentos.filter(m => m.setor === setor) : lancamentos
    const nBase = setor ? notas.filter(n => n.setor === setor) : notas
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Relatório Financeiro — Cia Pet'], ['Setor', label], ['Gerado em', new Date().toLocaleString('pt-BR')], [],
      ['FLUXO DE CAIXA'], ['Entradas pagas', totalE], ['Saídas pagas', totalS], ['Saldo', totalE - totalS], [],
      ['NOTAS FISCAIS'], ['A receber', aReceber], ['A pagar', aPagar], ['Vencidas', vencidas],
    ]), 'Resumo')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Data', 'Setor', 'Tipo', 'Categoria', 'Descrição', 'Forma', 'Valor (R$)', 'Status'],
      ...lBase.map(m => [dataBR(m.data), m.setor, m.tipo, m.categoria ?? '', m.descricao, m.forma ?? '', Number(m.valor), m.status]),
    ]), 'Fluxo de Caixa')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Nº NF', 'Setor', 'Tipo', 'Descrição', 'Parte', 'Emissão', 'Pagamento', 'Valor (R$)', 'Status'],
      ...nBase.map(n => [n.numero, n.setor, n.tipo, n.descricao, n.parte ?? '', dataBR(n.data_emissao), dataBR(n.data_pagamento), Number(n.valor), notaVencida(n) ? 'Vencida' : n.status]),
    ]), 'Notas Fiscais')
    XLSX.writeFile(wb, `Financeiro_${label.replace(/[^\wÀ-ÿ]+/g, '_')}_${hoje()}.xlsx`)
  }

  return (
    <div className="page-enter max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-[#14302b]">Financeiro</h1>
        <button onClick={exportar} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#d4e0da] text-[#5f7a6a] text-sm font-bold hover:bg-[#f4f7f6] transition-colors">
          <Download size={16} /> Excel
        </button>
      </div>

      {/* Abas */}
      <div className="flex gap-2 mb-4">
        {[['caixa', '💵 Fluxo de Caixa'], ['notas', '🧾 Notas Fiscais']].map(([v, l]) => (
          <button key={v} onClick={() => { setAba(v as 'caixa' | 'notas'); setBusca(''); setFTipo(''); setFStatus('') }}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${aba === v ? 'bg-[#13a89e] text-white' : 'bg-white text-[#5f7a6a]'}`}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>{l}</button>
        ))}
      </div>

      {/* Filtro setor */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['', ...SETORES].map(s => (
          <button key={s} onClick={() => setSetor(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${setor === s ? 'bg-[#14302b] text-white' : 'bg-white text-[#5f7a6a]'}`}
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,.06)' }}>
            {s || 'Consolidado'}
          </button>
        ))}
      </div>

      {/* Cards resumo */}
      {aba === 'caixa' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { l: 'Saldo total', v: moeda(totalE - totalS), cor: (totalE - totalS) >= 0 ? '#13a89e' : '#d64545' },
            { l: 'Entradas do mês', v: moeda(mesE), cor: '#13a89e' },
            { l: 'Saídas do mês', v: moeda(mesS), cor: '#d64545' },
            { l: 'Resultado do mês', v: moeda(mesE - mesS), cor: (mesE - mesS) >= 0 ? '#13a89e' : '#d64545' },
          ].map(c => (
            <div key={c.l} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-base font-extrabold" style={{ color: c.cor }}>{loading ? '—' : c.v}</p>
              <p className="text-xs text-[#5f7a6a] mt-1">{c.l}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { l: 'A receber', v: moeda(aReceber), cor: '#13a89e' },
            { l: 'A pagar', v: moeda(aPagar), cor: '#d64545' },
            { l: 'Vencidas', v: String(vencidas), cor: vencidas > 0 ? '#d64545' : '#8fa89a' },
            { l: 'Total notas', v: String(baseN.length), cor: '#3b82f6' },
          ].map(c => (
            <div key={c.l} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-base font-extrabold" style={{ color: c.cor }}>{loading ? '—' : c.v}</p>
              <p className="text-xs text-[#5f7a6a] mt-1">{c.l}</p>
            </div>
          ))}
        </div>
      )}

      {/* Busca + filtros + botões */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fa89a]" />
          <input className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#d4e0da] text-sm outline-none focus:border-[#13a89e] bg-white"
            placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <select className={inp + ' !w-auto min-w-[120px]'} value={fTipo} onChange={e => setFTipo(e.target.value)}>
          <option value="">Todos tipos</option>
          <option value="Entrada">Entrada</option>
          <option value="Saída">Saída</option>
        </select>
        <select className={inp + ' !w-auto min-w-[120px]'} value={fStatus} onChange={e => setFStatus(e.target.value)}>
          <option value="">Todos status</option>
          <option value="Pago">Pago</option>
          <option value="Pendente">Pendente</option>
          {aba === 'notas' && <option value="Vencida">Vencida</option>}
        </select>
        {aba === 'caixa' ? (
          <>
            <button onClick={() => { setFormC({ ...VZ_C, tipo: 'Entrada', setor }); setModalC(true) }}
              className="px-3 py-2 rounded-xl bg-[#13a89e] text-white text-sm font-bold hover:bg-[#0d8d84] transition-colors">+ Entrada</button>
            <button onClick={() => { setFormC({ ...VZ_C, tipo: 'Saída', setor }); setModalC(true) }}
              className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors">+ Saída</button>
          </>
        ) : (
          <button onClick={() => { setFormN({ ...VZ_N, setor }); setModalN(true) }}
            className="px-3 py-2 rounded-xl bg-[#13a89e] text-white text-sm font-bold hover:bg-[#0d8d84] transition-colors">+ Nova NF</button>
        )}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" />
        </div>
      ) : aba === 'caixa' ? (
        lancsFilt.length === 0 ? (
          <div className="text-center py-16 text-[#5f7a6a]"><p className="text-4xl mb-3">💵</p><p>Nenhuma movimentação encontrada.</p></div>
        ) : (
          <div className="flex flex-col gap-2">
            {lancsFilt.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 flex-wrap">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${m.tipo === 'Entrada' ? 'bg-[#e6f6f5]' : 'bg-red-50'}`}>
                  {m.tipo === 'Entrada' ? '📈' : '📉'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#14302b] text-sm">{m.descricao}</p>
                  <p className="text-xs text-[#5f7a6a]">{dataBR(m.data)} · {m.setor}{m.categoria ? ` · ${m.categoria}` : ''}{m.forma ? ` · ${m.forma}` : ''}</p>
                </div>
                <p className="font-extrabold text-sm flex-shrink-0" style={{ color: m.tipo === 'Entrada' ? '#13a89e' : '#d64545' }}>
                  {m.tipo === 'Entrada' ? '+' : '−'} {moeda(Number(m.valor))}
                </p>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${m.status === 'Pago' ? 'bg-[#e6f6f5] text-[#13a89e]' : 'bg-[#fdf0e8] text-[#e8743b]'}`}>
                  {m.status}
                </span>
                <div className="flex gap-1.5 flex-shrink-0">
                  {m.status === 'Pendente' && (
                    <button onClick={async () => { await supabase.from('financeiro').update({ status: 'Pago' }).eq('id', m.id); carregar() }}
                      className="px-2.5 py-1 rounded-lg bg-[#e6f6f5] text-[#13a89e] text-xs font-bold hover:bg-[#b2e0dc]">✓ Pagar</button>
                  )}
                  <button onClick={() => { setFormC({ id: m.id, setor: m.setor, tipo: m.tipo, categoria: m.categoria ?? '', descricao: m.descricao, valor: String(m.valor), data: m.data, forma: m.forma ?? '', status: m.status }); setModalC(true) }}
                    className="p-1.5 rounded-lg border border-[#d4e0da] text-[#5f7a6a] hover:bg-[#f4f7f6]"><Edit2 size={13} /></button>
                  <button onClick={async () => { if (confirm('Excluir?')) { await supabase.from('financeiro').delete().eq('id', m.id); carregar() } }}
                    className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        notasFilt.length === 0 ? (
          <div className="text-center py-16 text-[#5f7a6a]"><p className="text-4xl mb-3">🧾</p><p>Nenhuma nota fiscal encontrada.</p></div>
        ) : (
          <div className="flex flex-col gap-2">
            {notasFilt.map(n => {
              const venc = notaVencida(n)
              return (
                <div key={n.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 flex-wrap">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${n.tipo === 'Entrada' ? 'bg-[#e6f6f5]' : 'bg-red-50'}`}>🧾</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#14302b] text-sm">NF {n.numero} · {n.descricao}</p>
                    <p className="text-xs text-[#5f7a6a]">{n.setor}{n.parte ? ` · ${n.parte}` : ''} · Emissão: {dataBR(n.data_emissao)} · Vencto: {dataBR(n.data_pagamento)}</p>
                  </div>
                  <p className="font-extrabold text-sm flex-shrink-0" style={{ color: n.tipo === 'Entrada' ? '#13a89e' : '#d64545' }}>
                    {moeda(Number(n.valor))}
                  </p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${venc ? 'bg-red-50 text-red-600' : n.status === 'Pago' ? 'bg-[#e6f6f5] text-[#13a89e]' : 'bg-[#fdf0e8] text-[#e8743b]'}`}>
                    {venc ? '⚠️ Vencida' : n.status === 'Pago' ? '✅ Pago' : '⏳ Pendente'}
                  </span>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {n.status === 'Pendente' && (
                      <button onClick={() => darBaixa(n)} className="px-2.5 py-1 rounded-lg bg-[#e6f6f5] text-[#13a89e] text-xs font-bold hover:bg-[#b2e0dc]">✓ Baixar</button>
                    )}
                    <button onClick={() => { setFormN({ id: n.id, setor: n.setor, numero: n.numero, tipo: n.tipo, descricao: n.descricao, parte: n.parte ?? '', valor: String(n.valor), data_emissao: n.data_emissao ?? '', data_pagamento: n.data_pagamento ?? '', boleto: n.boleto ?? '', status: n.status }); setModalN(true) }}
                      className="p-1.5 rounded-lg border border-[#d4e0da] text-[#5f7a6a] hover:bg-[#f4f7f6]"><Edit2 size={13} /></button>
                    <button onClick={async () => { if (confirm('Excluir?')) { await supabase.from('notas_fiscais').delete().eq('id', n.id); carregar() } }}
                      className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      {/* Modal Caixa */}
      {modalC && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalC(false)} />
          <div className="modal-panel relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 rounded-t-3xl"
              style={{ background: formC.tipo === 'Entrada' ? 'linear-gradient(135deg,#0f2925,#13a89e)' : 'linear-gradient(135deg,#7f1d1d,#d64545)' }}>
              <h2 className="text-white font-extrabold">{formC.id ? '✏️ Editar lançamento' : formC.tipo === 'Entrada' ? '📈 Nova entrada' : '📉 Nova saída'}</h2>
              <button onClick={() => setModalC(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6">
              <form onSubmit={salvarCaixa}>
                <Campo label="Setor *"><select className={inp} value={formC.setor} onChange={e => setC('setor', e.target.value)}><option value="">Selecione...</option>{SETORES.map(s => <option key={s} value={s}>{s}</option>)}</select></Campo>
                <Campo label="Tipo"><select className={inp} value={formC.tipo} onChange={e => setC('tipo', e.target.value)}><option value="Entrada">Entrada</option><option value="Saída">Saída</option></select></Campo>
                <Campo label="Categoria"><select className={inp} value={formC.categoria} onChange={e => setC('categoria', e.target.value)}><option value="">Selecione...</option>{(formC.tipo === 'Entrada' ? CATS_E : CATS_S).map(c => <option key={c} value={c}>{c}</option>)}</select></Campo>
                <Campo label="Descrição *"><input className={inp} value={formC.descricao} onChange={e => setC('descricao', e.target.value)} /></Campo>
                <Campo label="Valor (R$) *"><input className={inp} type="number" step="0.01" placeholder="0,00" value={formC.valor} onChange={e => setC('valor', e.target.value)} /></Campo>
                <Campo label="Data *"><input className={inp} type="date" value={formC.data} onChange={e => setC('data', e.target.value)} /></Campo>
                <Campo label="Forma de pagamento"><select className={inp} value={formC.forma} onChange={e => setC('forma', e.target.value)}><option value="">Selecione...</option>{FORMAS.map(f => <option key={f} value={f}>{f}</option>)}</select></Campo>
                <Campo label="Status"><select className={inp} value={formC.status} onChange={e => setC('status', e.target.value)}><option value="Pago">Pago</option><option value="Pendente">Pendente</option></select></Campo>
                <button type="submit" disabled={salvando} className="w-full py-3 rounded-xl bg-[#13a89e] hover:bg-[#0d8d84] text-white font-bold transition-colors disabled:opacity-60 mt-2">
                  {salvando ? 'Salvando...' : 'Salvar lançamento'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nota */}
      {modalN && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalN(false)} />
          <div className="modal-panel relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0f2925] to-[#13a89e] rounded-t-3xl">
              <h2 className="text-white font-extrabold">{formN.id ? '✏️ Editar NF' : '🧾 Nova nota fiscal'}</h2>
              <button onClick={() => setModalN(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6">
              <form onSubmit={salvarNota}>
                <Campo label="Setor *"><select className={inp} value={formN.setor} onChange={e => setN('setor', e.target.value)}><option value="">Selecione...</option>{SETORES.map(s => <option key={s} value={s}>{s}</option>)}</select></Campo>
                <Campo label="Número *"><input className={inp} value={formN.numero} onChange={e => setN('numero', e.target.value)} placeholder="000123" /></Campo>
                <Campo label="Tipo *"><select className={inp} value={formN.tipo} onChange={e => setN('tipo', e.target.value)}><option value="Entrada">Entrada (a receber)</option><option value="Saída">Saída (a pagar)</option></select></Campo>
                <Campo label="Descrição *"><input className={inp} value={formN.descricao} onChange={e => setN('descricao', e.target.value)} /></Campo>
                <Campo label="Cliente / Fornecedor"><input className={inp} value={formN.parte} onChange={e => setN('parte', e.target.value)} /></Campo>
                <Campo label="Valor (R$) *"><input className={inp} type="number" step="0.01" placeholder="0,00" value={formN.valor} onChange={e => setN('valor', e.target.value)} /></Campo>
                <Campo label="Data de emissão"><input className={inp} type="date" value={formN.data_emissao} onChange={e => setN('data_emissao', e.target.value)} /></Campo>
                <Campo label="Vencimento"><input className={inp} type="date" value={formN.data_pagamento} onChange={e => setN('data_pagamento', e.target.value)} /></Campo>
                <Campo label="Linha do boleto"><input className={inp} value={formN.boleto} onChange={e => setN('boleto', e.target.value)} placeholder="Opcional" /></Campo>
                <Campo label="Status"><select className={inp} value={formN.status} onChange={e => setN('status', e.target.value)}><option value="Pendente">Pendente</option><option value="Pago">Pago</option></select></Campo>
                <button type="submit" disabled={salvando} className="w-full py-3 rounded-xl bg-[#13a89e] hover:bg-[#0d8d84] text-white font-bold transition-colors disabled:opacity-60 mt-2">
                  {salvando ? 'Salvando...' : 'Salvar nota fiscal'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
