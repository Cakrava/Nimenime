import React, { useState, FormEvent } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import WatchPage from './pages/WatchPage';
import AnimeListPage from './pages/AnimeListPage';
import OngoingPage from './pages/OngoingPage';
import GenreListPage from './pages/GenreListPage';
import GenrePage from './pages/GenrePage';
import SchedulePage from './pages/SchedulePage';
import SearchPage from './pages/SearchPage';

import { MenuIcon, CloseIcon, SearchIcon, UserIcon } from './components/Icons';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <MainLayout />
            </HashRouter>
        </AuthProvider>
    );
};

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const noLayoutPaths = ['/login', '/watch/'];
    const isFullLayoutPage = !noLayoutPaths.some(path => location.pathname.startsWith(path));
    
    // On small screens, start with the sidebar closed.
    React.useEffect(() => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, []);
    
    return (
        <div className="min-h-screen bg-background font-sans">
            {isFullLayoutPage && <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />}
            <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isFullLayoutPage && isSidebarOpen ? 'lg:pl-64' : ''}`}>
                {isFullLayoutPage && <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />}
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/anime/:id" element={<AnimeDetailPage />} />
                        <Route path="/watch/:id" element={<WatchPage />} />
                        <Route path="/list" element={<AnimeListPage />} />
                        <Route path="/ongoing" element={<OngoingPage />} />
                        <Route path="/genres" element={<GenreListPage />} />
                        <Route path="/genre/:genreId/:genreName" element={<GenrePage />} />
                        <Route path="/schedule" element={<SchedulePage />} />
                        <Route path="/search/:query" element={<SearchPage />} />
                        <Route path="*" element={<div className="p-8 text-center">404 - Page Not Found</div>} />
                    </Routes>
                </main>
                {isFullLayoutPage && <Footer />}
            </div>
        </div>
    );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate('/');
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search/${searchQuery.trim()}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg flex items-center justify-between p-4 shadow-md">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="text-gray-300 hover:text-primary h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-700/50 transition-colors">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <form onSubmit={handleSearch} className="relative">
                    <input 
                        type="text" 
                        placeholder="Search anime..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-full pl-10 pr-4 py-2 h-10 w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </form>
            </div>
            <div className="relative">
                {isAuthenticated && user ? (
                    <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-2">
                        <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                        <span className="hidden md:block">{user.username}</span>
                    </button>
                ) : (
                    <Link to="/login" className="bg-primary text-background font-bold px-4 py-2 rounded-full hover:bg-yellow-300">
                        Login
                    </Link>
                )}

                {isProfileOpen && isAuthenticated && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-xl py-2 animate-fade-in-down">
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-primary">Profile</Link>
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-primary">Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
};

const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: (isOpen: boolean) => void }> = ({ isOpen, setIsOpen }) => {
    const NavItem: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
        <NavLink to={to} onClick={() => window.innerWidth < 1024 && setIsOpen(false)} className={({isActive}) => `block px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-background font-bold' : 'hover:bg-gray-700'}`}>
            {children}
        </NavLink>
    );
    
    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <aside className={`fixed z-50 h-full bg-card/90 backdrop-blur-lg w-64 flex-shrink-0 flex flex-col p-4 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center mb-8">
                    <Link to="/" className="text-2xl font-bold text-primary">Nimenime</Link>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex flex-col gap-2">
                    <NavItem to="/">Home</NavItem>
                    <NavItem to="/list">Anime List</NavItem>
                    <NavItem to="/ongoing">Ongoing</NavItem>
                    <NavItem to="/genres">Genre List</NavItem>
                    <NavItem to="/schedule">Schedule</NavItem>
                </nav>
            </aside>
        </>
    );
};

const Footer: React.FC = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return (
        <footer className="bg-card p-6 mt-auto">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 mb-4 text-sm">
                <Link to="/search/all" className="hover:text-primary">All</Link>
                {alphabet.map(letter => (
                    <Link key={letter} to={`/search/${letter}`} className="hover:text-primary">{letter}</Link>
                ))}
            </div>
            <p className="text-center text-gray-400 text-sm">© 2025 Nimenime. All rights reserved.</p>
        </footer>
    );
};

export default App;