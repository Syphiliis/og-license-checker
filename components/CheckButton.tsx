type Props = { disabled?: boolean; loading?: boolean; };

export default function CheckButton({ disabled, loading }: Props) {
  return (
    <button type="submit" className="btn" disabled={disabled}>
      {loading ? "Checking…" : "Check"}
    </button>
  );
}

