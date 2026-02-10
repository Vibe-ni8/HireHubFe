import './ToggleRow.css'

export default function ToggleRow({label, value, onToggle}: ToggleRowProps) {
  return (
    <div className="tr-row">
      <span>{label}</span>

      <button
        className={`tr-toggle ${value ? "on" : "off"}`}
        onClick={() => onToggle(!value)}
      >
        {value ? "Enabled" : "Disabled"}
      </button>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}