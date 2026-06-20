'use client'

import { useEffect, useState } from 'react'
import { UserCog, Mail, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

interface Funcionario {
  id: string; nome: string; crmv: string | null; cargo: string | null
}

export default function Usuarios() {
  const { session } = useAuth()
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState(session?.user.email ?? '')

  useEffect(() => {
    supabase.from('funcionarios').select('id, nome, crmv, cargo').order('nome')
      .then(({ data }) => { setFuncionarios((data as Funcionario[]) ?? []); setLoading(false) })
  }, [])

  return (
    <div className="page-enter max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[#14302b] mb-6">Usuários do sistema</h1>

      {/* Perfil do usuário logado */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-5">
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
        <p className="text-xs text-[#8fa89a] mt-3">
          Para alterar a senha ou e-mail, acesse diretamente o painel do Supabase com credenciais de administrador.
        </p>
      </div>

      {/* Lista de funcionários */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-[#f0f4f2]">
          <UserCog size={18} className="text-[#13a89e]" />
          <h2 className="font-bold text-[#14302b]">Equipe cadastrada</h2>
          <span className="ml-auto text-xs bg-[#e6f6f5] text-[#13a89e] font-bold px-2.5 py-0.5 rounded-full">
            {funcionarios.length} {funcionarios.length === 1 ? 'funcionário' : 'funcionários'}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" />
          </div>
        ) : funcionarios.length === 0 ? (
          <div className="text-center py-12 text-[#5f7a6a]">
            <p className="text-4xl mb-3">👤</p>
            <p>Nenhum funcionário cadastrado na tabela <code className="text-xs bg-[#f4f7f6] px-1.5 py-0.5 rounded">funcionarios</code>.</p>
          </div>
        ) : (
          <div>
            {funcionarios.map((f, i) => (
              <div key={f.id} className={`flex items-center gap-4 px-6 py-4 ${i < funcionarios.length - 1 ? 'border-b border-[#f0f4f2]' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-[#e6f6f5] flex items-center justify-center font-extrabold text-[#13a89e]">
                  {f.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#14302b] text-sm">{f.nome}</p>
                  <p className="text-xs text-[#5f7a6a]">
                    {f.cargo ?? 'Sem cargo'}
                    {f.crmv && ` · ${f.crmv}`}
                  </p>
                </div>
                {f.id === session?.user.id && (
                  <span className="text-xs font-bold bg-[#e6f6f5] text-[#13a89e] px-2.5 py-1 rounded-full">
                    Você
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-[#fdf0e8] border border-[#fdd9b5] rounded-2xl">
        <p className="text-sm text-[#e8743b] font-medium">
          ⚙️ Para adicionar ou remover usuários com acesso ao painel, utilize o Supabase Dashboard (Authentication → Users). O cadastro de funcionários (nome, CRMV, cargo) é feito diretamente na tabela <code className="text-xs bg-white/60 px-1 rounded">funcionarios</code>.
        </p>
      </div>
    </div>
  )
}
