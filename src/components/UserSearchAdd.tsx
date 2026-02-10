import './UserSearchAdd.css';
import { useEffect, useRef, useState } from "react";

interface User {
  userId: number;
  fullName: string;
  email: string;
}

interface Props {
  users: User[];
  onAdd: (user: User) => void;
}

export default function UserSearchAdd({ users, onAdd }: Props) {

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredUsers = users.filter(
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

  const handleSelect = (user: User) => {
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
    <div className="usa-wrapper" ref={wrapperRef}>
      <input type="text" placeholder="Search user and add"
        value={query} onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); setSelected(null); }}
      />
      <button className="usa-add-btn" disabled={!selected} onClick={handleAdd}>
        Add
      </button>

      {open && (
        <ul className="usa-list">
          {filteredUsers.length === 0 && (
            <li className="usa-empty">No users found</li>
          )}
          {filteredUsers.map(user => (
            <li key={user.userId} onClick={() => handleSelect(user)}>
              <div className="usa-name">{user.fullName}</div>
              <div className="usa-email">{user.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
