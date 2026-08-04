export function StarInput({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Nota" style={{ display: "flex", gap: 4, fontSize: 28 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === value}
          onClick={() => onChange(star)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 0,
            color: star <= value ? "#e8503a" : "#3a3a3a",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
