'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Search, Plus, X, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Tutor {
  id: string; nome: string; cpf: string | null; telefone: string | null
  email: string | null; endereco: string | null; contato_emergencia: string | null
}

const VAZIO: Partial<Tutor> = { nome: '', cpf: '', telefone: '', email: '', endereco: '', contato_emergencia: '' }

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="page-enter mb-4">
      <label className="block text-sm font-semibold text-[#14302b] mb-1.5">{label}</label>
      {children}
    </div>
  )
}
const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-[#d4e0da] text-[#14302b] text-sm outline-none focus:border-[#13a89e] transition-colors bg-white'

export default function Tutores() {
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Partial<Tutor>>(VAZIO)
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    const { data } = await supabase.from('tutores').select('*').order('nome')
    setTutores((data as Tutor[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { carregar() }, [])

  const set = (campo: keyof Tutor, valor: string) => setForm(f => ({ ...f, [campo]: valor }))

  async function salvar(e: FormEvent) {
    e.preventDefault()
    if (!form.nome?.trim()) { alert('Informe o nome do tutor.'); return }
    setSalvando(true)
    const dados = { nome: form.nome, cpf: form.cpf, telefone: form.telefone, email: form.email, endereco: form.endereco, contato_emergencia: form.contato_emergencia }
    const resp = form.id ? await supabase.from('tutores').update(dados).eq('id', form.id) : await supabase.from('tutores').insert(dados)
    setSalvando(false)
    if (resp.error) { alert('Erro: ' + resp.error.message); return }
    setModal(false); carregar()
  }

  async function excluir(t: Tutor) {
    if (!confirm(`Excluir ${t.nome}?`)) return
    const { error } = await supabase.from('tutores').delete().eq('id', t.id)
    if (error) alert('Não foi possível excluir — verifique se há pets vinculados.')
    else carregar()
  }

  const filtrados = tutores.filter(t =>
    t.nome.toLowerCase().includes(busca.toLowerCase()) || (t.cpf ?? '').includes(busca)
  )

  return (
    <div className="page-enter max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#14302b]">Tutores</h1>
        <button onClick={() => { setForm(VAZIO); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13a89e] text-white text-sm font-bold hover:bg-[#0d8d84] transition-colors">
          <Plus size={16} /> Novo tutor
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa89a]" />
        <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d4e0da] text-sm outline-none focus:border-[#13a89e] transition-colors bg-white"
          placeholder="Buscar por nome ou CPF..." value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-[#5f7a6a]">
          <p className="text-4xl mb-3">👥</p>
          <p>Nenhum tutor encontrado.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map(t => (
            <div key={t.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#e6f6f5] flex items-center justify-center font-extrabold text-lg text-[#13a89e] flex-shrink-0">
                {t.nome.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#14302b] text-sm sm:text-base">{t.nome}</p>
                <p className="text-xs text-[#5f7a6a] mt-0.5">
                  {t.telefone && `📞 ${t.telefone}`}
                  {t.email && ` · ✉️ ${t.email}`}
                </p>
                {t.cpf && <p className="text-xs text-[#8fa89a]">CPF: {t.cpf}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setForm(t); setModal(true) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d4e0da] text-[#5f7a6a] text-xs font-semibold hover:bg-[#f4f7f6] transition-colors">
                  <Edit2 size={13} /> Editar
                </button>
                <button onClick={() => excluir(t)}
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
              <h2 className="text-white font-extrabold">{form.id ? '✏️ Editar tutor' : '👤 Novo tutor'}</h2>
              <button onClick={() => setModal(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6">
              <form onSubmit={salvar}>
                <Campo label="Nome completo *">
                  <input className={inp} value={form.nome ?? ''} onChange={e => set('nome', e.target.value)} placeholder="Nome do tutor" />
                </Campo>
                <Campo label="CPF">
                  <input className={inp} value={form.cpf ?? ''} onChange={e => set('cpf', e.target.value)} placeholder="000.000.000-00" />
                </Campo>
                <Campo label="Telefone">
                  <input className={inp} value={form.telefone ?? ''} onChange={e => set('telefone', e.target.value)} placeholder="(14) 9 0000-0000" />
                </Campo>
                <Campo label="E-mail">
                  <input className={inp} type="email" value={form.email ?? ''} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com" />
                </Campo>
                <Campo label="Endereço">
                  <input className={inp} value={form.endereco ?? ''} onChange={e => set('endereco', e.target.value)} placeholder="Rua, número, bairro" />
                </Campo>
                <Campo label="Contato de emergência">
                  <input className={inp} value={form.contato_emergencia ?? ''} onChange={e => set('contato_emergencia', e.target.value)} placeholder="Nome e telefone" />
                </Campo>
                <button type="submit" disabled={salvando}
                  className="w-full py-3 rounded-xl bg-[#13a89e] hover:bg-[#0d8d84] text-white font-bold transition-colors disabled:opacity-60 mt-2">
                  {salvando ? 'Salvando...' : 'Salvar tutor'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
