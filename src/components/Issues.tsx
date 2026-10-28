import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Issue, IssueStatus } from '../types';
import { useAppState, useDispatch, useHousemate } from '../state/store';
import { HOUSEHOLD_CONFIG } from '../data/config';
import { describeAgo, today } from '../utils/dates';
import { Avatar } from './Avatar';

const STATUS_LABEL: Record<IssueStatus, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  resolved: 'Resolved',
};

export function Issues() {
  const { issues, household, me } = useAppState();
  const dispatch = useDispatch();
  const config = HOUSEHOLD_CONFIG[household.type];

  const [title, setTitle] = useState('');
  const [space, setSpace] = useState(config.spaces[0]);
  const [anonymous, setAnonymous] = useState(true); // anonymous by default: less confrontation
  const [sent, setSent] = useState(false);

  function report(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({
      type: 'reportIssue',
      issue: {
        id: crypto.randomUUID(),
        title: title.trim(),
        space,
        reportedBy: anonymous ? null : me,
        status: 'open',
        createdAt: today(),
      },
    });
    setTitle('');
    setSent(true);
  }

  const active = issues.filter((i) => i.status !== 'resolved');
  const resolved = issues.filter((i) => i.status === 'resolved');

  return (
    <section className="page">
      <header className="page__header">
        <h1>Shared spaces</h1>
      </header>

      <form className="card stack" onSubmit={report}>
        <h2>Report something</h2>
        <label className="field">
          <span className="field__label">What's the issue?</span>
          <input
            className="input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSent(false);
            }}
            placeholder="e.g. Dishes left in the sink overnight"
            required
          />
        </label>
        <label className="field">
          <span className="field__label">Where?</span>
          <select className="input" value={space} onChange={(e) => setSpace(e.target.value)}>
            {config.spaces.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <div className="toggle-row">
          <span id="anon-label">
            <strong>Report anonymously</strong>
            <span className="field__hint">{anonymous ? 'Your name won’t be shown.' : 'Your name will be shown.'}</span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={anonymous}
            aria-labelledby="anon-label"
            className={`switch ${anonymous ? 'is-on' : ''}`}
            onClick={() => setAnonymous((a) => !a)}
          >
            <span className="switch__thumb" />
          </button>
        </div>

        <p className="field__hint">{config.issueRouting}</p>
        <button className="button button--primary">Send report</button>
        {sent && (
          <p className="success" role="status">
            Reported{anonymous ? ' anonymously' : ''}. Thanks for flagging it.
          </p>
        )}
      </form>

      <h2 className="section-title">Active ({active.length})</h2>
      <IssueList issues={active} />

      {resolved.length > 0 && (
        <>
          <h2 className="section-title">Resolved</h2>
          <IssueList issues={resolved} />
        </>
      )}
    </section>
  );
}

function IssueList({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) return <p className="empty">All clear.</p>;
  return (
    <ul className="issue-list">
      {issues.map((issue) => (
        <IssueRow key={issue.id} issue={issue} />
      ))}
    </ul>
  );
}

function IssueRow({ issue }: { issue: Issue }) {
  const dispatch = useDispatch();
  const reporter = useHousemate(issue.reportedBy);

  return (
    <li className="issue card">
      <Avatar person={reporter} size="sm" />
      <div className="issue__main">
        <strong>{issue.title}</strong>
        <span className="muted small">
          {issue.space} · {reporter ? reporter.name : 'Anonymous'} · {describeAgo(issue.createdAt)}
        </span>
      </div>
      <select
        className={`status status--${issue.status}`}
        value={issue.status}
        aria-label={`Status of ${issue.title}`}
        onChange={(e) => dispatch({ type: 'setIssueStatus', id: issue.id, status: e.target.value as IssueStatus })}
      >
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </li>
  );
}
