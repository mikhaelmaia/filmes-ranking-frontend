import { fmtScore } from '../data.js';

export default function ScoreBadge({ value, size, outOf }) {
  return (
    <div className="score" style={size ? { fontSize: size } : undefined}>
      {fmtScore(value)}
      {outOf && <small>/ 5</small>}
    </div>
  );
}
