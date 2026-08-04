import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedLayout } from "./layouts/AuthenticatedLayout.js";
import { LoginPage } from "./pages/LoginPage.js";
import { HomePage } from "./pages/HomePage.js";
import { CreatePostPage } from "./pages/CreatePostPage.js";
import { MyActivityPage } from "./pages/MyActivityPage.js";
import { JournalPage } from "./pages/JournalPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import { ReviewDetailPage } from "./pages/ReviewDetailPage.js";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/my-activity" element={<MyActivityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reviews/:id" element={<ReviewDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
