import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedLayout } from "./layouts/AuthenticatedLayout.js";
import { LoginPage } from "./pages/LoginPage.js";
import { HomePage } from "./pages/HomePage.js";
import { ActivityPage } from "./pages/ActivityPage.js";
import { JournalPage } from "./pages/JournalPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
