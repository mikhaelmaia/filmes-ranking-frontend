export default function ProfileCard({ name, selected, onSelect }) {
  return (
    <button type="button" className={`profile ${selected ? 'on' : ''}`} aria-pressed={selected} onClick={onSelect}>
      <span className="ini">{name[0]}</span>
      <span className="nm">{name}</span>
    </button>
  );
}
