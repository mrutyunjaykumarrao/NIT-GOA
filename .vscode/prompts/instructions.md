# NIT-GOA Project Development Guidelines

## Project Overview
This is the NIT-GOA website project consisting of a React frontend (client), Node.js backend (server), and PostgreSQL database. The project aims to provide a comprehensive platform for the National Institute of Technology, Goa.

## Development Environment Setup

### Always Use dev.sh for Running the Project
- **MANDATORY**: Always use the `dev.sh` script located in the `/scripts/` directory to start the development environment
- This script ensures proper environment setup and starts all necessary services
- Run command: `./scripts/dev.sh` from the project root
- Never start individual services manually unless specifically debugging

## Responsive Design Requirements

### Screen Compatibility
- **Critical**: All pages MUST be responsive for screen widths from **less than 370px to more than 2560px**
- Test on multiple breakpoints:
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px - 1440px
  - Large Desktop: 1440px - 2560px
  - Ultra-wide: 2560px+

### Responsive Design Guidelines
- Use CSS Grid and Flexbox for layouts
- Implement mobile-first design approach
- Use relative units (rem, em, %, vw, vh) instead of fixed pixels where appropriate
- Ensure touch targets are at least 44px for mobile devices
- Test on actual devices when possible

## CSS Organization and Naming Convention

### Page-Specific CSS Classes
- **MANDATORY**: All CSS classes MUST be prefixed with the page name
- Format: `[PageName]-[component]-[element]`
- Examples:
  ```css
  /* For Homepage */
  .homepage-header-container { }
  .homepage-hero-section { }
  .homepage-footer-links { }
  
  /* For Faculty Page */
  .faculty-list-container { }
  .faculty-card-wrapper { }
  .faculty-filter-buttons { }
  
  /* For About Page */
  .about-mission-section { }
  .about-vision-text { }
  ```

### CSS File Organization
- Each page should have its own CSS file
- CSS files should be located in the same directory as the component
- Import CSS files at the component level, not globally unless absolutely necessary

## Dark Mode Implementation

### Dark Mode Requirements
- **MANDATORY**: ALL new pages and components MUST support dark mode from the start
- Follow the existing dark mode implementation pattern from homepage and other current pages
- Use CSS custom properties (CSS variables) for theming

### Dark Mode Implementation Pattern
```css
/* Light mode (default) */
.pagename-container {
  background: var(--white);
  color: var(--gray-800);
}

.pagename-section {
  background: var(--gray-50);
}

.pagename-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
}

/* Dark mode */
[data-theme="dark"] .pagename-container {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

[data-theme="dark"] .pagename-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

[data-theme="dark"] .pagename-card {
  background: rgba(15, 23, 42, 1);
  border-color: rgba(59, 130, 246, 0.3);
}

[data-theme="dark"] .pagename-card:hover {
  background: rgba(30, 41, 59, 1);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15), 0 4px 8px rgba(59, 130, 246, 0.1);
}

[data-theme="dark"] .pagename-text {
  color: var(--gray-300);
}

[data-theme="dark"] .pagename-title {
  color: var(--primary-blue-light);
}
```

### Dark Mode Variables
Use consistent color variables across the project:
```css
:root {
  /* Primary Blues - Based on NIT Goa Logo */
  --primary-blue: #2E86C1;
  --primary-blue-light: #5DADE2;
  --primary-blue-dark: #1B4F72;
  
  /* Secondary Blues */
  --secondary-blue-50: #EBF5FB;
  --secondary-blue-100: #D6EAF8;
  --secondary-blue-200: #AED6F1;
  --secondary-blue-800: #0F3460;
  
  /* Neutrals */
  --white: #FFFFFF;
  --gray-50: #F8F9FA;
  --gray-100: #F1F3F4;
  --gray-200: #E9ECEF;
  --gray-300: #D1D5DB; /* Light gray text for dark mode */
  --gray-600: #6C757D;
  --gray-800: #343A40;
  
  /* Accents */
  --accent-orange: #FF6B35;
  --accent-green: #28A745;
  --accent-red: #DC3545;
}

/* Dark Mode Backgrounds */
[data-theme="dark"] {
  /* Dark backgrounds using slate colors */
  --bg-primary-dark: #0f172a; /* Very dark slate */
  --bg-secondary-dark: #1e293b; /* Dark slate */
  --bg-tertiary-dark: #334155; /* Medium slate */
  
  /* Dark mode borders and overlays */
  --border-dark: rgba(59, 130, 246, 0.3); /* Blue border with opacity */
  --overlay-dark: rgba(59, 130, 246, 0.1); /* Blue overlay for hover */
  --shadow-dark: rgba(59, 130, 246, 0.15); /* Blue shadow */
}
```

## Code Quality Standards

### React Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for type safety (if applicable)
- Follow the existing component structure in the project

### Performance Considerations
- Implement lazy loading for images and components
- Use React.memo() for components that don't need frequent re-renders
- Optimize bundle size with proper imports

### Accessibility Requirements
- All interactive elements must be keyboard accessible
- Implement proper ARIA labels and roles
- Ensure sufficient color contrast for both light and dark modes
- Test with screen readers

## File Structure and Organization

### Component Structure
```
src/
  components/
    [PageName]/
      [PageName].js
      [PageName].css
      index.js
```

### Naming Conventions
- Components: PascalCase (e.g., `FacultyList`)
- Files: PascalCase for components, kebab-case for utilities
- CSS classes: kebab-case with page prefix

## Testing Requirements
- Test responsive design on multiple screen sizes
- Test dark mode toggle functionality
- Verify keyboard navigation
- Cross-browser compatibility testing

## Development Workflow
1. Always pull latest changes before starting work
2. Create feature branches for new functionality
3. Test responsive design and dark mode before committing
4. Ensure CSS classes follow the naming convention
5. Run the project using `dev.sh` for testing

## Common Patterns to Follow
- Look at existing pages (homepage, etc.) for dark mode implementation examples
- Follow the established routing structure
- Use the existing utility functions and hooks
- Maintain consistency with the current design system

## Database Integration
- Follow the established database schema in `database/schemas/`
- Use the existing API patterns in `server/src/routes/`
- Test database connections using the provided scripts

Remember: Quality and consistency are key. Always prioritize user experience across all devices and accessibility for all users.