import { useEffect, useRef } from 'react';
import Button from './Button.jsx';

export default function ConfirmModal({ movieName, busy, error, onCancel, onConfirm }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="del-title" onClick={(e) => e.stopPropagation()}>
        <h3 id="del-title">Excluir filme?</h3>
        <p className="muted" style={{ margin: 0 }}>
          “{movieName}” será removido do seu ranking. Essa ação não pode ser desfeita.
        </p>
        {error && <div className="err-msg" role="alert">{error}</div>}
        <div className="row">
          <Button variant="secondary" ref={cancelRef} onClick={onCancel} disabled={busy}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>{busy ? 'Excluindo…' : 'Excluir'}</Button>
        </div>
      </div>
    </div>
  );
}
