// Shared types for the whole app.

export type HouseholdType = 'sharehouse' | 'college';

export interface Housemate {
  id: string;
  name: string;
  colour: string; // avatar colour
}

export interface Chore {
  id: string;
  title: string;
  area: string; // e.g. "Kitchen"
  assigneeId: string;
  dueDate: string; // ISO date, e.g. "2026-10-30"
  done: boolean;
  swapRequestTo?: string; // housemate id a swap was requested with
}

export type IssueStatus = 'open' | 'in-progress' | 'resolved';

export interface Issue {
  id: string;
  title: string;
  space: string; // shared space, e.g. "Bathroom"
  reportedBy: string | null; // null = reported anonymously
  status: IssueStatus;
  createdAt: string; // ISO date
}

export interface Household {
  name: string;
  type: HouseholdType;
  rules: string[];
}

export interface AppState {
  onboarded: boolean;
  me: string; // id of the current user
  household: Household;
  housemates: Housemate[];
  chores: Chore[];
  issues: Issue[];
}
