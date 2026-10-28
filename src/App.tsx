import { useState } from 'react';
import { useAppState, useDispatch } from './state/store';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Chores } from './components/Chores';
import { Issues } from './components/Issues';
import { RulesSheet } from './components/RulesSheet';

export type Tab = 'home' | 'chores' | 'issues';

const TABS: { value: Tab; label: string; icon: string }[] = [
  { value: 'home', label: 'Home', icon: '⌂' },
  { value: 'chores', label: 'Chores', icon: '✓' },
  { value: 'issues', label: 'Spaces', icon: '⚑' },
];

export default function App() {
  const { onboarded, household } = useAppState();
  const dispatch = useDispatch();
  const [tab, setTab] = useState<Tab>('home');
  const [rulesOpen, setRulesOpen] = useState(false);

  if (!onboarded) return <Onboarding />;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">⌂</span> HomeSync
        </div>
        <nav className="tabs" aria-label="Main">
          {TABS.map((t) => (
            <button
              key={t.value}
              className={`tabs__item ${tab === t.value ? 'is-active' : ''}`}
              aria-current={tab === t.value ? 'page' : undefined}
              onClick={() => setTab(t.value)}
            >
              <span className="tabs__icon" aria-hidden="true">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="topbar__actions">
          <button className="button button--small button--ghost" onClick={() => setRulesOpen(true)}>
            House rules
          </button>
          <button
            className="link-button small"
            onClick={() => {
              setTab('home');
              dispatch({ type: 'reset' });
            }}
            title={`Leave ${household.name} and restart the demo`}
          >
            Restart demo
          </button>
        </div>
      </header>

      <main className="content">
        {tab === 'home' && <Dashboard onNavigate={setTab} />}
        {tab === 'chores' && <Chores />}
        {tab === 'issues' && <Issues />}
      </main>

      <RulesSheet open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
