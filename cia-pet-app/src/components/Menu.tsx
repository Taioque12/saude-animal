import { IonContent, IonMenu, IonMenuToggle } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const paginas = [
  { titulo: 'Painel',        url: '/dashboard',   emoji: '📊' },
  { titulo: 'Agendamentos',  url: '/agendamentos',emoji: '📅' },
  { titulo: 'Pacientes',     url: '/pacientes',   emoji: '🐾' },
  { titulo: 'Vacinas',       url: '/vacinas',     emoji: '💉' },
  { titulo: 'Tutores',       url: '/tutores',     emoji: '👥' },
  { titulo: 'Estoque',       url: '/estoque',     emoji: '📦' },
  { titulo: 'Financeiro',    url: '/financeiro',  emoji: '💰' },
  { titulo: 'Usuários',      url: '/usuarios',    emoji: '🔑' },
];

export default function Menu() {
  const location = useLocation();
  const history = useHistory();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent style={{ '--background': 'var(--sa-sidebar)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--sa-sidebar)' }}>

          {/* Logo */}
          <div style={{ padding: '24px 18px 18px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Logo size={46} />
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.15 }}>
                  Saúde Animal
                </div>
                <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '.68rem', letterSpacing: 1.5, fontWeight: 600 }}>
                  CLÍNICA VETERINÁRIA
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px 12px' }}>
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, padding: '8px 8px 4px' }}>
              Navegação
            </div>
            {paginas.map((p) => {
              const ativo = location.pathname === p.url;
              return (
                <IonMenuToggle key={p.url} autoHide={false}>
                  <a
                    href={p.url}
                    onClick={e => { e.preventDefault(); history.push(p.url); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px', borderRadius: 10, marginBottom: 4,
                      background: ativo ? 'rgba(19,168,158,.22)' : 'transparent',
                      border: ativo ? '1px solid rgba(19,168,158,.45)' : '1px solid transparent',
                      textDecoration: 'none', cursor: 'pointer', transition: 'all .15s',
                    }}
                  >
                    <span style={{ fontSize: 17 }}>{p.emoji}</span>
                    <span style={{
                      color: ativo ? '#3fd0c4' : 'rgba(255,255,255,.7)',
                      fontWeight: ativo ? 700 : 400, fontSize: '.92rem',
                    }}>{p.titulo}</span>
                    {ativo && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--sa-primary)' }} />}
                  </a>
                </IonMenuToggle>
              );
            })}
          </nav>

          {/* Tema + Logout */}
          <div style={{ padding: '12px 12px 28px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
            <ThemeToggle />
            <button
              onClick={() => supabase.auth.signOut()}
              style={{
                width: '100%', padding: '11px', borderRadius: 10,
                background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
                color: 'rgba(255,255,255,.6)', fontSize: '.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all .15s', fontFamily: 'inherit',
              }}
            >
              🚪 Sair da conta
            </button>
          </div>
        </div>
      </IonContent>
    </IonMenu>
  );
}
