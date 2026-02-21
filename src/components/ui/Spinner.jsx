import PropTypes from 'prop-types';
import './Spinner.css';

/**
 * Spinner Component
 * Loading spinner with multiple sizes and variants
 */
const Spinner = ({
  size = 'medium',
  variant = 'default',
  className = '',
  label = 'Loading...',
}) => {
  const spinnerClasses = [
    'spinner',
    `spinner--${size}`,
    `spinner--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={spinnerClasses} role="status" aria-label={label}>
      <svg className="spinner__svg" viewBox="0 0 50 50">
        <circle
          className="spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
        />
      </svg>
      <span className="spinner__label">{label}</span>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'overlay']),
  className: PropTypes.string,
  label: PropTypes.string,
};

export default Spinner;
