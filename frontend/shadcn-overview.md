# Timely Frontend Documentation: ShadCN Overview

## 1. What is ShadCN?

ShadCN is **not a traditional UI library** like Material UI or Chakra UI.  
Instead, it’s a **component generator** that provides **copyable and fully customizable React components** built with:

- **Tailwind CSS** – for styling  
- **Radix UI** – for accessible interactions (keyboard navigation, ARIA, etc.)

The developer **owns the code** for every component, meaning I can:
- Customize styles and props freely  
- Extend or simplify components to fit Timely’s needs  
- Avoid “fighting” library limitations

Think of it as a **design system starter kit** rather than a locked black box.

---

## 2. Why Use ShadCN in Timely

Timely uses ShadCN because it:

- **Keeps styling consistent** with Tailwind  
- **Ensures accessibility** by default  
- **Offers full control** over UI components  
- **Scales well** with our Next.js + TypeScript stack  
- **Keeps the bundle small** — only the components we generate are included

This flexibility is crucial for Timely features like:

- The **Activity Form** with category, mood, and energy sliders  
- The **Report Panel** with dropdown filters and pie chart integration  
- The **User Settings Panel** for managing preferences  

---

## 3. How It Fits in Timely

- All base ShadCN components are stored in:  
components/ui/
- **Custom Timely wrappers** are created to simplify usage, for example:  
- `CategoryComboBox` → built on top of the base `Combobox`  
- `ReportPanel` → composed of `Card`, `Select`, and `Button` components  
- `ActivityDialog` → uses ShadCN `Dialog` with custom form content

---

## 4. Technical Setup

### 4.1. Install Base Dependencies

From your project root, run:

```bash
# Install shadcn CLI globally (optional, but recommended)
npm install -g shadcn-ui

# Add base dependencies for Tailwind and ShadCN
npm install clsx tailwind-variants @radix-ui/react-icons
If you haven’t already, initialize Tailwind and ShadCN:
# Tailwind setup (if not yet installed)
npx tailwindcss init -p

# ShadCN project initialization
npx shadcn-ui init
```
This generates a components.json configuration file for ShadCN.
### 4.2. Generate Components
Use the ShadCN CLI to generate components into components/ui/.
Example:

```bash
npx shadcn-ui add button
```

This creates:
```bash
components/ui/button.tsx
```

Other examples:
```bash
npx shadcn-ui add card
npx shadcn-ui add dialog
npx shadcn-ui add select
```
### 4.3. Using Components
```JSX
Import components from @/components/ui:
import { Button } from "@/components/ui/button";

export default function Example() {
  return <Button variant="secondary">Manage Activities</Button>;
}
```
## 5. Best Practices
- **Keep base components clean:**
    
    Don’t add business logic to components/ui. These are meant to be generic.
- **Create wrapper components:**
    
    For repeated patterns, make wrapper components in their own folder.
    
    Example:

    ```components/forms/ActivityButton.tsx ```wrapping the base Button.
- **Document customizations**: 
Whenever you add a custom variant or modify a base component, update the documentation to help future contributors.
- **Update with care**:
If ShadCN releases updates, regenerate components carefully and test to avoid breaking custom code.
## 6. References
[ShadCN UI Official Site](https://ui.shadcn.com)

[Radix UI Primitives](https://www.radix-ui.com/primitives)

[Tailwind CSS Docs](https://v2.tailwindcss.com/docs)

---
