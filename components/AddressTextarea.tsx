type Props = {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
};

export default function AddressTextarea({
  id, value, onChange, placeholder, ariaInvalid, ariaDescribedBy
}: Props) {
  return (
    <textarea
      id={id}
      className="textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck={false}
      inputMode="text"
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
    />
  );
}

