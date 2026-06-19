import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupIonicReact } from '@ionic/react';
import App from './App.tsx';
import { AuthProvider } from './auth';

/* CSS base do Ionic (obrigatórios) */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';

/* Modo escuro dos componentes Ionic (ativado pela classe .ion-palette-dark) */
import '@ionic/react/css/palettes/dark.class.css';

/* Tema da Saúde Animal */
import './theme.css';
import { initTema } from './theme';

initTema();
setupIonicReact();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
