import type { AppState, HouseholdType } from '../types';
import { HOUSEHOLD_CONFIG } from './config';
import { daysFromToday } from '../utils/dates';

// Demo data so the app looks lived-in straight after onboarding.
// Dates are relative to today, so the demo never goes stale.
export function createSeedState(
  myName: string,
  householdName: string,
  type: HouseholdType,
): AppState {
  const config = HOUSEHOLD_CONFIG[type];

  return {
    onboarded: true,
    me: 'me',
    household: {
      name: householdName,
      type,
      rules: config.defaultRules,
    },
    housemates: [
      { id: 'me', name: myName, colour: '#2f6f5e' },
      { id: 'priya', name: 'Priya', colour: '#c0603c' },
      { id: 'meera', name: 'Meera', colour: '#6b5ca5' },
      { id: 'liam', name: 'Liam', colour: '#b08a1e' },
    ],
    chores: [
      { id: 'c1', title: 'Take the bins out', area: 'Outside', assigneeId: 'me', dueDate: daysFromToday(0), done: false },
      { id: 'c2', title: 'Wipe kitchen benches', area: 'Kitchen', assigneeId: 'me', dueDate: daysFromToday(2), done: false },
      { id: 'c3', title: 'Vacuum living room', area: 'Living room', assigneeId: 'priya', dueDate: daysFromToday(-1), done: false },
      { id: 'c4', title: 'Clean bathroom', area: 'Bathroom', assigneeId: 'meera', dueDate: daysFromToday(1), done: false, swapRequestTo: 'me' },
      { id: 'c5', title: 'Mop kitchen floor', area: 'Kitchen', assigneeId: 'liam', dueDate: daysFromToday(-2), done: true },
      { id: 'c6', title: 'Restock toilet paper', area: 'Bathroom', assigneeId: 'priya', dueDate: daysFromToday(-3), done: true },
      { id: 'c7', title: 'Clean out fridge', area: 'Kitchen', assigneeId: 'me', dueDate: daysFromToday(-2), done: true },
      { id: 'c8', title: 'Water the plants', area: 'Living room', assigneeId: 'liam', dueDate: daysFromToday(3), done: false },
    ],
    issues: [
      { id: 'i1', title: 'Heater isn’t turning on', space: config.spaces[1], reportedBy: null, status: 'open', createdAt: daysFromToday(-2) },
      { id: 'i2', title: 'Dishwasher leaves dishes greasy', space: config.spaces[0], reportedBy: 'liam', status: 'in-progress', createdAt: daysFromToday(-5) },
      { id: 'i3', title: 'Laundry light flickering', space: 'Laundry', reportedBy: 'meera', status: 'resolved', createdAt: daysFromToday(-9) },
    ],
  };
}
