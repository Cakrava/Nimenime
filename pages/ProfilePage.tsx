import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import { Anime } from '../types';
import Spinner from '../components/Spinner';
import AnimeCard from '../components/AnimeCard';
import { Navigate } from 'react-router-dom';

const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

const ProfilePage: React.FC = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [favorites, setFavorites] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'favorites' | 'lastWatch' | 'settings'>('favorites');

    useEffect(() => {
        const fetchFavorites = async () => {
            if (isAuthenticated) {
                try {
                    setLoading(true);
                    const favs = await api.getUserFavorites();
                    setFavorites(favs.data);
                } catch (error) {
                    console.error("Failed to fetch favorites:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (activeTab === 'favorites') {
            fetchFavorites();
        }
    }, [isAuthenticated, activeTab]);

    if (authLoading) {
        return <div className="h-[80vh] flex items-center justify-center"><Spinner /></div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    if (!user) {
        return <div className="text-center p-8">Could not load user profile.</div>
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'favorites':
                if (loading) return <Spinner />;
                return (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-8">
                        {favorites.length > 0 ? (
                            favorites.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)
                        ) : (
                            <p className="col-span-full text-center text-gray-400">No favorite anime yet.</p>
                        )}
                    </div>
                );
            case 'lastWatch':
                 return <p className="text-center text-gray-400 mt-8">Last watch history is coming soon!</p>;
            case 'settings':
                return (
                    <div className="bg-card p-8 rounded-lg mt-8 max-w-lg mx-auto">
                        <h3 className="text-xl font-bold text-primary mb-6">Settings</h3>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Language</label>
                            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary">
                                <option>English</option>
                                <option>Indonesia</option>
                            </select>
                        </div>
                        <button className="w-full bg-primary text-background font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors">
                            Apply
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 animate-fade-in">
            <div className="bg-card p-8 rounded-lg">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0 text-center">
                        <img src={user.avatar} alt={user.username} className="w-32 h-32 rounded-full border-4 border-primary object-cover"/>
                        <p className="mt-4 text-lg font-bold">Level {user.level}</p>
                    </div>
                    <div className="flex-grow w-full">
                        <h2 className="text-3xl font-bold text-primary">{user.username}</h2>
                        <p className="text-gray-400">{user.email}</p>
                        <div className="mt-4">
                            <div className="flex justify-between items-center text-sm text-gray-300 mb-1">
                                <span>EXP</span>
                                <span>{user.xp} / {user.xpForNextLevel}</span>
                            </div>
                            <ProgressBar value={user.xp} max={user.xpForNextLevel} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center border-b border-gray-700">
                <button onClick={() => setActiveTab('favorites')} className={`px-6 py-3 font-semibold ${activeTab === 'favorites' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Favorites</button>
                <button onClick={() => setActiveTab('lastWatch')} className={`px-6 py-3 font-semibold ${activeTab === 'lastWatch' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Last Watch</button>
                <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 font-semibold ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Settings</button>
            </div>
            
            <div>{renderContent()}</div>
        </div>
    );
};

export default ProfilePage;