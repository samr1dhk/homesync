import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Chore } from '../types';
import { useAppState, useDispatch } from '../state/store';
import { daysFromToday, daysUntil } from '../utils/dates';
import { ChoreCard } from './ChoreCard';
import { SwapDialog } from './SwapDialog';

type Filter = 'mine' | 'everyone' | 'overdue';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'mine', label: 'Mine' },
  { value: 'everyone', label: 'Everyone' },
  { value: 'overdue', label: 'Overdue' },
];

export function Chores() {
  const { chores, me, housemates } = useAppState();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<Filter>('mine');
  const [swapChore, setSwapChore] = useState<Chore | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form fields for adding a chore
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('Kitchen');
  const [assigneeId, setAssigneeId] = useState(me);
  const [dueDate, setDueDate] = useState(daysFromToday(3));

  const visible = chores
    .filter((c) => {
      if (filter === 'mine') return c.assigneeId === me;
      if (filter === 'overdue') return !c.done && daysUntil(c.dueDate) < 0;
      return true;
    })
    // Unfinished first, then soonest due date first.
    .sort((a, b) => Number(a.done) - Number(b.done) || a.dueDate.localeCompare(b.dueDate));

  function addChore(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({
      type: 'addChore',
      chore: { id: crypto.randomUUID(), title: title.trim(), area, assigneeId, dueDate, done: false },
    });
    setTitle('');
    setShowForm(false);
  }

  return (
    <section className="page">
      <header className="page__header">
        <h1>Chores</h1>
        <button className="button button--primary" onClick={() => setShowForm((s) => !s)} aria-expanded={showForm}>
          {showForm ? 'Close' : '+ Add chore'}
        </button>
      </header>

      {showForm && (
        <form className="card form-grid" onSubmit={addChore}>
          <label className="field form-grid__wide">
            <span className="field__label">What needs doing?</span>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
          </label>
          <label className="field">
            <span className="field__label">Area</span>
            <select className="input" value={area} onChange={(e) => setArea(e.target.value)}>
              {['Kitchen', 'Bathroom', 'Living room', 'Laundry', 'Outside'].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Assigned to</span>
            <select className="input" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
              {housemates.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.id === me ? `${h.name} (you)` : h.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Due</span>
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
          <button className="button button--primary form-grid__submit">Add chore</button>
        </form>
      )}

      <div className="segmented" role="group" aria-label="Filter chores">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`segmented__item ${filter === f.value ? 'is-active' : ''}`}
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty">Nothing here. Nice work! 🎉</p>
      ) : (
        <ul className="chore-list">
          {visible.map((chore) => (
            <ChoreCard key={chore.id} chore={chore} onRequestSwap={setSwapChore} />
          ))}
        </ul>
      )}

      <SwapDialog chore={swapChore} onClose={() => setSwapChore(null)} />
    </section>
  );
}
