import Button from './Button.jsx';
import { FilmIcon } from './Icons.jsx';

export default function EmptyState({ otherName, onNew }) {
  return (
    <div style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <FilmIcon />
      <div className="d" style={{ fontSize: 28 }}>Nenhum filme ainda</div>
      <p className="muted" style={{ margin: 0, maxWidth: 320 }}>
        {otherName
          ? `${otherName} ainda não avaliou nenhum filme.`
          : 'Avalie o primeiro filme que você assistiu para começar o seu ranking.'}
      </p>
      {!otherName && <Button onClick={onNew}>+ Novo filme</Button>}
    </div>
  );
}
