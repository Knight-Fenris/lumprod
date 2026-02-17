import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Card.css';

/**
 * Card Component
 * Flexible card container with optional hover effects and padding variants
 */
const Card = forwardRef(
  (
    {
      children,
      variant = 'default',
      padding = 'medium',
      hoverable = false,
      clickable = false,
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const classes = [
      'card',
      `card--${variant}`,
      `card--padding-${padding}`,
      hoverable && 'card--hoverable',
      clickable && 'card--clickable',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const Element = clickable ? 'button' : 'div';

    return (
      <Element
        ref={ref}
        className={classes}
        onClick={onClick}
        type={clickable ? 'button' : undefined}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

Card.displayName = 'Card';

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'bordered', 'elevated']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

// Card Header
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card__header ${className}`} {...props}>
    {children}
  </div>
);

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// Card Body
export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card__body ${className}`} {...props}>
    {children}
  </div>
);

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// Card Footer
export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card__footer ${className}`} {...props}>
    {children}
  </div>
);

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
