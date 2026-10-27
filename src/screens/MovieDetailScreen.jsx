import TopBar from '../components/TopBar.jsx';
import Button, { IconButton } from '../components/Button.jsx';
import ScoreBadge from '../components/ScoreBadge.jsx';
import { PencilIcon, TrashIcon } from '../components/Icons.jsx';
import { MAIN_CRITERION, CRITERIA, fmtDate } from '../data.js';

const POS_COLOR = { 1: 'var(--gold)', 2: 'var(--silver)', 3: 'var(--bronze)' };

function Bar({ label, value, main }) {
  return (
    <div className="bar" style={main ? { fontWeight: 700 } : undefined}>
      <span>{label}{main && <span className="cap" style={{ color: 'var(--gold)' }}> 50%</span>}</span>
      <div className="tr" style={main ? { height: 12 } : undefined}><i style={{ width: `${value * 20}%` }} /></div>
      <b>{value}</b>
    </div>
  );
}

export default function MovieDetailScreen({ movie, position, ownerName, readOnly, onBack, onEdit, onDelete }) {
  return (
    <>
      <TopBar
        left={<button className="back" onClick={onBack}>← Voltar ao ranking</button>}
        right={!readOnly && <>
          <IconButton label="Editar" onClick={onEdit}><PencilIcon /></IconButton>
          <IconButton danger label="Excluir" onClick={onDelete}><TrashIcon /></IconButton>
        </>}
      />
      <main className="wrap">
        <div className="cap" style={{ color: POS_COLOR[position] }}>#{position} NO RANKING DO {ownerName.toUpperCase()}</div>
        <h1 style={{ margin: '4px 0', fontSize: 28, lineHeight: '34px' }}>{movie.name}</h1>
        <div className="cap">Assistido em {fmtDate(movie.date)}</div>

        <div style={{ margin: '24px 0' }}><ScoreBadge value={movie.score} size={72} outOf /></div>

        {movie.comment && (
          <blockquote style={{ margin: '0 0 28px', padding: '14px 16px', background: 'var(--bg-100)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)' }}>
            “{movie.comment}”
          </blockquote>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Bar main label="O quanto gostei" value={movie.notes[MAIN_CRITERION.key]} />
          {CRITERIA.map((c) => <Bar key={c.key} label={c.label} value={movie.notes[c.key]} />)}
        </div>
        {readOnly && <div style={{ marginTop: 24 }}><Button variant="secondary" onClick={onBack}>Voltar</Button></div>}
      </main>
    </>
  );
}
