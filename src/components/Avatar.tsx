import type { Housemate } from '../types';

interface Props {
  person: Housemate | null;
  size?: 'sm' | 'md';
}

// A coloured circle with the person's initial.
export function Avatar({ person, size = 'md' }: Props) {
  if (!person) {
    return (
      <span className={`avatar avatar--${size} avatar--anon`} aria-label="Anonymous">
        ?
      </span>
    );
  }
  return (
    <span
      className={`avatar avatar--${size}`}
      style={{ backgroundColor: person.colour }}
      title={person.name}
      aria-hidden="true"
    >
      {person.name.charAt(0).toUpperCase()}
    </span>
  );
}
