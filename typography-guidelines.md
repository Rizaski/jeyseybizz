# 🖋️ Typography Guidelines

## 🎯 Purpose
To ensure consistent, readable, and modern typography across all devices (web, tablet, and mobile). Typography should express the brand’s tone—clean, minimal, and accessible—while maintaining a strong visual hierarchy.

---

## 🔠 Font Family
- **Primary Font:** `Inter` (or `Poppins` as fallback)
- **Fallback Fonts:** `Roboto`, `Segoe UI`, `Helvetica Neue`, `Arial`, `sans-serif`
- **Usage:** Use variable weights of the same family for all text elements.

---

## 📏 Font Sizing (Responsive Scale)

| Text Type | Desktop | Tablet | Mobile | Font Weight | Line Height | Letter Spacing |
|------------|----------|---------|----------|---------------|---------------|
| Display / Hero | 56px | 44px | 36px | 700 | 120% | -0.02em |
| H1 | 40px | 32px | 28px | 700 | 125% | -0.01em |
| H2 | 32px | 28px | 24px | 600 | 130% | -0.01em |
| H3 | 24px | 22px | 20px | 600 | 135% | normal |
| H4 | 20px | 18px | 16px | 600 | 140% | normal |
| Body / Paragraph | 16px | 16px | 15px | 400 | 160% | normal |
| Small Text / Caption | 14px | 14px | 13px | 400 | 160% | 0.01em |
| Button / Label | 15px | 15px | 14px | 600 | 150% | 0.02em |

---

## ⚙️ Responsive Scaling
Use **clamp()** in CSS for fluid text sizes:
```css
font-size: clamp(1rem, 1vw + 0.5rem, 1.25rem);
