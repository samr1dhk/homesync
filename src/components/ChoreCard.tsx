import type { Chore } from '../types';
import { useAppState, useDispatch, useHousemate } from '../state/store';
import { daysUntil, describeDue } from '../utils/dates';
import { Avatar } from './Avatar';

interface Props {
  chore: Chore;
  onRequestSwap?: (chore: Chore) => void;
}

export function ChoreCard({ chore, onRequestSwap }: Props) {
  const { me } = useAppState();
  const dispatch = useDispatch();
  const assignee = useHousemate(chore.assigneeId);
  const swapWith = useHousemate(chore.swapRequestTo ?? null);

  const isMine = chore.assigneeId === me;
  const overdue = !chore.done && daysUntil(chore.dueDate) < 0;
  const checkboxId = `chore-${chore.id}`;

  return (
    <li className={`chore ${chore.done ? 'is-done' : ''} ${overdue ? 'is-overdue' : ''}`}>
      <input
        id={checkboxId}
        type="checkbox"
        className="chore__check"
        checked={chore.done}
        onChange={() => dispatch({ type: 'toggleChore', id: chore.id })}
      />
      <div className="chore__main">
        <label htmlFor={checkboxId} className="chore__title">
          {chore.title}
        </label>
        <div className="chore__meta">
          <span className="tag">{chore.area}</span>
          <span className={overdue ? 'text-danger' : ''}>{chore.done ? 'Done' : describeDue(chore.dueDate)}</span>
          {!isMine && assignee && <span>· {assignee.name}</span>}
        </div>

        {/* Swap status for my own chores */}
        {isMine && !chore.done && swapWith && (
          <div className="chore__swap">
            Swap requested with {swapWith.name}
            <button className="link-button" onClick={() => dispatch({ type: 'cancelSwap', id: chore.id })}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="chore__side">
        {isMine && !chore.done && !swapWith && onRequestSwap && (
          <button className="button button--small button--ghost" onClick={() => onRequestSwap(chore)}>
            Swap
          </button>
        )}
        <Avatar person={assignee} size="sm" />
      </div>
    </li>
  );
}
