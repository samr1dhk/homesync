import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { AppState, Chore, Issue, IssueStatus } from '../types';

// ---------------------------------------------------------------------------
// Actions: every way the app's data can change.
// ---------------------------------------------------------------------------
export type Action =
  | { type: 'onboard'; state: AppState }
  | { type: 'toggleChore'; id: string }
  | { type: 'addChore'; chore: Chore }
  | { type: 'requestSwap'; id: string; to: string }
  | { type: 'cancelSwap'; id: string }
  | { type: 'acceptSwap'; id: string }
  | { type: 'reportIssue'; issue: Issue }
  | { type: 'setIssueStatus'; id: string; status: IssueStatus }
  | { type: 'reset' };

const STORAGE_KEY = 'homesync-state-v1';

const emptyState: AppState = {
  onboarded: false,
  me: 'me',
  household: { name: '', type: 'sharehouse', rules: [] },
  housemates: [],
  chores: [],
  issues: [],
};

// Helper: update one chore by id without touching the others.
function updateChore(state: AppState, id: string, change: (c: Chore) => Chore): AppState {
  return { ...state, chores: state.chores.map((c) => (c.id === id ? change(c) : c)) };
}

// The reducer is a pure function: (old state, action) => new state.
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'onboard':
      return action.state;
    case 'toggleChore':
      return updateChore(state, action.id, (c) => ({ ...c, done: !c.done }));
    case 'addChore':
      return { ...state, chores: [...state.chores, action.chore] };
    case 'requestSwap':
      return updateChore(state, action.id, (c) => ({ ...c, swapRequestTo: action.to }));
    case 'cancelSwap':
      return updateChore(state, action.id, (c) => ({ ...c, swapRequestTo: undefined }));
    case 'acceptSwap':
      return updateChore(state, action.id, (c) => ({
        ...c,
        assigneeId: c.swapRequestTo ?? c.assigneeId,
        swapRequestTo: undefined,
      }));
    case 'reportIssue':
      return { ...state, issues: [action.issue, ...state.issues] };
    case 'setIssueStatus':
      return {
        ...state,
        issues: state.issues.map((i) => (i.id === action.id ? { ...i, status: action.status } : i)),
      };
    case 'reset':
      return emptyState;
  }
}

// Load saved data from the browser, falling back to an empty app.
function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as AppState) : emptyState;
  } catch {
    return emptyState;
  }
}

// ---------------------------------------------------------------------------
// Context: lets any component read the state and dispatch actions
// without passing props down through every level.
// ---------------------------------------------------------------------------
const StateContext = createContext<AppState | null>(null);
const DispatchContext = createContext<Dispatch<Action> | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Save to the browser whenever the state changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (e.g. private browsing); the app still works.
    }
  }, [state]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState(): AppState {
  const state = useContext(StateContext);
  if (!state) throw new Error('useAppState must be used inside <StoreProvider>');
  return state;
}

export function useDispatch(): Dispatch<Action> {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) throw new Error('useDispatch must be used inside <StoreProvider>');
  return dispatch;
}

// Convenience lookup used by lots of components.
export function useHousemate(id: string | null) {
  const { housemates } = useAppState();
  return housemates.find((h) => h.id === id) ?? null;
}
