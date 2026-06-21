# Saúde Animal — Memória do Projeto

## Sobre o projeto
Sistema completo para a **Cia Pet Clínica Veterinária** de Lençóis Paulista/SP.
Veterinário responsável: **Dr. Ighor Morales**

## Stack
- **Landing page**: Next.js 16 (App Router + Turbopack) em `landing/`
- **App mobile**: Ionic + React + Capacitor em `cia-pet-app/`
- **Backend**: Supabase (Auth + Banco + Edge Functions)
- **Deploy**: Vercel (apenas `landing/`) — projeto ativo: `saude-animal-site`

## Dados da clínica
- **Telefone**: (14) 3264-7135
- **WhatsApp**: https://wa.me/551432647135
- **Endereço**: R. Rio Grande do Sul — Jardim Cruzeiro, Lençóis Paulista/SP · CEP 18680-550
- **Horários**: Seg–Sex 08h–12h · 13h30–18h | Sáb 08h–12h
- **CNPJ**: 12.624.267/0001-39
- **CRMV**: pendente (usar `CRMV-SP 00000` até confirmação)

## URLs de produção
- Site: https://saude-animal-site-lilac.vercel.app
- Repositório: https://github.com/Taioque12/saude-animal

## Vercel
- Projeto ativo: `saude-animal-site` (projeto `saude-animal` foi deletado — era duplicado com bug)
- Variáveis de ambiente necessárias: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Estrutura de pastas relevante
```
landing/
  app/
    page.tsx              # Página principal — ordem das seções
    painel/               # Painel interno (8 módulos)
    api/
      create-user/        # Cria usuário Auth + funcionarios
      delete-user/        # Exclui usuário Auth + funcionarios
  components/
    Navbar.tsx
    Hero.tsx
    Features.tsx          # id="servicos"
    Sobre.tsx             # id="sobre"
    Identidade.tsx        # id="identidade"
    AreaRestrita.tsx
    Agendamento.tsx       # id="agendamento" — cards de contato
    Footer.tsx
  lib/
    motion.ts             # Variantes de animação (fadeUp, stagger, scaleUp, slideLeft)
    supabase.ts           # Cliente Supabase client-side
```

## Convenções do projeto
- Cores: `brand-primary`, `brand-primaryDark`, `brand-primarySoft`, `brand-accent`, `ink-*`
- Animações: framer-motion com `useInView({ once: true })`
- API routes: cliente Supabase criado DENTRO do handler (lazy), nunca no nível do módulo
- Commits: português, descritivos

## Sessões anteriores
- `docs/sessoes/2026-06-20.md` — criação do projeto completo
- `docs/sessoes/2026-06-21.md` — número real, seção agendamento, fix build

## Pendências (Fase 1)
- [ ] CRMV real do Dr. Ighor Morales
- [ ] Endereço completo na seção Agendamento (já está no Footer)
- [ ] Testar criação de usuário no painel em produção
