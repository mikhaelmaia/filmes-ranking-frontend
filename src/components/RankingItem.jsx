import ScoreBadge from './ScoreBadge.jsx';
import { IconButton } from './Button.jsx';
import { PencilIcon, TrashIcon } from './Icons.jsx';
import { fmtDate } from '../data.js';

export default function RankingItem({ position, movie, readOnly, onOpen, onEdit, onDelete }) {
  const top = position <= 3 ? `top${position}` : '';
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
  return (
    <div className={`item ${top}`} role="button" tabIndex={0} onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}>
      <div className="pos">#{position}</div>
      <div style={{ minWidth: 0 }}>
        <div className="name">{movie.name}</div>
        <div className="cap">Assistido em {fmtDate(movie.date)}</div>
      </div>
      <ScoreBadge value={movie.score} />
      {!readOnly && (
        <div className="acts">
          <IconButton label="Editar" onClick={stop(onEdit)}><PencilIcon /></IconButton>
          <IconButton danger label="Excluir" onClick={stop(onDelete)}><TrashIcon /></IconButton>
        </div>
      )}
    </div>
  );
}
