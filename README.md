# DBC HRIS Web Frontend

A modern React 19.2 web application built with Vite for managing HR and attendance systems.

## Features

- **Authentication**: Login and registration with JWT tokens
- **Dashboard**: Overview of employees and daily attendance
- **Employee Management**: Add, edit, delete, and search employees
- **Attendance Review**: View and approve/reject attendance records with photos and GPS data
- **Bulk Import**: CSV import functionality for employees
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- **React 19.2** - Latest React with new features
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

## Prerequisites

- Node.js >= 20.19.4
- npm or yarn
- DBC HRIS API running on http://localhost:8080

## Installation

1. Clone the repository and navigate to the web frontend:
   ```bash
   cd dbc-hris-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the API URL in `.env` if needed:
   ```
   VITE_API_URL=http://localhost:8080
   ```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Employees.tsx   # Employee management
│   ├── Attendance.tsx  # Attendance review
│   └── Import.tsx      # CSV import functionality
├── services/           # API services
│   └── api.ts          # Axios configuration and API calls
├── types/              # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   ├── employee.ts     # Employee types
│   └── attendance.ts   # Attendance types
├── App.tsx             # Main app component with routing
└── main.tsx            # Application entry point
```

## API Integration

The frontend integrates with the DBC HRIS API for:

- **Authentication**: Login/register endpoints
- **Employee Management**: CRUD operations for employees
- **Attendance**: Fetching and managing attendance records
- **File Upload**: CSV import for bulk employee creation

## Features Overview

### Authentication
- JWT-based authentication
- Protected routes
- Automatic token refresh
- Persistent login state

### Dashboard
- Employee count statistics
- Daily attendance overview
- Recent attendance records
- Status indicators

### Employee Management
- Employee listing with search
- Add/edit/delete employees
- Department and position management
- Status tracking

### Attendance Review
- Filter by date range, employee, status
- View attendance photos and GPS location
- Approve/reject attendance records
- Detailed attendance information modal

### CSV Import
- Download CSV template
- Drag & drop file upload
- Bulk employee import
- Import results with error reporting

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: http://localhost:8080)

## Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for type safety
3. Follow React best practices and hooks patterns
4. Use Tailwind CSS for styling
5. Add proper error handling and loading states

## License

This project is part of the DBC HRIS system.