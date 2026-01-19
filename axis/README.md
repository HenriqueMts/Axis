# 🎯 Axis

Welcome to **Axis**! A modern Full Stack SaaS application designed to help you organize, track, and achieve your weekly goals. Built with performance and user experience in mind.

## ✨ About the Project

Axis allows users to define weekly goals, track daily progress, and visualize their achievements through an intuitive dashboard. It features secure authentication, real-time database updates, and a responsive design that works perfectly on any device.

## 🛠 Tech Stack

This project was built using the latest web development technologies:

* **Next.js 14** ⚡ (App Router, Server Actions & Server Components)
* **TypeScript** 📘 (For robust, type-safe code)
* **Tailwind CSS** 🎨 (For modern, responsive styling)
* **PostgreSQL** 🐘 (Managed via Neon DB)
* **Drizzle ORM** 🌧️ (For type-safe database interaction)
* **NextAuth v5** 🔒 (Secure authentication with GitHub & Google)
* **TanStack Query** 🔄 (For efficient server state management)
* **Zod** 💎 (For schema validation)

## 🚀 Features

* ✅ **Goal Management:** Create, track, and complete weekly goals.
* 📊 **Progress Tracking:** Visual progress bars and completion stats.
* 🔐 **Secure Auth:** Social login with GitHub and Google.
* 🌓 **Modern UI:** Clean, dark-mode first interface with smooth transitions.
* 📱 **Fully Responsive:** Optimized for mobile and desktop.

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"

# OAuth Providers
AUTH_GITHUB_ID="your-github-id"
AUTH_GITHUB_SECRET="your-github-secret"
AUTH_GOOGLE_ID="your-google-id"
AUTH_GOOGLE_SECRET="your-google-secret"
