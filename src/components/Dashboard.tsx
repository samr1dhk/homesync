import { useAppState, useDispatch } from '../state/store';
import { HOUSEHOLD_CONFIG } from '../data/config';
import { daysUntil } from '../utils/dates';
import { Avatar } from './Avatar';
import { ChoreCard } from './ChoreCard';
import type { Tab } from '../App';

interface Props {
  onNavigate: (tab: Tab) => void;
}

export function Dashboard({ onNavigate }: Props) {
  const { chores, housemates, issues, me, household } = useAppState();
  const dispatch = useDispatch();
  const config = HOUSEHOLD_CONFIG[household.type];

  const myName = housemates.find((h) => h.id === me)?.name ?? '';
  const myOpen = chores
    .filter((c) => c.assigneeId === me && !c.done)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const dueSoon = myOpen.filter((c) => daysUntil(c.dueDate) <= 2);
  const incomingSwaps = chores.filter((c) => c.swapRequestTo === me && !c.done);
  const openIssues = issues.filter((i) => i.status !== 'resolved').length;

  // Share of chores per person: how many they have, and how many are done.
  const load = housemates.map((person) => {
    const theirs = chores.filter((c) => c.assigneeId === person.id);
    return { person, total: theirs.length, done: theirs.filter((c) => c.done).length };
  });
  const maxTotal = Math.max(1, ...load.map((l) => l.total));

  return (
    <section className="page">
      <header className="hero">
        <p className="hero__eyebrow">{household.name}</p>
        <h1>Hi {myName} 👋</h1>
        <p className="muted">
          {dueSoon.length === 0
            ? 'You’re all caught up for the next couple of days.'
            : `You have ${dueSoon.length} chore${dueSoon.length > 1 ? 's' : ''} due in the next two days.`}
        </p>
      </header>

      {incomingSwaps.map((chore) => {
        const from = housemates.find((h) => h.id === chore.assigneeId);
        return (
          <div key={chore.id} className="card notice" role="status">
            <Avatar person={from ?? null} size="sm" />
            <p className="notice__text">
              <strong>{from?.name}</strong> asked to swap <strong>{chore.title.toLowerCase()}</strong> with you.
            </p>
            <div className="row">
              <button className="button button--small button--ghost" onClick={() => dispatch({ type: 'cancelSwap', id: chore.id })}>
                Decline
              </button>
              <button className="button button--small button--primary" onClick={() => dispatch({ type: 'acceptSwap', id: chore.id })}>
                Accept
              </button>
            </div>
          </div>
        );
      })}

      <div className="dashboard-grid">
        <article className="card">
          <header className="card__header">
            <h2>Your chores</h2>
            <button className="link-button" onClick={() => onNavigate('chores')}>
              See all
            </button>
          </header>
          {myOpen.length === 0 ? (
            <p className="empty">Nothing left on your list. 🎉</p>
          ) : (
            <ul className="chore-list chore-list--compact">
              {myOpen.slice(0, 4).map((chore) => (
                <ChoreCard key={chore.id} chore={chore} />
              ))}
            </ul>
          )}
        </article>

        <article className="card">
          <header className="card__header">
            <h2>Shared load</h2>
          </header>
          <p className="muted small">Chores done out of chores assigned, across your {config.memberLabel}.</p>
          <ul className="load-list">
            {load.map(({ person, total, done }) => (
              <li key={person.id} className="load">
                <Avatar person={person} size="sm" />
                <span className="load__name">{person.id === me ? 'You' : person.name}</span>
                <span
                  className="load__bar"
                  role="img"
                  aria-label={`${done} of ${total} chores done`}
                  style={{ width: `${(total / maxTotal) * 100}%` }}
                >
                  <span className="load__fill" style={{ width: total ? `${(done / total) * 100}%` : 0 }} />
                </span>
                <span className="load__count">
                  {done}/{total}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card card--accent">
          <h2>Shared spaces</h2>
          <p className="stat">{openIssues}</p>
          <p className="muted small">open {openIssues === 1 ? 'issue' : 'issues'} across the {config.label}</p>
          <button className="button button--ghost button--full" onClick={() => onNavigate('issues')}>
            View or report
          </button>
        </article>
      </div>
    </section>
  );
}
