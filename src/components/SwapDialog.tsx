import { useState } from 'react';
import type { Chore } from '../types';
import { useAppState, useDispatch } from '../state/store';
import { Avatar } from './Avatar';
import { Modal } from './Modal';

interface Props {
  chore: Chore | null; // null = dialog closed
  onClose: () => void;
}

// Lets you choose exactly who to ask for a swap, instead of
// broadcasting the request to the whole household.
export function SwapDialog({ chore, onClose }: Props) {
  const { housemates, me, chores } = useAppState();
  const dispatch = useDispatch();
  const [recipient, setRecipient] = useState<string>('');

  const others = housemates.filter((h) => h.id !== me);

  // How many open chores each person has, so you can pick someone fairly.
  const openCount = (id: string) => chores.filter((c) => c.assigneeId === id && !c.done).length;

  function close() {
    setRecipient('');
    onClose();
  }

  function send() {
    if (!chore || !recipient) return;
    dispatch({ type: 'requestSwap', id: chore.id, to: recipient });
    close();
  }

  return (
    <Modal open={chore !== null} title="Ask for a swap" onClose={close}>
      {chore && (
        <div className="stack">
          <p className="muted">
            Who would you like to swap <strong>{chore.title.toLowerCase()}</strong> with? Only they will see the
            request.
          </p>
          <fieldset className="choice-group">
            <legend className="visually-hidden">Choose a housemate</legend>
            {others.map((person) => (
              <label key={person.id} className={`choice ${recipient === person.id ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="swap-recipient"
                  value={person.id}
                  checked={recipient === person.id}
                  onChange={() => setRecipient(person.id)}
                />
                <Avatar person={person} size="sm" />
                <span>
                  <strong>{person.name}</strong>
                  <span className="choice__description">{openCount(person.id)} open chores</span>
                </span>
              </label>
            ))}
          </fieldset>
          <button className="button button--primary button--full" disabled={!recipient} onClick={send}>
            Send request
          </button>
        </div>
      )}
    </Modal>
  );
}
