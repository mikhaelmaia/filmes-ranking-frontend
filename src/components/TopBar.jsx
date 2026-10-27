export default function TopBar({ left, right }) {
  return <header className="top">{left}<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{right}</div></header>;
}

export const Brand = ({ children = 'Ranking de Filmes' }) => (
  <div className="brand"><i />{children}</div>
);
