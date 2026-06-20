# Saúde Animal — Clínica Veterinária

Sistema completo de gestão para clínica veterinária e banho & tosa.

**Produção:** https://saude-animal-site-lilac.vercel.app  
**Backend:** Supabase (projeto `arwgvuevnguhertnbbex`)

---

## Estrutura do repositório

```
saude-animal/
├── landing/        # Site institucional + painel interno (Next.js 16)
└── cia-pet-app/    # App mobile iOS/Android (Ionic + Capacitor)
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Site & painel web | Next.js 16, Tailwind CSS, Framer Motion |
| App mobile | Ionic + Capacitor |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Deploy web | Vercel — CI/CD automático no push |
| Deploy mobile | App Store + Google Play (futuro) |

---

## Painel interno — módulos

- Dashboard com estatísticas em tempo real
- Agendamentos (Clínica e Banho & Tosa)
- Pacientes + Prontuários com receituário imprimível A4
- Tutores
- Vacinas com controle de próxima dose
- Estoque com alerta de mínimo
- Financeiro: caixa, notas fiscais e export Excel
- Usuários: criação e remoção direto no painel

---

## Variáveis de ambiente

Criar `landing/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

---

## Rodando localmente

```bash
cd landing
npm install
npm run dev
# Acesse http://localhost:3000
```

---

## Roadmap

### ✅ Fase 1 — Finalizar a base (90% pronto)
- [ ] WhatsApp e CRMV reais do Dr. Ighor Morales
- [ ] Seção de agendamento na landing page
- [ ] Testes completos em produção

### Fase 2 — Agendamento online
- [ ] Formulário público → cria agendamento no painel
- [ ] Lembrete automático via WhatsApp (Z-API / Twilio)
- [ ] E-mail de confirmação para o tutor

### Fase 3 — Portal do Tutor
- [ ] Login para tutores (área separada do painel interno)
- [ ] Visualização de prontuários, vacinas e agendamentos
- [ ] Download de receituários em PDF

### Fase 4 — Financeiro avançado
- [ ] Gráficos mensais de receita e despesas
- [ ] Integração Asaas / PagSeguro
- [ ] Alertas de estoque mínimo por WhatsApp/e-mail

### Fase 5 — App mobile
- [ ] Conectar Ionic ao Supabase de produção
- [ ] Compilar para iOS e Android com Capacitor
- [ ] Publicar na App Store e Google Play

### Fase 6 — SaaS multi-clínica
- [ ] Isolamento por clínica via Row Level Security (Supabase)
- [ ] Planos de assinatura com cobrança automática
- [ ] Onboarding automático para novas clínicas

---

## Valor comercial estimado

| Modelo | Valor |
|---|---|
| Projeto sob medida (uma clínica) | R$ 25.000 – R$ 60.000 |
| SaaS mensal por clínica | R$ 150 – R$ 500/mês |

---

*Dr. Ighor Morales · Lençóis Paulista / SP*
