// Logo da Saúde Animal recriada em SVG (vetor) — nítida em qualquer tamanho
// e adaptável ao tema (usa as variáveis --sa-primary / --sa-accent).
// Coração formado por cão (lado teal) e gato (lado laranja), com cruz
// veterinária no topo e patinha embaixo. Trocável pela arte oficial depois.

interface LogoProps {
  size?: number;          // tamanho do ícone em px
  withText?: boolean;     // mostra o nome "Saúde Animal" ao lado/abaixo
  stacked?: boolean;      // empilha o nome embaixo do ícone
  tagline?: boolean;      // mostra "CLÍNICA VETERINÁRIA"
}

export function LogoIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 132" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Saúde Animal">
      <defs>
        <clipPath id="sa-heart">
          <path d="M60 112 C 22 84, 8 58, 26 38 C 39 24, 56 28, 60 44 C 64 28, 81 24, 94 38 C 112 58, 98 84, 60 112 Z" />
        </clipPath>
      </defs>

      {/* Metades do coração */}
      <g clipPath="url(#sa-heart)">
        <rect x="0" y="0" width="60" height="132" fill="var(--sa-primary)" />
        <rect x="60" y="0" width="60" height="132" fill="var(--sa-accent)" />
      </g>

      {/* Cão (esquerda, branco) */}
      <g fill="#fff">
        <ellipse cx="28" cy="52" rx="6.5" ry="11" transform="rotate(-28 28 52)" />
        <circle cx="41" cy="64" r="14" />
        <ellipse cx="53" cy="68" rx="8" ry="6" />
      </g>
      <circle cx="46" cy="60" r="2.4" fill="rgba(0,0,0,.32)" />
      <circle cx="58" cy="68" r="2.4" fill="rgba(0,0,0,.32)" />

      {/* Gato (direita, branco) */}
      <g fill="#fff">
        <path d="M70 54 L72.5 41 L81 51 Z" />
        <path d="M90 54 L87.5 41 L79 51 Z" />
        <circle cx="80" cy="64" r="14" />
      </g>
      <circle cx="75" cy="62" r="2.4" fill="rgba(0,0,0,.32)" />
      <path d="M80 67 l3 2 -3 1.5 -3 -1.5 Z" fill="rgba(0,0,0,.28)" />

      {/* Cruz veterinária no topo */}
      <path d="M56 12 H64 V20 H72 V28 H64 V36 H56 V28 H48 V20 H56 Z"
        fill="var(--sa-primary)" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Brilhos */}
      <path d="M40 16 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" fill="var(--sa-accent)" />
      <path d="M82 12 l1.1 2.4 2.4 1.1 -2.4 1.1 -1.1 2.4 -1.1 -2.4 -2.4 -1.1 2.4 -1.1 Z" fill="var(--sa-accent)" />

      {/* Patinha embaixo */}
      <g fill="var(--sa-accent)">
        <ellipse cx="60" cy="122" rx="6.5" ry="5" />
        <ellipse cx="50" cy="116" rx="2.6" ry="3.4" />
        <ellipse cx="56" cy="113" rx="2.6" ry="3.6" />
        <ellipse cx="64" cy="113" rx="2.6" ry="3.6" />
        <ellipse cx="70" cy="116" rx="2.6" ry="3.4" />
      </g>
    </svg>
  );
}

function Wordmark({ tagline }: { tagline?: boolean }) {
  return (
    <div style={{ lineHeight: 1.05 }}>
      <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '.2px' }}>
        <span style={{ color: 'var(--sa-primary)' }}>Saúde</span>{' '}
        <span style={{ color: 'var(--sa-accent)' }}>Animal</span>
      </div>
      {tagline && (
        <div style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '2.5px', color: 'var(--sa-text-faint)', marginTop: 3 }}>
          CLÍNICA VETERINÁRIA
        </div>
      )}
    </div>
  );
}

export default function Logo({ size = 44, withText = false, stacked = false, tagline = false }: LogoProps) {
  if (!withText) return <LogoIcon size={size} />;
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      flexDirection: stacked ? 'column' : 'row',
      gap: stacked ? 8 : 12, textAlign: stacked ? 'center' : 'left',
    }}>
      <LogoIcon size={size} />
      <Wordmark tagline={tagline} />
    </div>
  );
}
