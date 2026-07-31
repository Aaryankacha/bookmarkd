import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Genre from './pages/Genre';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import LiveSession from './pages/LiveSession';
import Clubs from './pages/Clubs';
import ClubDetails from './pages/ClubDetails';
import Lists from './pages/Lists';
import Login from './pages/Login';
import Register from './pages/Register';
import MangaHome from './pages/manga/MangaHome';
import MangaDetails from './pages/manga/MangaDetails';
import ManhwaHome from './pages/manhwa/ManhwaHome';
import ManhwaDetails from './pages/manhwa/ManhwaDetails';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#1D1D1F] selection:bg-[#D4A65A]/20">
        <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} />
        <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        
        <div className="flex flex-1">
          <main className="flex-1 w-full relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/genre/:genreName" element={<Genre />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/u/:username" element={<UserProfile />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/clubs/:id" element={<ClubDetails />} />
              <Route path="/session/:sessionId" element={<ProtectedRoute><LiveSession /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/manga" element={<MangaHome />} />
              <Route path="/manga/:id" element={<MangaDetails />} />
              <Route path="/manhwa" element={<ManhwaHome />} />
              <Route path="/manhwa/:id" element={<ManhwaDetails />} />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/lists" element={
                <ProtectedRoute>
                  <Lists />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
