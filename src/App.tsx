// src/App.tsx
import { createHashRouter, RouterProvider } from 'react-router';
import { Layout } from './components/Layout';
import { Inventory } from './pages/Inventory';
import { Cocktails } from './pages/Cocktails';
import { DailyCloseout } from './pages/DailyCloseout';
import { Reports } from './pages/Reports';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Inventory /> }, // Default / Home
      { path: 'cocktails', element: <Cocktails /> },
      { path: 'daily-closeout', element: <DailyCloseout /> },
      { path: 'reports', element: <Reports /> },
      { path: '*', element: <div>404 Page Not Found</div> }
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;