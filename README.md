# 👶 Nappi - Baby Sleep Monitoring App

Nappi is a modern web application that helps parents monitor and improve their baby's sleep patterns by tracking sleep metrics and room conditions.

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [How to Make Changes](#how-to-make-changes)
- [Understanding the Code](#understanding-the-code)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Prerequisites
You need to have installed:
- **Node.js** (version 20.19+ or 22.12+)
  - Check version: `node --version`
  - Download: https://nodejs.org/

### Installation
1. Clone the repository
2. Navigate to the project folder:
   ```bash
   cd nappi-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

## 📁 Project Structure

```
nappi-frontend/
├── src/
│   ├── api/              # Backend API calls
│   │   ├── client.ts     # Axios setup (base URL, timeout)
│   │   ├── sleep.ts      # Sleep data API functions
│   │   └── room.ts       # Room metrics API functions
│   │
│   ├── components/       # Reusable UI components
│   │   └── Layout.tsx    # Main layout with header and bottom nav
│   │
│   ├── pages/            # Different screens/pages
│   │   ├── Welcome.tsx   # Landing page
│   │   ├── Login.tsx     # Login screen
│   │   ├── Signup.tsx    # Sign up screen
│   │   ├── Onboarding.tsx    # Baby profile setup
│   │   ├── HomeDashboard.tsx # Main dashboard
│   │   ├── Statistics.tsx    # Sleep statistics
│   │   ├── Notifications.tsx # Alerts and notifications
│   │   └── UserProfile.tsx   # User settings
│   │
│   ├── types/            # TypeScript type definitions
│   │   └── metrics.ts    # Data structure types
│   │
│   ├── App.tsx           # Main app with routing
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
│
├── public/               # Static files
├── package.json          # Dependencies and scripts
└── README.md             # This file!
```

---

## 🏃 How to Run

### Development Mode
Start the development server (auto-reloads on changes):
```bash
npm run dev
```
Then open: http://localhost:5173

### Build for Production
Create an optimized production build:
```bash
npm run build
```

### Preview Production Build
Test the production build locally:
```bash
npm run preview
```

### Check for Errors
Run TypeScript type checking:
```bash
npx tsc --noEmit
```

Run linter:
```bash
npm run lint
```

---

## 🔧 How to Make Changes

### Adding a New Page

1. **Create the page file** in `src/pages/`:
   ```tsx
   // src/pages/MyNewPage.tsx
   import React from 'react';
   
   const MyNewPage: React.FC = () => {
     return (
       <div>
         <h2>My New Page</h2>
         <p>Content goes here</p>
       </div>
     );
   };
   
   export default MyNewPage;
   ```

2. **Add the route** in `src/App.tsx`:
   ```tsx
   import MyNewPage from './pages/MyNewPage';
   
   // Inside the <Routes>:
   <Route path="/my-page" element={<Layout><MyNewPage /></Layout>} />
   ```

3. **Add navigation** (if needed) in `src/components/Layout.tsx`

### Modifying Styles

**Option 1: Inline Styles** (current approach)
```tsx
<div style={{ 
  color: '#333', 
  padding: '1rem',
  background: 'white'
}}>
  Content
</div>
```

**Option 2: CSS File** (create alongside component)
```tsx
// MyComponent.css
.my-class {
  color: #333;
  padding: 1rem;
}

// MyComponent.tsx
import './MyComponent.css';
<div className="my-class">Content</div>
```

### Adding New API Calls

1. **Add function** in `src/api/` folder:
   ```tsx
   // src/api/mydata.ts
   import { api } from './client';
   
   export async function fetchMyData() {
     const response = await api.get('/my-endpoint');
     return response.data;
   }
   ```

2. **Use in component**:
   ```tsx
   import { fetchMyData } from '../api/mydata';
   
   const loadData = async () => {
     const data = await fetchMyData();
     console.log(data);
   };
   ```

---

## 📚 Understanding the Code

### Key Concepts for Non-React Developers

#### 1. **Components** = Building Blocks
Think of components as reusable pieces of UI:
```tsx
const Button = () => {
  return <button>Click me</button>;
};
```

#### 2. **State** = Data that Changes
Use `useState` to store data that can change:
```tsx
const [count, setCount] = useState(0);  // Start at 0
setCount(5);  // Update to 5
```

#### 3. **Effects** = Do Something on Load
Use `useEffect` to run code when the page loads:
```tsx
useEffect(() => {
  console.log('Page loaded!');
}, []);  // Empty [] means "only run once"
```

#### 4. **Async/Await** = Wait for Data
Use when fetching data from APIs:
```tsx
const loadData = async () => {
  const data = await fetchSomething();  // Wait here
  console.log(data);  // Then use it
};
```

#### 5. **Props** = Pass Data to Components
```tsx
const Greeting = ({ name }) => {
  return <h1>Hello {name}!</h1>;
};

// Usage:
<Greeting name="Sarah" />
```

### Understanding the User Flow

```
1. /welcome     → Landing page with "let's nap!" button
2. /login       → User enters credentials
3. /onboarding  → Set up baby profile
4. /            → Main dashboard (home)
   ├── View last sleep summary
   ├── See room conditions
   └── Get recommendations
```

Bottom navigation allows switching between:
- 🏠 Home (`/`)
- 📊 Stats (`/statistics`)
- 🔔 Alerts (`/notifications`)
- 👤 Profile (`/user`)

---

## ✅ Common Tasks

### Task: Add a Refresh Button
```tsx
const MyPage = () => {
  const [data, setData] = useState(null);
  
  const loadData = async () => {
    const result = await fetchData();
    setData(result);
  };
  
  useEffect(() => {
    loadData();  // Load on page open
  }, []);
  
  return (
    <div>
      <button onClick={loadData}>Refresh</button>
      {data && <p>{data.value}</p>}
    </div>
  );
};
```

### Task: Show Loading State
```tsx
const [loading, setLoading] = useState(true);

const loadData = async () => {
  setLoading(true);
  const data = await fetchData();
  setLoading(false);
};

if (loading) return <p>Loading...</p>;
return <div>Data loaded!</div>;
```

### Task: Navigate to Another Page
```tsx
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/other-page')}>
      Go to Other Page
    </button>
  );
};
```

### Task: Display a List
```tsx
const items = ['Apple', 'Banana', 'Cherry'];

return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

---

## 🐛 Troubleshooting

### "Module not found" error
- Make sure the file path is correct
- Check that the file has `export default` at the end
- Run `npm install` again

### "Cannot find module" for a package
```bash
npm install package-name
```

### Changes not showing up
- Make sure the dev server is running (`npm run dev`)
- Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check the terminal for errors

### TypeScript errors
- Check the type definitions in `src/types/`
- Make sure variables have the correct type
- Run `npx tsc --noEmit` to see all errors

### Port already in use
If port 5173 is busy:
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or change the port in vite.config.ts
```

---

## 🔗 Useful Resources

- [React Documentation](https://react.dev/learn) - Official React guide
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Learn TypeScript
- [React Router](https://reactrouter.com/) - Navigation between pages
- [Axios Documentation](https://axios-http.com/) - Making API calls

---

## 👥 Team Guidelines

### Before You Start Working
1. Pull the latest changes: `git pull`
2. Install any new dependencies: `npm install`
3. Start the dev server: `npm run dev`

### Before You Commit
1. Check for errors: `npm run build`
2. Fix any linter issues: `npm run lint`
3. Test your changes in the browser

### Need Help?
- Check this README first
- Look at existing similar code
- Ask the team in your chat
- Search for the error message online

---

## 📝 Notes

- **Backend API**: Currently configured to run at `http://localhost:8000`
  - Update in `src/api/client.ts` if your backend uses a different URL
- **Authentication**: Login/Signup are placeholders - backend integration needed
- **Mock Data**: Some pages show example data until backend is connected

---

## 🎨 Design System

### Colors
- **Primary Yellow**: `#FFD166` - Buttons, active states
- **Light Blue**: `#E6F7FF` - Backgrounds, gradients
- **Peachy Pink**: `#FFE4E1` - Backgrounds, gradients
- **Teal**: `#B4E7E5` - Baby avatar, accents
- **Text Dark**: `#1F2937` - Main text
- **Text Gray**: `#6B7280` - Secondary text
- **Background**: `#F8F9FA` - Page background

### Component Patterns
All cards follow this pattern:
```tsx
<div style={{
  background: 'white',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}}>
  {/* Content */}
</div>
```

---

**Happy coding! 🚀**
