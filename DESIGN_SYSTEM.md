# MR Institute of Learning - Enterprise Design System

This document outlines the design tokens, CSS architecture, and UI component usage for the MR Institute platform.

## Design Tokens (Tailwind)

The design system utilizes a scalable CSS Variable foundation configured in `src/index.css` and `tailwind.config.js`. It fully supports Dark and Light mode.

### Colors

*   **Backgrounds**: `bg-background` (Page base), `bg-surface` (Cards/Modals)
*   **Borders**: `border-border`
*   **Text**: `text-text-primary`, `text-text-secondary`, `text-text-muted`
*   **Brand**:
    *   `primary`: Main brand color (`indigo-600` equivalent)
    *   `secondary`: Subtle actions (`slate-100` equivalent)
    *   `accent`: Highlight color (`sky-400` equivalent)
*   **Semantic**: `success`, `warning`, `error`, `info`

### Typography

Using `Inter` (or system-sans fallback).

*   `h1` to `h4`: Defined in base CSS layer for semantic HTML.
*   `.text-small`, `.text-label`, `.text-caption`: Utility classes for standard sub-text.

### Spacing & Layout

Strict 4px baseline grid.
Available custom spacing (overriding some defaults):
*   `0`, `1` (4px), `2` (8px), `3` (12px), `4` (16px), `5` (20px), `6` (24px), `8` (32px), `10` (40px), `12` (48px), `16` (64px), `20` (80px), `24` (96px).

## UI Component Library

All components are located in `src/components/ui/`. They utilize `class-variance-authority` (cva) for elegant variant management and `tailwind-merge` (`cn` utility) for robust class merging.

### Basic Inputs & Buttons
*   **Button**: Primary action element. Supports `variant` (primary, secondary, outline, ghost, danger, link) and `size` (default, sm, lg, icon), plus a `loading` state.
*   **Input / Textarea / Select**: Standard form controls. Supports an `error` prop for validation styling.
*   **Checkbox / Radio / Switch**: Boolean selection controls. Switch provides an accessible custom UI.
*   **FileUpload**: Drag-and-drop styled file input wrapper.

### Feedback
*   **Alert**: Page-level feedback. Supports `variant` (default, destructive, success, warning, info) and optional icons.
*   **Badge**: Inline status indicators.
*   **Progress**: Indeterminate or determinate progress bar.
*   **Skeleton**: Loading placeholder.
*   **EmptyState**: A consistent layout for when data is missing or empty.

### Data Display
*   **Card**: Composable container (`Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`).
*   **Table / DataTable**: Highly composable, accessible tables. `DataTable` wraps `Table` for standard array mapping.
*   **Avatar**: User profile image placeholder with fallback text or icon support.

### Layout & Navigation
*   **Container / Section / Grid / Stack**: Layout primitives for consistent spacing and grid alignments across pages.
*   **Tabs**: State-driven content switcher.
*   **Breadcrumb / Pagination**: Navigation helpers.

### Overlays
*   **Modal / Dialog / Drawer**: Z-index managed overlay containers. Uses `framer-motion` for entry/exit animations. 
*   **Popover**: Click-to-reveal contextual floating content.
*   **Toast**: Non-blocking notification component.

## Animation System

Located in `src/components/animations/`.

Powered by `framer-motion`. Do not write raw CSS keyframes unless necessary. Use these wrapper components to maintain a consistent ease/duration profile:
*   `FadeIn`: Simple opacity transition.
*   `SlideIn`: Directional (up/down/left/right) opacity + transform transition.
*   `ScaleIn`: Pop-in transition (used in Dialogs).
*   `PageTransition`: Wrap route elements in this for consistent page-to-page morphs.

## Accessibility (a11y)

*   All interactive elements utilize `:focus-visible` for keyboard navigation outlines.
*   Native elements (`<button>`, `<dialog>`) or explicit ARIA roles are used throughout the library.
*   Disabled states handle `pointer-events-none` and `opacity-50` consistently.
