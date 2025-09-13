import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import SubjectListPage from './pages/admin/SubjectListPage';
import SubjectEditPage from './pages/admin/SubjectEditPage';
import CourseListPage from './pages/admin/CourseListPage';
import CourseEditPage from './pages/admin/CourseEditPage';
import AvailableCoursesPage from './pages/AvailableCoursesPage';
import MyCoursesPage from './pages/MyCoursesPage';
import TeachingPage from './pages/TeachingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas Públicas */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Rutas Privadas (para todos los usuarios logueados) */}
        <Route element={<PrivateRoute />}>
          <Route path="courses" element={<AvailableCoursesPage />} />
          <Route path="my-courses" element={<MyCoursesPage />} />
          <Route path="teaching" element={<TeachingPage />} />
        </Route>

        {/* Rutas de Admin */}
        <Route element={<AdminRoute />}>
          <Route path="admin/subjects" element={<SubjectListPage />} />
          <Route path="admin/subject/create" element={<SubjectEditPage />} />
          <Route path="admin/subject/:id/edit" element={<SubjectEditPage />} />
          <Route path="admin/courses" element={<CourseListPage />} />
          <Route path="admin/course/create" element={<CourseEditPage />} />
          <Route path="admin/course/:id/edit" element={<CourseEditPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
