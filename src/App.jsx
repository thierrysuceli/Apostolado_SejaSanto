import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';
import { ThemeProvider } from './contexts/ThemeContext';
import HeaderNew from './components/HeaderNew';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetailNew from './pages/CourseDetailNew';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Artigos from './pages/Artigos';
import ArtigoDetail from './pages/ArtigoDetail';
import Noticias from './pages/Noticias';
import NoticiaDetail from './pages/NoticiaDetail';
import TopicDetail from './pages/TopicDetail';
import Calendar from './pages/Calendar';
import Central from './pages/Central';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminContentEditor from './pages/AdminContentEditor';
import AdminCourseCreate from './pages/AdminCourseCreate';
import AdminPostCreate from './pages/AdminPostCreate';
import AdminArticleCreate from './pages/AdminArticleCreate';
import AdminNewsCreate from './pages/AdminNewsCreate';
import AdminEventCreate from './pages/AdminEventCreate';
import AdminCourseEdit from './pages/AdminCourseEdit';
import AdminPostEdit from './pages/AdminPostEdit';
import AdminEventEdit from './pages/AdminEventEdit';
import AdminCourseModules from './pages/AdminCourseModules';
import AdminTags from './pages/AdminTags';
import AdminUsers from './pages/AdminUsers';
import AdminRoles from './pages/AdminRoles';
import AdminBibleNotes from './pages/AdminBibleNotes';
import AdminEditorialColumns from './pages/admin/AdminEditorialColumns';
import AdminNewsTags from './pages/admin/AdminNewsTags';
import Biblia from './pages/Biblia';
import Liturgia from './pages/Liturgia';
import Historico from './pages/Historico';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApiProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300">
              <HeaderNew />
              <div className="flex-1 flex flex-col">
                <main className="flex-1">
                  <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/liturgia" element={<Liturgia />} />
                  <Route path="/biblia" element={<Biblia />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetailNew />} />
                  <Route path="/courses/:courseId/topics/:topicId" element={<TopicDetail />} />
                  <Route path="/courses/:courseId/modules/:moduleId/topics/:topicId" element={<TopicDetail />} />
                  <Route path="/artigos" element={<Artigos />} />
                  <Route path="/artigos/:slug" element={<ArtigoDetail />} />
                  <Route path="/noticias" element={<Noticias />} />
                  <Route path="/noticias/:slug" element={<NoticiaDetail />} />
                  <Route path="/posts" element={<Posts />} />
                  <Route path="/posts/:id" element={<PostDetail />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/central" element={<Central />} />
                  <Route path="/historico" element={<Historico />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/content-editor" element={<AdminContentEditor />} />
                  <Route path="/admin/courses/create" element={<AdminCourseCreate />} />
                  <Route path="/admin/posts/create" element={<AdminPostCreate />} />
                  <Route path="/admin/articles/create" element={<AdminArticleCreate />} />
                  <Route path="/admin/news/create" element={<AdminNewsCreate />} />
                  <Route path="/admin/events/create" element={<AdminEventCreate />} />
                  <Route path="/admin/courses/:id/edit" element={<AdminCourseEdit />} />
                  <Route path="/admin/courses/:id/modules" element={<AdminCourseModules />} />
                  <Route path="/admin/posts/:id/edit" element={<AdminPostEdit />} />
                  <Route path="/admin/events/:id/edit" element={<AdminEventEdit />} />
                  <Route path="/admin/tags" element={<AdminTags />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/roles" element={<AdminRoles />} />
                  <Route path="/admin/editorial-columns" element={<AdminEditorialColumns />} />
                  <Route path="/admin/news-tags" element={<AdminNewsTags />} />
                    <Route path="/admin/bible-notes" element={<AdminBibleNotes />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </div>
          </BrowserRouter>
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
