import './CandidateSearchAdd.css';
import { useEffect, useRef, useState } from "react";

interface Candidate {
  candidateId: number;
  fullName: string;
  email: string;
}

interface Props {
  candidates: Candidate[];
  onAdd: (candidate: Candidate) => void;
}

export default function CandidateSearchAdd({ candidates, onAdd }: Props) {

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredUsers = candidates.filter(
    u =>
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (user: Candidate) => {
    setSelected(user);
    setQuery(user.fullName);
    setOpen(false);
  };

  const handleAdd = () => {
    if (!selected) return;
    onAdd(selected);
    setSelected(null);
    setQuery("");
  };

  return (
    <div className="csa-wrapper" ref={wrapperRef}>
      <input type="text" placeholder="Search candidate and add"
        value={query} onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); setSelected(null); }}
      />
      <button className="csa-add-btn" disabled={!selected} onClick={handleAdd}>
        Add
      </button>

      {open && (
        <ul className="csa-list">
          {filteredUsers.length === 0 && (
            <li className="csa-empty">No candidates found</li>
          )}
          {filteredUsers.map(candidate => (
            <li key={candidate.candidateId} onClick={() => handleSelect(candidate)}>
              <div className="csa-name">{candidate.fullName}</div>
              <div className="csa-email">{candidate.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
