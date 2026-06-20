'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Edit2, Trash2, Printer } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

interface Pet { id: string; nome: string; especie: string; tutores: { nome: string } | null }
interface Vet { nome: string; crmv: string | null }
interface Prontuario {
  id: string; pet_id: string; funcionario_id: string | null
  anamnese: string; peso: number | null; vacinas: string | null
  exames: string | null; prescricao: string | null; criado_em: string
  funcionarios: { nome: string } | null
}

const VAZIO = { anamnese: '', peso: '', vacinas: '', exames: '', prescricao: '' }
const CLINICA = { nome: 'Cia Pet', endereco: 'R. Rio Grande do Sul, Jardim Cruzeiro — Lençóis Paulista/SP', telefone: '(14) 3264-7135' }

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function fmtExtenso(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}
function esc(s: string) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] ?? c))
}

function imprimirReceituario(opts: { vet: Vet | null; emailFallback: string; pet: Pet | null; prescricao: string; peso: number | null; criadoEm: string }) {
  const vetNome = opts.vet?.nome || opts.emailFallback || 'Médico(a) Veterinário(a)'
  const vetCrmv = opts.vet?.crmv || ''
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Receituário — ${esc(opts.pet?.nome ?? '')}</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: #1a2e27; margin: 0; }
  .topo { display: flex; justify-content: space-between; border-bottom: 3px solid #13a89e; padding-bottom: 14px; }
  .marca { font-size: 24px; font-weight: 800; color: #0d8d84; }
  .sub { font-size: 12px; color: #5f6f69; margin-top: 4px; line-height: 1.5; }
  .vet { text-align: right; font-size: 13px; }
  .vet b { display: block; font-size: 15px; }
  .titulo { text-align: center; font-size: 20px; font-weight: 800; letter-spacing: 3px; color: #0d8d84; margin: 28px 0 18px; }
  .box { border: 1px solid #d9e6e0; border-radius: 8px; padding: 14px 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; font-size: 13px; }
  .l { color: #5f6f69; } .v { font-weight: 700; }
  .corpo { margin-top: 26px; min-height: 320px; font-size: 15px; line-height: 1.9; white-space: pre-wrap; }
  .assin { margin-top: 70px; text-align: center; font-size: 13px; }
  .linha { width: 280px; margin: 0 auto 6px; border-top: 1px solid #1a2e27; }
  .rodape { margin-top: 40px; border-top: 1px solid #e0e8e4; padding-top: 10px; text-align: center; font-size: 11px; color: #8a9a94; }
</style></head><body>
  <div class="topo">
    <div><div class="marca">🐾 ${esc(CLINICA.nome)}</div><div class="sub">${esc(CLINICA.endereco)}<br>Tel: ${esc(CLINICA.telefone)}</div></div>
    <div class="vet"><b>${esc(vetNome)}</b>${vetCrmv ? `Méd. Vet. · ${esc(vetCrmv)}` : 'Médico(a) Veterinário(a)'}</div>
  </div>
  <div class="titulo">RECEITUÁRIO</div>
  <div class="box">
    <div><span class="l">Paciente:</span> <span class="v">${esc(opts.pet?.nome ?? '—')}</span></div>
    <div><span class="l">Espécie:</span> <span class="v">${esc(opts.pet?.especie ?? '—')}</span></div>
    <div><span class="l">Tutor(a):</span> <span class="v">${esc(opts.pet?.tutores?.nome ?? '—')}</span></div>
    <div><span class="l">Data:</span> <span class="v">${esc(fmtExtenso(opts.criadoEm))}</span></div>
    ${opts.peso ? `<div><span class="l">Peso:</span> <span class="v">${opts.peso} kg</span></div>` : ''}
  </div>
  <div class="corpo">${esc(opts.prescricao)}</div>
  <div class="assin"><div class="linha"></div><b>${esc(vetNome)}</b>${vetCrmv ? ` — ${esc(vetCrmv)}` : ''}<div style="margin-top:18px;color:#5f6f69;">Lençóis Paulista, ${esc(fmtExtenso(opts.criadoEm))}</div></div>
  <div class="rodape">Documento emitido pelo sistema Cia Pet</div>
</body></html>`
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;'
  document.body.appendChild(iframe)
  const doc = iframe.contentWindow?.document
  if (!doc) { document.body.removeChild(iframe); return }
  doc.open(); doc.write(html); doc.close()
  iframe.onload = () => { setTimeout(() => { iframe.contentWindow?.focus(); iframe.contentWindow?.print(); setTimeout(() => document.body.removeChild(iframe), 1500) }, 250) }
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mb-4"><label className="block text-sm font-semibold text-[#14302b] mb-1.5">{label}</label>{children}</div>
}
const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-[#d4e0da] text-[#14302b] text-sm outline-none focus:border-[#13a89e] transition-colors bg-white'

export default function ProntuariosPage() {
  const { petId } = useParams<{ petId: string }>()
  const { session } = useAuth()
  const [pet, setPet] = useState<Pet | null>(null)
  const [vet, setVet] = useState<Vet | null>(null)
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<typeof VAZIO & { id?: string }>(VAZIO)
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    const [petRes, pRes, vetRes] = await Promise.all([
      supabase.from('pets').select('id, nome, especie, tutores(nome)').eq('id', petId).single(),
      supabase.from('prontuarios').select('*, funcionarios(nome)').eq('pet_id', petId).order('criado_em', { ascending: false }),
      session?.user.id ? supabase.from('funcionarios').select('nome, crmv').eq('id', session.user.id).single() : Promise.resolve({ data: null }),
    ])
    setPet(petRes.data as unknown as Pet)
    setVet((vetRes.data as Vet | null) ?? null)
    setProntuarios((pRes.data as unknown as Prontuario[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { if (petId) carregar() }, [petId])

  const set = (campo: string, valor: string) => setForm(f => ({ ...f, [campo]: valor }))

  async function salvar(e: FormEvent) {
    e.preventDefault()
    if (!form.anamnese.trim()) { alert('Informe a anamnese.'); return }
    setSalvando(true)
    const dados = { pet_id: petId, funcionario_id: session?.user.id ?? null, anamnese: form.anamnese, peso: form.peso ? parseFloat(form.peso) : null, vacinas: form.vacinas || null, exames: form.exames || null, prescricao: form.prescricao || null }
    const resp = form.id ? await supabase.from('prontuarios').update(dados).eq('id', form.id) : await supabase.from('prontuarios').insert(dados)
    setSalvando(false)
    if (resp.error) { alert('Erro: ' + resp.error.message); return }
    setModal(false); carregar()
  }

  async function excluir(p: Prontuario) {
    if (!confirm('Excluir este prontuário?')) return
    const { error } = await supabase.from('prontuarios').delete().eq('id', p.id)
    if (error) alert('Erro: ' + error.message)
    else carregar()
  }

  function imprimir(p: Prontuario) {
    if (!p.prescricao?.trim()) { alert('Preencha a Prescrição antes de imprimir.'); return }
    imprimirReceituario({ vet, emailFallback: session?.user.email ?? '', pet, prescricao: p.prescricao, peso: p.peso, criadoEm: p.criado_em })
  }

  return (
    <div className="page-enter max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/painel/pacientes" className="flex items-center gap-1.5 text-sm text-[#5f7a6a] hover:text-[#13a89e] transition-colors">
          <ArrowLeft size={16} /> Pacientes
        </Link>
        <span className="text-[#d4e0da]">/</span>
        <h1 className="text-xl font-extrabold text-[#14302b]">
          Prontuários{pet ? ` — ${pet.nome}` : ''}
        </h1>
      </div>

      <button onClick={() => { setForm(VAZIO); setModal(true) }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13a89e] text-white text-sm font-bold hover:bg-[#0d8d84] transition-colors mb-6">
        <Plus size={16} /> Novo prontuário
      </button>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#13a89e]/30 border-t-[#13a89e] rounded-full animate-spin" />
        </div>
      ) : prontuarios.length === 0 ? (
        <div className="text-center py-16 text-[#5f7a6a]">
          <p className="text-4xl mb-3">📋</p>
          <p>Nenhum prontuário registrado para {pet?.nome ?? 'este paciente'}.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {prontuarios.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <p className="text-xs text-[#5f7a6a]">
                  {fmt(p.criado_em)}
                  {p.funcionarios && ` · ${p.funcionarios.nome}`}
                  {p.peso && ` · ${p.peso} kg`}
                </p>
                <div className="flex gap-1.5">
                  <button onClick={() => imprimir(p)} title="Imprimir receituário"
                    className="p-1.5 rounded-lg border border-[#d4e0da] text-[#5f7a6a] hover:bg-[#f4f7f6] transition-colors">
                    <Printer size={14} />
                  </button>
                  <button onClick={() => { setForm({ id: p.id, anamnese: p.anamnese, peso: p.peso != null ? String(p.peso) : '', vacinas: p.vacinas ?? '', exames: p.exames ?? '', prescricao: p.prescricao ?? '' }); setModal(true) }}
                    className="p-1.5 rounded-lg border border-[#d4e0da] text-[#5f7a6a] hover:bg-[#f4f7f6] transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => excluir(p)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#14302b] whitespace-pre-wrap mb-2">{p.anamnese}</p>
              {p.vacinas && <p className="text-sm text-[#14302b]"><strong>Vacinas:</strong> {p.vacinas}</p>}
              {p.exames && <p className="text-sm text-[#14302b]"><strong>Exames:</strong> {p.exames}</p>}
              {p.prescricao && <p className="text-sm text-[#14302b]"><strong>Prescrição:</strong> {p.prescricao}</p>}
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
              <h2 className="text-white font-extrabold">{form.id ? '✏️ Editar prontuário' : '📋 Novo prontuário'}</h2>
              <button onClick={() => setModal(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6">
              <form onSubmit={salvar}>
                <Campo label="Anamnese / Observações clínicas *">
                  <textarea className={inp + ' resize-y min-h-[100px]'} value={form.anamnese} onChange={e => set('anamnese', e.target.value)} placeholder="Sintomas, exame físico, diagnóstico..." />
                </Campo>
                <Campo label="Peso (kg)">
                  <input className={inp} type="number" step="0.1" value={form.peso} onChange={e => set('peso', e.target.value)} placeholder="Ex.: 4.5" />
                </Campo>
                <Campo label="Vacinas aplicadas">
                  <textarea className={inp + ' resize-y min-h-[68px]'} value={form.vacinas} onChange={e => set('vacinas', e.target.value)} placeholder="Ex.: V10, Antirrábica..." />
                </Campo>
                <Campo label="Exames solicitados / resultados">
                  <textarea className={inp + ' resize-y min-h-[68px]'} value={form.exames} onChange={e => set('exames', e.target.value)} placeholder="Ex.: Hemograma completo" />
                </Campo>
                <Campo label="Prescrição / Tratamento">
                  <textarea className={inp + ' resize-y min-h-[88px]'} value={form.prescricao} onChange={e => set('prescricao', e.target.value)} placeholder="Medicamentos, dosagem, período..." />
                </Campo>
                <button type="submit" disabled={salvando} className="w-full py-3 rounded-xl bg-[#13a89e] hover:bg-[#0d8d84] text-white font-bold transition-colors disabled:opacity-60 mt-2">
                  {salvando ? 'Salvando...' : 'Salvar prontuário'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
