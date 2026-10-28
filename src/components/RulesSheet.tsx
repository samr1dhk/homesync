import { useAppState } from '../state/store';
import { HOUSEHOLD_CONFIG } from '../data/config';
import { Modal } from './Modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

// House rules stay reachable from the header after joining —
// usability testing showed people wanted to re-read them later.
export function RulesSheet({ open, onClose }: Props) {
  const { household } = useAppState();
  const config = HOUSEHOLD_CONFIG[household.type];

  return (
    <Modal open={open} title={`${household.name} rules`} onClose={onClose}>
      <p className="muted">All your {config.memberLabel} agreed to these when they joined.</p>
      <ol className="rules-list">
        {household.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
      <button className="button button--primary button--full" onClick={onClose}>
        Got it
      </button>
    </Modal>
  );
}
