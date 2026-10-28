import type { HouseholdType } from '../types';

// Everything that changes depending on the household type lives here,
// so components never need `if (type === 'college')` checks scattered around.
export interface HouseholdConfig {
  label: string; // what we call the household
  memberLabel: string; // what we call the people in it
  joinHint: string;
  issueRouting: string; // who sees a reported issue
  spaces: string[]; // shared spaces you can report issues in
  defaultRules: string[];
}

export const HOUSEHOLD_CONFIG: Record<HouseholdType, HouseholdConfig> = {
  sharehouse: {
    label: 'house',
    memberLabel: 'housemates',
    joinHint: 'Ask whoever set up the house for the 6-character invite code.',
    issueRouting: 'Your housemates will see this on the shared board.',
    spaces: ['Kitchen', 'Bathroom', 'Living room', 'Laundry', 'Backyard'],
    defaultRules: [
      'Dishes are washed or in the dishwasher before bed.',
      'Quiet hours are 10pm to 7am on weeknights.',
      'Give a day’s notice before having guests stay over.',
      'Bins go out on Sunday night.',
    ],
  },
  college: {
    label: 'floor',
    memberLabel: 'floormates',
    joinHint: 'Your college code is on your welcome email from the residential team.',
    issueRouting: 'Your RA and the facilities team will be notified.',
    spaces: ['Floor kitchen', 'Common room', 'Bathrooms', 'Corridor', 'Laundry'],
    defaultRules: [
      'Label your food in the shared fridge.',
      'Common room closes at midnight.',
      'Clean the floor kitchen straight after cooking.',
      'Report broken appliances to your RA, don’t fix them yourself.',
    ],
  },
};
