# Contributing to LUMIERE 2026

Thank you for your interest in contributing to LUMIERE 2026! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git
- Code editor (VS Code recommended)
- Firebase account (for testing backend features)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lumiere-2026.git
   cd lumiere-2026
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/lumiere-2026.git
   ```
4. Install dependencies:
   ```bash
   cd client
   npm install
   ```
5. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
6. Start development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

We use a simplified Git Flow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes
2. Test thoroughly
3. Commit with descriptive messages
4. Push to your fork
5. Create a pull request

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality

Implement password reset flow with email verification.
Users can now request password reset link via email.

Closes #123
```

```
fix(submission): handle file upload timeout

Add 60s timeout and retry logic for large file uploads.

Fixes #456
```

## Code Standards

### JavaScript/React

1. **ES6+ Syntax**: Use modern JavaScript features
2. **Functional Components**: Use hooks instead of class components
3. **PropTypes**: Always define PropTypes for components
4. **Naming Conventions:**
   - Components: PascalCase (`MyComponent.jsx`)
   - Files: camelCase (`myUtility.js`)
   - Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
5. **File Structure:**
   ```
   ComponentName/
   ├── ComponentName.jsx
   ├── ComponentName.css
   ├── ComponentName.test.jsx
   └── index.js
   ```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
npm run lint          # Check for errors
npm run lint:fix      # Fix auto-fixable errors
npm run format        # Format with Prettier
```

### Component Example

```jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import './MyComponent.css';

/**
 * MyComponent - Brief description of what it does
 * 
 * @param {string} title - The title to display
 * @param {function} onAction - Callback when action is triggered
 */
const MyComponent = ({ title, onAction }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    onAction?.();
  };

  return (
    <div className={`my-component ${isActive ? 'active' : ''}`}>
      <h2>{title}</h2>
      <button onClick={handleClick} aria-pressed={isActive}>
        Toggle
      </button>
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func,
};

MyComponent.defaultProps = {
  onAction: null,
};

export default MyComponent;
```

### CSS Standards

1. Use CSS custom properties for theming
2. Follow BEM naming convention
3. Mobile-first approach
4. Avoid `!important` unless absolutely necessary
5. Keep specificity low

```css
/* Good */
.button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
}

.button--large {
  padding: 1rem 2rem;
}

.button__icon {
  margin-right: 0.5rem;
}

/* Bad */
.button.largeButton > span.icon {
  margin-right: 10px !important;
}
```

### Accessibility

All contributions must meet WCAG 2.1 Level AA standards:

1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Labels**: Add when semantic HTML isn't enough
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Focus Management**: Visible focus indicators
5. **Color Contrast**: Minimum 4.5:1 for text
6. **Alt Text**: Descriptive alt text for images

Example:
```jsx
<button
  onClick={handleSubmit}
  disabled={isLoading}
  aria-label="Submit form"
  aria-busy={isLoading}
>
  {isLoading ? 'Submitting...' : 'Submit'}
</button>
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is properly formatted (`npm run format`)
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] Commits follow convention
- [ ] Branch is up to date with `develop`

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Commented hard-to-understand areas
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added
- [ ] All tests pass
```

### Review Process

1. At least one maintainer must review
2. All CI checks must pass
3. No unresolved comments
4. Up-to-date with target branch

## Issue Guidelines

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
 - OS: [e.g. Windows 11]
 - Browser: [e.g. Chrome 120]
 - Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information
```

### Feature Requests

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other context or screenshots
```

## Testing Guidelines

### Unit Tests

Use Jest and React Testing Library:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles clicks', () => {
    const handleClick = jest.fn();
    render(<MyComponent title="Test" onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

Test user flows:

```jsx
describe('Submission Flow', () => {
  it('allows user to submit a film', async () => {
    render(<App />);
    
    // Navigate to submission page
    fireEvent.click(screen.getByText('Submit Film'));
    
    // Fill out form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'My Film' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('Submit'));
    
    // Verify success
    await screen.findByText('Submission successful');
  });
});
```

### E2E Tests

Use Playwright or Cypress for end-to-end tests.

## Documentation

### Code Documentation

Use JSDoc comments for functions and complex logic:

```javascript
/**
 * Calculate submission fee based on category
 * 
 * @param {string} category - Film category
 * @param {number} duration - Film duration in minutes
 * @returns {number} Fee in rupees
 * @throws {Error} If category is invalid
 * 
 * @example
 * calculateFee('documentary', 90) // returns 1500
 */
function calculateFee(category, duration) {
  // Implementation
}
```

### Component Documentation

Document props, usage, and examples:

```jsx
/**
 * Button Component
 * 
 * A flexible button component with multiple variants and states.
 * 
 * @component
 * @example
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * 
 * @example
 * // Button with icon
 * <Button icon={<Icon />} iconPosition="left">
 *   Submit
 * </Button>
 */
```

### README Updates

Update README.md for:
- New features
- Changed APIs
- Updated dependencies
- New configuration options

## Questions?

Feel free to:
- Open a discussion on GitHub
- Ask in pull request comments
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing to LUMIERE 2026! 🎬
