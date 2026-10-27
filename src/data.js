// Perfis (a autenticação é feita pela API)
export const PROFILES = [
  { id: 'mik', name: 'Mik' },
  { id: 'vit', name: 'Vit' },
];

export const MAIN_CRITERION = { key: 'gostei', label: 'O quanto gostei do filme', weight: 0.5 };
export const CRITERIA = [
  ['figurino', 'Figurino'], ['sonoridade', 'Sonoridade'], ['imersao', 'Imersão'],
  ['criatividade', 'Criatividade'], ['imprevisibilidade', 'Imprevisibilidade'],
  ['enredo', 'Enredo'], ['atuacao', 'Atuação'], ['genero', 'Gênero que gosto'],
  ['cenario', 'Cenário'], ['memoria', 'Potencial de memória'],
].map(([key, label]) => ({ key, label, weight: 0.05 }));
export const ALL_CRITERIA = [MAIN_CRITERION, ...CRITERIA];

/**
 * Nota final = gostei × 0,50 + soma dos outros 10 × 0,05. Retorna null se faltar critério.
 * Usado só como prévia no formulário — a nota oficial vem da API.
 */
export function calcScore(notes) {
  if (ALL_CRITERIA.some((c) => !notes[c.key])) return null;
  return ALL_CRITERIA.reduce((s, c) => s + notes[c.key] * c.weight, 0);
}

/** Sempre 2 casas decimais. Aceita number ou string (ex.: "4.25" vindo da API). */
export const fmtScore = (n) => {
  const num = typeof n === 'number' ? n : Number(n);
  if (n == null || n === '' || !Number.isFinite(num)) return '—';
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const fmtDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '');

/** Ordenação do ranking: nota DESC, depois "gostei" DESC, depois nome A→Z. */
export function compareMovies(a, b) {
  const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const byScore = num(b.score) - num(a.score);
  if (byScore) return byScore;
  const byGostei = num(b.notes?.gostei) - num(a.notes?.gostei);
  if (byGostei) return byGostei;
  return (a.name || '').localeCompare(b.name || '', 'pt-BR');
}
