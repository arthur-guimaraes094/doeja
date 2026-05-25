---
name: DoeJÁ Design System
colors:
  surface: '#fff8f6'
  surface-dim: '#e5d7d2'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#f9ebe5'
  surface-container-high: '#f3e5e0'
  surface-container-highest: '#ede0da'
  on-surface: '#211a17'
  on-surface-variant: '#45483b'
  inverse-surface: '#362f2b'
  inverse-on-surface: '#fceee8'
  outline: '#757969'
  outline-variant: '#c5c8b6'
  surface-tint: '#4d6617'
  primary: '#4d6617'
  on-primary: '#ffffff'
  primary-container: '#a8c66c'
  on-primary-container: '#3b5201'
  inverse-primary: '#b3d176'
  secondary: '#8c4f00'
  on-secondary: '#ffffff'
  secondary-container: '#fd9923'
  on-secondary-container: '#663800'
  tertiary: '#2c6a4a'
  on-tertiary: '#ffffff'
  tertiary-container: '#8ac9a3'
  on-tertiary-container: '#155538'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ceee8f'
  primary-fixed-dim: '#b3d176'
  on-primary-fixed: '#141f00'
  on-primary-fixed-variant: '#374e00'
  secondary-fixed: '#ffdcbf'
  secondary-fixed-dim: '#ffb874'
  on-secondary-fixed: '#2d1600'
  on-secondary-fixed-variant: '#6b3b00'
  tertiary-fixed: '#b0f1c9'
  tertiary-fixed-dim: '#95d4ae'
  on-tertiary-fixed: '#002112'
  on-tertiary-fixed-variant: '#0e5134'
  background: '#fff8f6'
  on-background: '#211a17'
  surface-variant: '#ede0da'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The brand personality is warm, community-driven, and optimistic. This design system focuses on the mission of social good—connecting donors and NGOs with a sense of urgency and joy. 

The visual style is **Modern Tactile**, blending clean layouts with soft, organic shapes and illustrative elements. It avoids the coldness of corporate SaaS by utilizing a "friendly-first" approach: high-legibility rounded typography, generous white space, and a palette that evokes health and vitality. The interface should feel like a trusted community neighbor: approachable, reliable, and deeply human.

## Colors

The palette is rooted in natural, appetizing tones to reflect food donation and community health.

*   **Primary (Soft Green):** Used for large surface areas, success states, and key brand moments. It represents growth and sustainability.
*   **Secondary (Bright Orange):** Reserved for high-priority calls to action and critical interactive elements. It provides the necessary "action" energy (JÁ!).
*   **Tertiary (Deep Forest):** Used for high-contrast text and iconography to ensure WCAG accessibility against the softer green and orange.
*   **Neutral (Warm Cream):** Replaces harsh whites to maintain a soft, tactile feel. It serves as the primary background color for the application.

## Typography

This design system uses **Plus Jakarta Sans** exclusively to maintain a cohesive, modern, and friendly tone. The rounded terminals of the typeface mirror the "soft" brand personality.

Headlines should use tighter letter spacing and heavier weights to create a strong visual anchor. Body text utilizes a medium weight (500) or regular weight (400) to ensure readability against the warm neutral background. For buttons and labels, a semi-bold weight is preferred to maintain visibility within high-contrast containers.

## Layout & Spacing

The layout follows a **Fluid Grid** philosophy with expanded "breathing room" to reduce cognitive load during the donation process.

*   **Grid:** A 12-column system for desktop, 8-column for tablet, and 4-column for mobile.
*   **Rhythm:** An 8px base unit drives all dimensions. Use `lg` (48px) and `xl` (80px) spacing between major content sections to create a sense of calm and clarity.
*   **Safe Areas:** Large external margins (`margin-desktop`) ensure content feels centered and precious, rather than cluttered.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layering** and **Soft Ambient Shadows**. 

Instead of heavy black shadows, this design system uses "Tinted Depth"—shadows that incorporate a small percentage of the primary green or secondary orange to maintain a vibrant look. 
*   **Level 1 (Cards):** Low-blur, 4% opacity shadows for subtle lift.
*   **Level 2 (Buttons/Modals):** Medium-diffused shadows with a 10% opacity, creating a "squishy" tactile feel that invites interaction. 
*   **Containers:** Use inner borders (1px) in a slightly darker shade of the surface color rather than shadows for a cleaner, modern look.

## Shapes

The shape language is consistently **Rounded**. There are no sharp corners in this design system.

*   **Components:** Buttons, inputs, and cards use a standard 0.5rem (8px) radius.
*   **Large Containers:** Hero sections and login containers use `rounded-xl` (1.5rem/24px) to emphasize the soft, welcoming nature of the platform.
*   **Avatars:** Always circular (fully rounded).

## Components

### Buttons
*   **Primary:** Solid Orange (#F7941D) with Deep Forest (#1D5C3E) or White text for maximum contrast. High-elevation shadow on hover.
*   **Secondary:** Solid White or Cream with Green (#A8C66C) text and a 2px Green border.
*   **Tertiary/Ghost:** Text-only with an underline or icon, used for less frequent actions like "Forgot Password."

### Input Fields
Inputs use a light grey or warm cream fill with a 1px border that turns Green (#A8C66C) upon focus. Icons should be placed on the left to ground the input.

### Cards
Cards for donation listings should feature top-rounded images (24px) and generous internal padding (24px). The "Chat" or "Donate" action should be anchored at the bottom with a clear, high-contrast button.

### Progress Indicators
For donation goals, use thick, rounded progress bars in Primary Green, with the background track in a 20% opacity version of the same color.
