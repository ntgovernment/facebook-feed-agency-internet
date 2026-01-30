# CSS Architecture - Facebook Feed Widget

## Overview

The Facebook Feed Widget uses a Bootstrap 4 compatible, variable-based modular CSS architecture. This design system ensures consistency, maintainability, and compatibility with the NT.gov.au framework.

## Design System Structure

### Variable Categories

All design tokens are defined in [`src/styles/variables.css`](src/styles/variables.css) using CSS Custom Properties (CSS Variables).

#### 1. Brand Colors

Primary brand colors with state variants for interactive elements:

```css
--dpsc-primary: #c33826; /* Primary brand color */
--dpsc-primary-hover: #a72f1f; /* Hover state */
--dpsc-primary-active: #8c2619; /* Active/pressed state */
--dpsc-primary-rgb: 195, 56, 38; /* RGB variant for rgba() usage */
```

#### 2. Action Colors (Figma Design System)

Action colors following the DPSC Figma design system:

```css
--clr-action-primary: #1f1f5f; /* Primary action color */
--clr-action-hover: #c33826; /* Action hover state */
--clr-action-primary-hover: #2e2e85; /* Primary hover variant */
--clr-action-primary-active: #181847; /* Primary active state */
--clr-action-primary-rgb: 31, 31, 95; /* RGB variant */
```

#### 3. Link Colors

```css
--clr-link-default: #1f1f5f; /* Default link color */
--clr-link-hover: #c33826; /* Link hover state */
--clr-link-inverse: #ffffff; /* Links on dark backgrounds */
```

#### 4. Text Colors

Semantic text color variables:

```css
--dpsc-text-primary: #1f1f5f; /* Primary text color */
--dpsc-text-dark: #1f1e27; /* Dark text variant */
--dpsc-text-light: #8e8e8e; /* Light/muted text */
--clr-text-default: #1f1e27; /* Default body text */
```

#### 5. UI Colors

Background and border colors:

```css
--dpsc-border: #d3d3d7; /* Default border color */
--dpsc-background-light: #f0f0f0; /* Light background */
--clr-bg-default: #ffffff; /* Default background */
--clr-border-subtle: #d3d3d7; /* Subtle borders */
--clr-border-strong-01: #1f1f5f; /* Strong/emphasis borders */
```

#### 6. Focus States

Consistent focus indicators across all interactive elements:

```css
--clr-focus: #ec8c58; /* Focus color */
--focus-outline-width: 4px; /* Focus outline width */
--focus-outline: 4px solid var(--clr-focus); /* Complete focus outline */
```

#### 7. Bootstrap 4 Button Variables

Complete button state system for Bootstrap 4 compatibility:

```css
/* Base States */
--btn-primary-bg: var(--clr-action-primary);
--btn-primary-border: var(--clr-action-primary);
--btn-primary-color: var(--clr-link-inverse);

/* Hover States */
--btn-primary-hover-bg: var(--clr-action-hover);
--btn-primary-hover-border: var(--clr-action-hover);
--btn-primary-hover-color: var(--clr-link-inverse);

/* Active States */
--btn-primary-active-bg: var(--clr-action-primary-active);
--btn-primary-active-border: var(--clr-action-primary-active);
--btn-primary-active-color: var(--clr-link-inverse);

/* Focus & Disabled */
--btn-primary-focus-shadow: 0 0 0 0.2rem
  rgba(var(--clr-action-primary-rgb), 0.5);
--btn-disabled-opacity: 0.65;
--btn-radius: 0; /* Square buttons per design system */
```

#### 8. Typography System

Centralized font variables:

```css
--font-family-base:
  Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Font Sizes */
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 20px;
--font-size-xl: 24px;
--font-size-xxl: 32px;

/* Line Heights */
--line-height-tight: 16px;
--line-height-base: 24px;
--line-height-relaxed: 1.6;
```

#### 9. Spacing System (8px Base)

Consistent spacing scale based on 8px increments:

```css
--spacing-xs: 8px; /* Extra small spacing */
--spacing-sm: 12px; /* Small spacing */
--spacing-md: 16px; /* Medium spacing */
--spacing-lg: 24px; /* Large spacing */
--spacing-xl: 40px; /* Extra large spacing */
```

**Usage Examples:**

```css
padding: var(--spacing-lg); /* 24px */
gap: var(--spacing-sm); /* 12px */
margin-bottom: var(--spacing-xl); /* 40px */
```

#### 10. Shadows & Overlays

Pre-defined shadow styles:

```css
--shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.1); /* Small shadow (cards) */
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2); /* Large shadow (modals) */
--overlay-bg: rgba(0, 0, 0, 0.5); /* Modal overlays */
```

#### 11. Transitions

Standardized animation timing:

```css
--transition-base: 0.2s ease; /* Fast transitions (hover, focus) */
--transition-slow: 0.3s ease; /* Slower transitions (modals, images) */
```

## Module Structure

The CSS is organized into modular files for maintainability:

```
src/styles/
├── variables.css      # All design tokens (40+ variables)
├── layout.css        # Grid layout and container styles
├── card.css          # Card component styles
├── button.css        # Bootstrap 4 compatible button styles
├── modal.css         # Modal component styles
└── links.css         # Link and anchor styles
```

Entry point: [`src/styles.css`](src/styles.css) imports all modules.

## Bootstrap 4 Compatibility

### Button Scoping

To prevent conflicts with the NT.gov.au Bootstrap framework, all button styles are scoped:

```css
.facebook-feed .btn-primary,
.fb-modal .btn-primary,
.fb-card .btn {
  /* Scoped styles with !important to override Bootstrap */
}
```

**Why scoping is needed:**

- NT.gov.au pages use Bootstrap 4 globally
- Scoping ensures widget buttons don't conflict with page buttons
- `!important` flags ensure our styles take precedence within widget scope

### Button State Pattern

Follows Bootstrap 4's button state architecture:

```css
/* Default */
.fb-modal .btn-primary {
  background: var(--btn-primary-bg);
}

/* Hover */
.fb-modal .btn-primary:hover {
  background: var(--btn-primary-hover-bg);
}

/* Active/Pressed */
.fb-modal .btn-primary:active {
  background: var(--btn-primary-active-bg);
}

/* Focus */
.fb-modal .btn-primary:focus {
  box-shadow: var(--btn-primary-focus-shadow);
}

/* Disabled */
.fb-modal .btn-primary:disabled {
  opacity: var(--btn-disabled-opacity);
}
```

## Customization Guide

### Changing the Color Scheme

To customize colors, modify only [`src/styles/variables.css`](src/styles/variables.css):

```css
:root {
  /* Example: Change primary color from red to blue */
  --dpsc-primary: #1f5fc3;
  --dpsc-primary-hover: #1a4fa2;
  --dpsc-primary-active: #15408c;
  --dpsc-primary-rgb: 31, 95, 195;

  /* Action colors will update automatically if using var() references */
}
```

### Adjusting Spacing

Modify spacing variables to change overall density:

```css
:root {
  /* Example: Increase spacing for more breathing room */
  --spacing-xs: 12px; /* was 8px */
  --spacing-sm: 16px; /* was 12px */
  --spacing-md: 20px; /* was 16px */
  --spacing-lg: 32px; /* was 24px */
  --spacing-xl: 48px; /* was 40px */
}
```

### Changing Typography

Update font family or sizes centrally:

```css
:root {
  /* Example: Use different font */
  --font-family-base: "Open Sans", sans-serif;

  /* Example: Increase all font sizes */
  --font-size-base: 18px; /* was 16px */
  --font-size-lg: 22px; /* was 20px */
}
```

### Responsive Breakpoints

Grid breakpoints are defined in [`src/styles/layout.css`](src/styles/layout.css):

```css
/* Mobile first, then: */
@media (min-width: 768px) {
  /* Tablet */
  .fb-feed__grid--compact {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  /* Desktop */
  .fb-feed__grid--compact {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Component Architecture

### Card Component ([`card.css`](src/styles/card.css))

Structure:

```
.fb-card
  └─ .fb-card__inner
      ├─ .fb-card__image
      │   └─ img
      ├─ .fb-card__header
      │   ├─ .fb-card__tag-wrapper
      │   │   └─ .fb-card__tag
      │   └─ .fb-card__date
      ├─ .fb-card__content
      │   └─ .fb-card__text
      │       ├─ .fb-card__title-row
      │       │   └─ .fb-card__title
      │       └─ .fb-card__description
      └─ .fb-card__footer
```

Uses variables:

- Spacing: `--spacing-lg`, `--spacing-sm`, `--spacing-xs`
- Colors: `--clr-bg-default`, `--dpsc-background-light`, `--clr-border-subtle`
- Typography: `--font-family-base`, `--font-size-xs/sm/base/lg`
- Shadows: `--shadow-sm`

### Modal Component ([`modal.css`](src/styles/modal.css))

Structure:

```
.fb-modal
  ├─ .fb-modal__overlay
  └─ .fb-modal__content
      ├─ .fb-modal__close
      ├─ .fb-modal__header
      │   ├─ h2
      │   └─ .fb-modal__date
      ├─ .fb-modal__body
      │   └─ p
      └─ .fb-modal__footer
          └─ .btn-tertiary
```

Uses variables:

- Spacing: `--spacing-md`, `--spacing-lg`, `--spacing-xl`
- Colors: `--overlay-bg`, `--dpsc-text-light`
- Shadows: `--shadow-lg`
- Transitions: `--transition-slow`

### Button Component ([`button.css`](src/styles/button.css))

**Two Variants:**

1. **Primary Button** - Call-to-action button

   ```html
   <a href="#" class="btn btn-primary">View on Facebook</a>
   ```

2. **Tertiary Button** - Text link with icon
   ```html
   <button class="btn btn-tertiary">
     Find out more
     <svg>...</svg>
   </button>
   ```

## Best Practices

### 1. Always Use Variables

❌ **DON'T:**

```css
.my-element {
  color: #1f1f5f;
  padding: 24px;
  font-family: Lato, sans-serif;
}
```

✅ **DO:**

```css
.my-element {
  color: var(--clr-link-default);
  padding: var(--spacing-lg);
  font-family: var(--font-family-base);
}
```

### 2. Use Spacing System

❌ **DON'T:**

```css
margin-bottom: 15px; /* Random value */
```

✅ **DO:**

```css
margin-bottom: var(--spacing-md); /* 16px from system */
```

### 3. Scope Bootstrap Overrides

❌ **DON'T:**

```css
.btn {
  /* Unscoped - will conflict with NT.gov.au Bootstrap */
}
```

✅ **DO:**

```css
.facebook-feed .btn,
.fb-modal .btn {
  /* Scoped - only affects widget buttons */
}
```

### 4. Maintain Consistent Naming

- **BEM Methodology:** `.block__element--modifier`
- **Prefix:** All classes use `.fb-` prefix
- **Variables:** Use semantic names, not values

### 5. Mobile-First Responsive

Always write mobile styles first, then enhance with media queries:

```css
.element {
  /* Mobile styles (default) */
}

@media (min-width: 768px) {
  .element {
    /* Tablet enhancements */
  }
}

@media (min-width: 992px) {
  .element {
    /* Desktop enhancements */
  }
}
```

## Browser Support

This architecture supports all modern browsers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Android (last 2 versions)

CSS Custom Properties are widely supported (95%+ global coverage).

## Maintenance Guidelines

### Adding New Components

1. Create new CSS module in `src/styles/`
2. Import in `src/styles.css`
3. Use existing variables - avoid creating new ones unless necessary
4. Follow BEM naming: `.fb-component__element--modifier`
5. Scope any Bootstrap overrides

### Modifying Existing Styles

1. Check if a variable exists before hard-coding
2. Test changes across all breakpoints
3. Verify modal and card components still function
4. Check focus states for accessibility

### Performance Considerations

- CSS file size: ~8KB (minified)
- CSS Custom Properties have minimal performance impact
- All transitions use hardware-accelerated properties (opacity, transform)
- No expensive filters or effects (except controlled blur on image background)

## Accessibility

The design system includes comprehensive accessibility features:

### Focus Indicators

All interactive elements have visible focus states:

```css
.element:focus {
  outline: var(--focus-outline); /* 4px solid #ec8c58 */
}
```

### Color Contrast

All color combinations meet WCAG AA standards:

- Text on white: 4.5:1 minimum
- Links: Distinguishable from body text
- Focus indicators: High contrast orange (#ec8c58)

### Keyboard Navigation

- All buttons and links are keyboard accessible
- Modal includes focus trap
- Tab order follows visual hierarchy

## Migration from Legacy Code

If migrating from hard-coded styles:

1. **Identify hard-coded values:**

   ```bash
   # Search for common patterns
   grep -r "font-family: Lato" src/styles/
   grep -r "24px" src/styles/
   grep -r "#1f1f5f" src/styles/
   ```

2. **Replace with variables:**
   - Colors → `var(--clr-*)`
   - Spacing → `var(--spacing-*)`
   - Fonts → `var(--font-family-base)` or `var(--font-size-*)`
   - Transitions → `var(--transition-base)`

3. **Test thoroughly:**
   - Visual regression testing
   - Cross-browser testing
   - Accessibility audit

## Related Documentation

- [Instagram Feed CSS Architecture](../instagram-feed-agency-internet/CSS_ARCHITECTURE.md) - Sister project with identical variable structure
- [NT.gov.au Design System](https://nt.gov.au) - Parent framework documentation
- [Bootstrap 4 Documentation](https://getbootstrap.com/docs/4.6/) - Button and grid system reference

## Support

For questions or issues with the CSS architecture:

1. Check variable definitions in [`src/styles/variables.css`](src/styles/variables.css)
2. Review component-specific CSS modules
3. Ensure Bootstrap scoping is maintained
4. Test in isolation before integrating with NT.gov.au pages

---

**Last Updated:** January 31, 2026  
**Architecture Version:** 2.0 (Bootstrap 4 Compatible)  
**Design System:** DPSC Figma Components
