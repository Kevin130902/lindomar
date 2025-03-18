import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router';

import './base.css';

import { useToken } from './hooks/use-token';

import { Layout } from './layout';

import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { NotFoundPage } from './pages/404';

function AuthRoute() {
  if (useToken()) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}

createRoot(document.getElementById('root')!).render(
  <Layout>
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route index element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </Layout>,
);
