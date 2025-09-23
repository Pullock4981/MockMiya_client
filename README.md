This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






# 🌿 MockMiya Auth System

Welcome to **MockMiya Authentication** – a sleek, modern, and developer-friendly authentication layout crafted with love, dark green vibes, and a hint of futuristic flair. This project is built with **Next.js**, **Tailwind CSS**, and some delightful animations to make logging in or signing up an enjoyable experience.

---

## ✨ Features

- **Login & Signup Tabs:** Switch seamlessly between Sign In and Sign Up with smooth animations.  
- **Role Selection:** Choose between **User** or **Admin** roles effortlessly.  
- **Lottie Animations:** Fun, responsive animations to the right of your forms to bring life to the page.  
- **Google Authentication Button:** Styled to match our futuristic green theme.  
- **Responsive Design:** Perfectly adapts from mobile to desktop.  
- **Form Validation:** Using **Zod** + **React Hook Form** for clean, robust validation.  
- **Dark Green Futuristic Theme:** Radial gradients, shadows, and soft glow effects to keep your eyes happy.

---

## 📂 Project Structure

Here’s how our Auth system is organized:

app/
└── auth/
├── layout.tsx # Auth layout wrapper with Lottie animations
├── page.tsx # Main login/signup page with tabs and role selection
├── LoginForm.tsx # Login form with validation
├── SignupForm.tsx # Signup form with validation
└── GoogleAuth.tsx # Google OAuth button matching theme

markdown
Copy code

**Explanation:**
- `layout.tsx` → Wraps the auth page and displays the corresponding Lottie animation.  
- `page.tsx` → Handles tab switching, role selection, and wraps forms inside `AuthLayout`.  
- `LoginForm.tsx` / `SignupForm.tsx` → Forms with field validation and smooth animations.  
- `GoogleAuth.tsx` → Stylish OAuth button matching the overall theme.

---

## 🛠️ Used Packages / Dependencies

Here’s a little glimpse at the magic behind the scenes:

- **Next.js** – React framework with file-based routing  
- **React & React-DOM** – Core library  
- **Tailwind CSS** – Utility-first styling for rapid UI building  
- **Framer Motion** – Smooth animations for tabs, role switch, and more  
- **Lottie React** – Lottie animations for playful motion graphics  
- **Zod** – Schema validation for forms  
- **React Hook Form** – Form state management with ease  
- **Lucide-React** – Sleek SVG icons  
- **React Icons** – For the Google icon and others  

---