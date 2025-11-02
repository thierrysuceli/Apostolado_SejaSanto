import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Posts from './pages/Posts';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleNavigate = (page, courseId = null) => {
    setCurrentPage(page);
    if (courseId) {
      setSelectedCourseId(courseId);
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'cursos':
        return <Courses onNavigate={handleNavigate} />;
      case 'curso-detalhe':
        return <CourseDetail courseId={selectedCourseId} onNavigate={handleNavigate} />;
      case 'postagens':
        return <Posts onNavigate={handleNavigate} />;
      case 'calendario':
        return <Calendar onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'perfil':
        return <Profile onNavigate={handleNavigate} />;
      case 'admin':
        return <Admin onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <main>
          {renderPage()}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
