// Controle de tema claro/escuro.
// O tema é aplicado por classes no <html>: `.dark` (tokens --sa-*) e
// `.ion-palette-dark` (componentes Ionic). A escolha do usuário fica no
// localStorage; sem escolha, segue a preferência do aparelho.

const KEY = 'sa-tema';
export type Tema = 'claro' | 'escuro';

export function temaAtual(): Tema {
  const salvo = localStorage.getItem(KEY);
  if (salvo === 'claro' || salvo === 'escuro') return salvo;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
}

export function aplicarTema(t: Tema) {
  const escuro = t === 'escuro';
  document.documentElement.classList.toggle('dark', escuro);
  document.documentElement.classList.toggle('ion-palette-dark', escuro);
}

export function alternarTema(): Tema {
  const novo: Tema = temaAtual() === 'escuro' ? 'claro' : 'escuro';
  localStorage.setItem(KEY, novo);
  aplicarTema(novo);
  return novo;
}

// Aplica o tema salvo/sistema no carregamento da app.
export function initTema() {
  aplicarTema(temaAtual());
}
