import { Link } from 'react-router-dom';
import {
  REGISTRATION_CLOSED_MESSAGE,
  REGISTRATION_CLOSED_SHORT_MESSAGE,
} from '../../../config/eventStatus';
import './RegistrationsClosed.css';

export default function RegistrationsClosed({
  title = 'Registrations Closed',
  message = REGISTRATION_CLOSED_MESSAGE,
}) {
  return (
    <div className="registrations-closed-page">
      <div className="container registrations-closed-shell">
        <div className="registrations-closed-card">
          <p className="registrations-closed-eyebrow">Lumiere 2026</p>
          <h1>{title}</h1>
          <p className="registrations-closed-message">{message}</p>
          <p className="registrations-closed-short">{REGISTRATION_CLOSED_SHORT_MESSAGE}</p>

          <div className="registrations-closed-actions">
            <Link to="/" className="btn btn-primary">
              Go to Home
            </Link>
            <Link to="/schedule" className="btn btn-secondary">
              View Schedule
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}