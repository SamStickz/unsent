import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "../layout/AuthLayout";
import AppLayout from "../layout/AppLayout";
import RequireAuth from "../auth/RequireAuth";

import Home from "../pages/Home";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import Dashboard from "../pages/Dashboard";
import EntryList from "../entries/EntryList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/forgot", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: "/app", element: <Dashboard /> },
      { path: "/app/entries", element: <EntryList /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
