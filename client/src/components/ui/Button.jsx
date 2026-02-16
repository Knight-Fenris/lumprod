import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Button Component
 * Accessible button with multiple variants and states
 */
const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      disabled = false,
      loading = false,
      icon = null,
      iconPosition = 'left',
      type = 'button',
      onClick,
      className = '',
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const classes = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      fullWidth && 'btn--full-width',
      loading && 'btn--loading',
      disabled && 'btn--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        onClick={onClick}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="btn__spinner" aria-hidden="true">
            <svg className="btn__spinner-svg" viewBox="0 0 24 24">
              <circle
                className="btn__spinner-circle"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="2"
              />
            </svg>
          </span>
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="btn__icon btn__icon--left" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="btn__content">{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="btn__icon btn__icon--right" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Button;
