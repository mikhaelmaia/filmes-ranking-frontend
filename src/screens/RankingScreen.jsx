import TopBar, { Brand } from '../components/TopBar.jsx';
import Button from '../components/Button.jsx';
import RankingItem from '../components/RankingItem.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { compareMovies } from '../data.js';

export default function RankingScreen({ me, other, viewing, setViewing, movies, onNew, onOpen, onEdit, onDelete, onLogout }) {
  const readOnly = viewing !== me.id;
  const list = movies.filter((m) => m.owner === viewing).sort(compareMovies);

  return (
    <>
      <TopBar left={<Brand />} right={<><span className="cap">{me.name}</span><Button variant="ghost" onClick={onLogout}>Sair</Button></>} />
      <main className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <div className="seg" role="tablist">
            <button role="tab" aria-selected={!readOnly} className={!readOnly ? 'on' : ''} onClick={() => setViewing(me.id)}>Meu ranking</button>
            <button role="tab" aria-selected={readOnly} className={readOnly ? 'on' : ''} onClick={() => setViewing(other.id)}>Ranking do {other.name}</button>
          </div>
          {!readOnly && <Button onClick={onNew}>+ Novo filme</Button>}
        </div>

        {list.length === 0 ? (
          <EmptyState otherName={readOnly ? other.name : null} onNew={onNew} />
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {list.map((m, i) => (
                <RankingItem key={m.id} position={i + 1} movie={m} readOnly={readOnly}
                  onOpen={() => onOpen(m.id)} onEdit={() => onEdit(m.id)} onDelete={() => onDelete(m.id)} />
              ))}
            </div>
            <div className="cap" style={{ textAlign: 'center', marginTop: 16 }}>
              {list.length} {list.length === 1 ? 'filme' : 'filmes'} · ordenado da maior para a menor nota
            </div>
          </>
        )}
      </main>
    </>
  );
}
