# TODO App

A modern, feature-rich todo application built with React, TypeScript, and Firebase. Organize your tasks with categories, priorities, due dates, reminders, and file attachments.

## 🚀 Features

### Task Management

- ✅ Create, edit, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Set task priorities (Low, Medium, High)
- ✅ Add categories and descriptions
- ✅ Star important tasks

### Advanced Features

- 📅 Due dates with quick-set options
- ⏰ Reminders with notification scheduling
- 📎 File attachments (upload, download, delete)
- 🔊 Completion sound effects
- 📱 Responsive design for all devices

### Organization & Views

- 📋 Multiple view modes (List/Grid)
- 🗂️ Filter by categories (Today, Important, Earlier, etc.)
- 🔤 Sort tasks by various criteria
- ⭐ Quick access to starred tasks

### Authentication

- 🔐 Email/password authentication
- 🌐 Google OAuth integration

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, TanStack Router
- **Styling**: Tailwind CSS, Shadcn UI components
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Build Tool**: Vite

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── task-card.tsx   # Individual task display
│   ├── task-form.tsx   # Task creation/editing form
│   ├── task-detail.tsx # Detailed task view
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
│   └── firebase/       # Firebase configuration
├── routes/             # Application routes
├── stores/             # Zustand state management
├── schemas/            # Zod validation schemas
└── styles/             # Global styles
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Firebase](https://firebase.google.com/) for backend services
- [Framer Motion](https://www.framer.com/motion/) for animations
