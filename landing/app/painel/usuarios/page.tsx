'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { UserCog, Mail, Shield, Plus, X, Trash2, Eye, EyeOff, KeyRound } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

interface Funcionario {
  id: string; nome: string; crmv: string | null; cargo: string | null
}

const VAZIO = { nome: '', email: '', senha: '', crmv: '', cargo: '' }
const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-[#d4e0da] text-[#14302b] text-sm outline-none focus:border-[#13a89e] transition-colors bg-white'

export default function Usuarios() {
  const { session } = useAuth()
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(VAZIO)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarSenha, setMostrarSenha] = useState(false)

  async function carregar() {
    const { data } = await supabase.from('funcionarios').select('id, nome, crmv, cargo').order('nome')
    setFuncionarios((data as Funcionario[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  const set = (campo: string, valor: string) => setForm(f => ({ ...f, [campo]: valor }))

  async function criarUsuario(e: FormEvent) {
    e.preventDefault()
    if (!form.nome.trim() || !form.email.trim() || !form.senha.trim()) {
      setErro('Nome, e-mail e senha são obrigatórios.'); return
    }
    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.'); return
    }
    setSalvando(true); setErro(null)

    const { data: { session: s } } = await supabase.auth.getSession()
    const res = await fetch('/api/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${s?.access_token}` },
      body: JSON.stringify({ email: form.email, password: form.senha, nome: form.nome, crmv: form.crmv, cargo: form.cargo }),
    })
    const json = await res.json()
    setSalvando(false)
    if (!res.ok) { setErro(json.error || 'Erro ao criar usuário'); return }
    setModal(false); setForm(VAZIO); carregar()
  }

  async function excluir(f: Funcionario) {
    if (f.id === session?.user.id) { alert('Não é possível excluir seu próprio usuário.'); return }
    if (!confirm(`Excluir ${f.nome}?\n\nEsta ação remove o acesso ao painel permanentemente.`)) return

    const { data: { session: s } } = await supabase.auth.getSession()
    const res = await fetch('/api/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${s?.access_token}` },
      body: JSON.stringify({ userId: f.id }),
    })
    const json = await res.json()
    if (!res.ok) { alert(json.error || 'Erro ao excluir usuário'); return }
    carregar()
  }

  return (
    <div className="page-enter max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#14302b]">Usuários do sistema</h1>
        <button
          onClick={() => { setForm(VAZIO); setErro(null); setMostrarSenha(false); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13a89e] text-white text-sm font-bold hover:bg-[#0d8d84] active:scale-[.98] transition-all"
        >
          <Plus size={16} /> Novo usuário
        </button>
      </div>

      {/* Meu perfil */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f2925] to-[#13a89e] flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-[#14302b]">Meu perfil</h2>
            <p className="text-sm text-[#5f7a6a]">Usuário autenticado no sistema</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-[#f4f7f6] rounded-xl">
          <Mail size={16} className="text-[#8fa89a]" />
          <span className="text-sm text-[#14302b] font-medium">{session?.user.email}</span>
        </div>
      </div>

      {/* Equipe */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-[#f0f4f2]">
          <UserCog size={18} className="text-[#13a89e]" />
          <h2 className="font-bold text-[#14302b]">Equipe com acesso ao painel</h2>
          <span className="ml-auto text-xs bg-[#e6f6f5] text-[#13a89e] font-bold px-2.5 py-0.5 rounded-full">
            {funcionarios.length} {funcionarios.length === 1 ? 'usuário' : 'usuários'}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" />
          </div>
        ) : funcionarios.length === 0 ? (
          <div className="text-center py-12 text-[#5f7a6a]">
            <p className="text-4xl mb-3">👤</p>
            <p className="text-sm">Nenhum usuário cadastrado. Clique em <strong>"Novo usuário"</strong> para começar.</p>
          </div>
        ) : (
          <div>
            {funcionarios.map((f, i) => (
              <div key={f.id} className={`flex items-center gap-4 px-6 py-4 ${i < funcionarios.length - 1 ? 'border-b border-[#f0f4f2]' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-[#e6f6f5] flex items-center justify-center font-extrabold text-[#13a89e] text-sm">
                  {f.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#14302b] text-sm">{f.nome}</p>
                  <p className="text-xs text-[#5f7a6a]">
                    {f.cargo ?? 'Sem cargo'}{f.crmv && ` · ${f.crmv}`}
                  </p>
                </div>
                {f.id === session?.user.id ? (
                  <span className="text-xs font-bold bg-[#e6f6f5] text-[#13a89e] px-2.5 py-1 rounded-full">Você</span>
                ) : (
                  <button
                    onClick={() => excluir(f)}
                    title="Remover acesso"
                    className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal novo usuário */}
      {modal && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(false)} />
          <div className="modal-panel relative bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0f2925] to-[#13a89e] rounded-t-3xl">
              <h2 className="text-white font-extrabold flex items-center gap-2">
                <KeyRound size={16} /> Novo usuário
              </h2>
              <button onClick={() => setModal(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={criarUsuario} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#14302b] mb-1.5">Nome completo *</label>
                <input className={inp} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex.: Dr. João Silva" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14302b] mb-1.5">E-mail *</label>
                <input className={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="usuario@email.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14302b] mb-1.5">Senha *</label>
                <div className="relative">
                  <input
                    className={inp + ' pr-10'}
                    type={mostrarSenha ? 'text' : 'password'}
                    value={form.senha}
                    onChange={e => set('senha', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button type="button" onClick={() => setMostrarSenha(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fa89a] hover:text-[#13a89e] transition-colors">
                    {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#14302b] mb-1.5">Cargo</label>
                  <input className={inp} value={form.cargo} onChange={e => set('cargo', e.target.value)} placeholder="Ex.: Veterinário" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#14302b] mb-1.5">CRMV</label>
                  <input className={inp} value={form.crmv} onChange={e => set('crmv', e.target.value)} placeholder="Ex.: CRMV-SP 12345" />
                </div>
              </div>

              {erro && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                  <span>⚠️</span> {erro}
                </div>
              )}

              <button type="submit" disabled={salvando}
                className="w-full py-3 rounded-xl bg-[#13a89e] hover:bg-[#0d8d84] text-white font-bold transition-colors disabled:opacity-60 mt-1 flex items-center justify-center gap-2">
                {salvando
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Criando...</>
                  : 'Criar usuário'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
