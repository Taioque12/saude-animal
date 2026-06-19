import { useState } from 'react';
import { alternarTema, temaAtual, type Tema } from '../theme';

// Botão de alternar entre claro e escuro. Estilizado para o menu lateral
// (fundo escuro). O tema é aplicado por classes no <html>, então o resto
// da interface se atualiza sozinho via variáveis CSS.
export default function ThemeToggle() {
  const [tema, setTema] = useState<Tema>(temaAtual());

  return (
    <button
      onClick={() => setTema(alternarTema())}
      style={{
        width: '100%', padding: '11px', borderRadius: 10,
        background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
        color: 'rgba(255,255,255,.6)', fontSize: '.9rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'inherit', marginBottom: 8,
      }}
    >
      {tema === 'escuro' ? '☀️ Modo claro' : '🌙 Modo escuro'}
    </button>
  );
}
