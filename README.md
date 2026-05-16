# CampusEvents

CampusEvents is a mobile-first event management application built with Expo and React Native using TypeScript. It helps students and campus staff browse, register, and manage campus events while also providing administrator tools for event creation and tracking.

## 🚀 Project Overview

CampusEvents is designed for campus communities to discover events, save favorites, and manage registrations. It supports two main user roles:

- **Student**: Browse events, search, favorite, register, and review personal registrations.
- **Assistant / Admin**: Create and manage campus events with a guided event form.

The app also integrates AI-powered assistant features for improved search, recommendations, and event planning.

## 📱 Key Features

- Event browsing with category filtering and search
- Detailed event pages with registration status
- Favorite events management
- Student profile and registration history
- Admin event creation and editing flow
- AI-powered assistant for planning and recommendations
- Responsive Expo app structure with custom UI components

## 🧱 Project Structure

- `app/` — main route layout, screens and nested route groups for admin, auth, events, and student flows
- `components/` — reusable UI and domain components used across screens
- `config/` — shared configuration such as toast settings
- `constants/` — app constants, theme settings, categories, and prompts
- `database/` — in-app database helpers for events, registrations, favorites, and initialization
- `hooks/` — custom hooks for event loading, favorites, and registration actions
- `models/` — TypeScript models for domain entities
- `services/` — application services for events, login, favorites, registrations and assistant integration
- `store/` — global state stores using Zustand
- `types/` — shared TypeScript types and enums
- `utils/` — utility helpers such as time formatting

## 🧩 Screens & Flows

### Authentication

- `app/auth/login.tsx` — user login flow and authentication state management.

### Student Experience

- `app/student/home.tsx` — main student dashboard
- `app/student/favorites.tsx` — saved events list
- `app/student/registrations.tsx` — registered events and attendance tracking
- `app/student/profile.tsx` — student profile details

### Admin / Assistant Experience

- `app/admin/home.tsx` — admin dashboard for event management
- `app/admin/eventFormScreen.tsx` — create or edit events with validation and form controls

### Event Details

- `app/events/[id].tsx` — event detail screen with registration actions and event metadata

## ⚙️ Installation

```bash
cd CampusEvents
npm install
```

## ▶️ Running the App

```bash
npx expo start
```

Then open the app in Expo Go on a device or emulator.

## 🛠️ Development Notes

- The app is built with `expo` and `react-native`.
- State management uses `zustand` stores under `store/`.
- UI components are organized in `components/ui/` for consistent design.
- AI assistant prompts and response components are under `constants/prompts` and `components/ai/`.

## 📁 Important Files

- `package.json` — dependencies and scripts
- `tsconfig.json` — TypeScript settings
- `app/_layout.tsx` — root layout and app navigation
- `app/admin/_layout.tsx` — admin route layout
- `app/student/_layout.tsx` — student route layout
- `database/init.ts` — initial database seeding

## 🖼️ Screenshots

> Add screenshots of the app here.

- `![Home Screen](./screenshots/home.png)`
- `![Event Detail](./screenshots/event-detail.png)`
- `![Admin Event Form](./screenshots/admin-event-form.png)`
##  Licence

Ce projet est sous licence **MIT** — contacter  [EL AZZOUZI Achraf](mailto:achraf0el7azzouzi@gmail.com) ou [Mohamed Iliass Kaddar](mailto:moahmediliassk@gmail.com) . pour plus de détails.

---

<div align="center">
  <strong>Réalisé dans le cadre d’un projet académique de développement mobile</strong><br>
  Expo · React Native · TypeScript · SQLite · Zustand · AI Assistant Integration · Mobile-First Architecture
</div>
