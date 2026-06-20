'use client'

import { useState, type FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const router = useRouter()
  const { session, loading } = useAuth()

  useEffect(() => {
    if (!loading && session) router.replace('/painel/dashboard')
  }, [session, loading, router])

  async function entrar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      setErro('E-mail ou senha inválidos. Verifique suas credenciais.')
      setEnviando(false)
    } else {
      router.replace('/painel/dashboard')
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen flex">
      {/* Branding lateral */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-[#0f2925] via-[#13a89e] to-[#3dbf8f] relative overflow-hidden px-12">
        {/* Círculos decorativos */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 text-center text-white max-w-xs">
          <div className="bg-white rounded-2xl px-6 py-4 mb-10 shadow-xl inline-block">
            <img src="/logo.png" alt="Saúde Animal" className="h-14 w-auto" />
          </div>

          <div className="border-t border-white/20 pt-8 text-left">
            <p className="text-base font-semibold text-white mb-5">Painel exclusivo da equipe</p>
            {[
              { icon: '📅', text: 'Gerenciar agendamentos' },
              { icon: '🐾', text: 'Prontuários dos pacientes' },
              { icon: '📦', text: 'Controle de estoque' },
              { icon: '💰', text: 'Financeiro e relatórios' },
              { icon: '💉', text: 'Carteira de vacinação' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 mb-3 text-white/80">
                <span className="text-lg">{icon}</span>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f4f7f6] px-6 py-12">
        {/* Logo mobile */}
        <div className="flex lg:hidden mb-8">
          <img src="/logo.png" alt="Saúde Animal" className="h-12 w-auto" />
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(20,60,50,.12)] p-10">
          <h2 className="text-2xl font-extrabold text-[#14302b] mb-1">Bem-vindo de volta</h2>
          <p className="text-sm text-[#5f7a6a] mb-8">
            Entre com suas credenciais para acessar o painel
          </p>

          <form onSubmit={entrar} className="flex flex-col gap-5">
            {/* E-mail */}
            <div>
              <label className="block text-sm font-semibold text-[#14302b] mb-2">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa89a]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com.br"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d4e0da] text-[#14302b] bg-white text-sm outline-none focus:border-[#13a89e] transition-colors"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-semibold text-[#14302b] mb-2">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa89a]" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#d4e0da] text-[#14302b] bg-white text-sm outline-none focus:border-[#13a89e] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8fa89a] hover:text-[#13a89e]"
                >
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                <span>⚠️</span> {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full py-3.5 rounded-xl bg-[#13a89e] hover:bg-[#0d8d84] active:scale-[.98] text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : 'Entrar no painel'}
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="/" className="text-sm text-[#8fa89a] hover:text-[#13a89e] transition-colors">
              ← Voltar ao site
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs text-[#8fa89a]">
          © {new Date().getFullYear()} Cia Pet · Acesso restrito à equipe
        </p>
      </div>
    </div>
  )
}
