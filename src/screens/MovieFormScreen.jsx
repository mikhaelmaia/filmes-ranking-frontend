import { useState } from 'react';
import TopBar, { Brand } from '../components/TopBar.jsx';
import Button from '../components/Button.jsx';
import CriterionRating from '../components/CriterionRating.jsx';
import ScoreBadge from '../components/ScoreBadge.jsx';
import { MAIN_CRITERION, CRITERIA, calcScore } from '../data.js';

const today = () => new Date().toISOString().slice(0, 10);

export default function MovieFormScreen({ movie, onSave, onCancel }) {
  const [name, setName] = useState(movie?.name ?? '');
  const [date, setDate] = useState(movie?.date ?? today());
  const [comment, setComment] = useState(movie?.comment ?? '');
  const [notes, setNotes] = useState(movie?.notes ?? {});
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  const score = calcScore(notes); // só prévia — a nota oficial vem da API
  const valid = name.trim() && date && score != null;
  const setNote = (key) => (n) => setNotes((prev) => ({ ...prev, [key]: n }));

  const submit = async (e) => {
    e.preventDefault();
    setTried(true);
    if (!valid || saving) return;
    setApiError(null);
    setSaving(true);
    try {
      await onSave(movie?.id, { name: name.trim(), date, comment: comment.trim(), notes });
    } catch (err) {
      if (err?.status !== 401) setApiError(err?.message || 'Não foi possível salvar. Tente de novo.');
      setSaving(false);
    }
  };

  return (
    <>
      <TopBar left={<Brand>{movie ? 'Editar filme' : 'Novo filme'}</Brand>} right={<Button variant="ghost" onClick={onCancel} disabled={saving}>Cancelar</Button>} />
      <form className="wrap" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="field">
          <label htmlFor="nome">Nome do filme</label>
          <input id="nome" className={`input ${tried && !name.trim() ? 'err' : ''}`} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field" style={{ maxWidth: 260 }}>
          <label htmlFor="data">Data em que assistiu</label>
          <input id="data" type="date" className="input" max={today()} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="coment">Comentário <span className="muted" style={{ fontWeight: 400 }}>(opcional)</span></label>
          <textarea id="coment" className="input" value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>

        <div style={{ position: 'sticky', top: 0, zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 16px', background: 'var(--bg-100)', border: '1px solid var(--gold)', borderRadius: 'var(--radius-md)' }}>
          <div><div style={{ fontWeight: 600 }}>Nota final</div><div className="cap">Atualiza enquanto você avalia</div></div>
          <ScoreBadge value={score} size={48} />
        </div>

        <CriterionRating main {...MAIN_CRITERION} value={notes[MAIN_CRITERION.key]}
          missing={tried && !notes[MAIN_CRITERION.key]} onChange={setNote(MAIN_CRITERION.key)} />
        {CRITERIA.map((c) => (
          <CriterionRating key={c.key} {...c} value={notes[c.key]} missing={tried && !notes[c.key]} onChange={setNote(c.key)} />
        ))}

        {tried && !valid && <div className="err-msg" role="alert">Preencha o nome e dê nota a todos os critérios.</div>}
        {apiError && <div className="err-msg" role="alert">{apiError}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8 }}>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</Button>
        </div>
      </form>
    </>
  );
}
