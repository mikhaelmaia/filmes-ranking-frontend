export default function CriterionRating({ label, weight, main, value, missing, onChange }) {
  return (
    <div className={`crit ${main ? 'main' : ''} ${missing ? 'missing' : ''}`}>
      <div>
        <div className="lbl">{label}</div>
        <div className="w">peso {Math.round(weight * 100)}%</div>
      </div>
      <div className="notes" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n}
            className={value === n ? 'on' : ''} onClick={() => onChange(n)}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
