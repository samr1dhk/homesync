import { useState } from 'react';
import type { FormEvent } from 'react';
import type { HouseholdType } from '../types';
import { HOUSEHOLD_CONFIG } from '../data/config';
import { createSeedState } from '../data/seed';
import { useDispatch } from '../state/store';

type Path = 'create' | 'join';
type Step = 'start' | 'name' | 'household' | 'rules';

const STEPS: Step[] = ['start', 'name', 'household', 'rules'];

const TYPE_OPTIONS: { value: HouseholdType; title: string; description: string; icon: string }[] = [
  { value: 'sharehouse', title: 'Share house', description: 'A rental you share with housemates', icon: '🏠' },
  { value: 'college', title: 'Residential college', description: 'A floor or corridor in a college', icon: '🏢' },
];

export function Onboarding() {
  const dispatch = useDispatch();

  const [step, setStep] = useState<Step>('start');
  const [path, setPath] = useState<Path>('create');
  const [name, setName] = useState('');
  const [type, setType] = useState<HouseholdType>('sharehouse');
  const [householdName, setHouseholdName] = useState('');
  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const config = HOUSEHOLD_CONFIG[type];
  const stepNumber = STEPS.indexOf(step) + 1;

  function goTo(next: Step) {
    setError('');
    setStep(next);
  }

  function submitName(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your first name.');
    goTo('household');
  }

  function submitHousehold(e: FormEvent) {
    e.preventDefault();
    if (path === 'create' && !householdName.trim()) {
      return setError(`Give your ${config.label} a name so others can find it.`);
    }
    if (path === 'join' && !/^[A-Z0-9]{6}$/.test(code)) {
      return setError('Invite codes are 6 letters or numbers, e.g. HS4K2P.');
    }
    goTo('rules');
  }

  function finish() {
    // When joining, a real app would look the household up by code.
    const finalName =
      path === 'create' ? householdName.trim() : type === 'college' ? 'Level 3, East Wing' : 'Glebe Point Rd';
    dispatch({ type: 'onboard', state: createSeedState(name.trim(), finalName, type) });
  }

  return (
    <main className="onboarding">
      <div className="onboarding__card">
        <div className="brand brand--large">
          <span className="brand__mark" aria-hidden="true">⌂</span> HomeSync
        </div>

        {step !== 'start' && (
          <div className="progress" aria-label={`Step ${stepNumber} of ${STEPS.length}`}>
            {STEPS.map((s, i) => (
              <span key={s} className={`progress__dot ${i < stepNumber ? 'is-active' : ''}`} />
            ))}
          </div>
        )}

        {step === 'start' && (
          <section className="stack">
            <h1>Living together, minus the awkward conversations.</h1>
            <p className="muted">
              Share chores fairly, keep house rules in one place, and flag problems without the confrontation.
            </p>
            <button
              className="button button--primary button--full"
              onClick={() => {
                setPath('create');
                goTo('name');
              }}
            >
              Set up a new household
            </button>
            <button
              className="button button--ghost button--full"
              onClick={() => {
                setPath('join');
                goTo('name');
              }}
            >
              I have an invite code
            </button>
          </section>
        )}

        {step === 'name' && (
          <form className="stack" onSubmit={submitName} noValidate>
            <h1>What should we call you?</h1>
            <label className="field">
              <span className="field__label">First name</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                autoComplete="given-name"
              />
            </label>
            {error && <p className="error" role="alert">{error}</p>}
            <div className="row">
              <button type="button" className="button button--ghost" onClick={() => goTo('start')}>
                Back
              </button>
              <button className="button button--primary">Continue</button>
            </div>
          </form>
        )}

        {step === 'household' && (
          <form className="stack" onSubmit={submitHousehold} noValidate>
            <h1>{path === 'create' ? 'Tell us about your home' : 'Join your household'}</h1>

            <fieldset className="choice-group">
              <legend className="field__label">Where do you live?</legend>
              {TYPE_OPTIONS.map((option) => (
                <label key={option.value} className={`choice ${type === option.value ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="household-type"
                    value={option.value}
                    checked={type === option.value}
                    onChange={() => setType(option.value)}
                  />
                  <span className="choice__icon" aria-hidden="true">{option.icon}</span>
                  <span>
                    <strong>{option.title}</strong>
                    <span className="choice__description">{option.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            {path === 'create' ? (
              <label className="field">
                <span className="field__label">Name your {config.label}</span>
                <input
                  className="input"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  placeholder={type === 'college' ? 'e.g. Level 3, East Wing' : 'e.g. Glebe Point Rd'}
                />
              </label>
            ) : (
              <label className="field">
                <span className="field__label">{type === 'college' ? 'College code' : 'Invite code'}</span>
                <input
                  className="input input--code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                  placeholder="HS4K2P"
                  inputMode="text"
                  autoCapitalize="characters"
                />
                <span className="field__hint">{config.joinHint}</span>
              </label>
            )}

            {error && <p className="error" role="alert">{error}</p>}
            <div className="row">
              <button type="button" className="button button--ghost" onClick={() => goTo('name')}>
                Back
              </button>
              <button className="button button--primary">Continue</button>
            </div>
          </form>
        )}

        {step === 'rules' && (
          <section className="stack">
            <h1>Your {config.label} rules</h1>
            <p className="muted">
              {path === 'create'
                ? `We've started you with common rules. Your ${config.memberLabel} will agree to these when they join.`
                : `Everyone on your ${config.label} has agreed to these. You can re-read them any time.`}
            </p>
            <ol className="rules-list">
              {config.defaultRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
            <label className="checkbox">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>I've read these and I'm happy to follow them</span>
            </label>
            <div className="row">
              <button type="button" className="button button--ghost" onClick={() => goTo('household')}>
                Back
              </button>
              <button className="button button--primary" disabled={!agreed} onClick={finish}>
                Enter HomeSync
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
