import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/api';
import { AnimeFull, Episode } from '../types';
import Spinner from '../components/Spinner';

const WatchPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [anime, setAnime] = useState<AnimeFull | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentEpisode, setCurrentEpisode] = useState(1);
    
    useEffect(() => {
        const fetchWatchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [animeRes, episodesRes] = await Promise.all([
                    api.getAnimeById(id),
                    api.getAnimeEpisodes(id)
                ]);
                setAnime(animeRes.data);
                setEpisodes(episodesRes.data);
                if (episodesRes.data.length > 0) {
                    setCurrentEpisode(episodesRes.data[0].mal_id);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load anime data.");
            } finally {
                setLoading(false);
            }
        };
        fetchWatchData();
    }, [id]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-400">{error}</div>;
    }

    if (!anime) {
        return <div className="text-center p-8">Anime not found.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 h-screen max-h-screen overflow-hidden">
            {/* Left: Episode Picker */}
            <div className="lg:col-span-2 bg-card rounded-lg p-4 overflow-y-auto">
                <h3 className="text-lg font-bold text-primary mb-4">Episodes</h3>
                <div className="flex flex-col gap-2">
                    {episodes.length > 0 ? (
                        episodes.map(ep => (
                            <button 
                                key={ep.mal_id}
                                onClick={() => setCurrentEpisode(ep.mal_id)}
                                className={`w-full text-left p-3 rounded ${currentEpisode === ep.mal_id ? 'bg-primary text-background' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                Episode {ep.mal_id}
                            </button>
                        ))
                    ) : (
                         <p className="text-gray-400 text-sm">No episodes available yet.</p>
                    )}
                </div>
            </div>

            {/* Middle: Player Box */}
            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Video Player Mockup for Episode {currentEpisode}</p>
                </div>
                <div className="bg-card rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">{anime.title} - Episode {currentEpisode}</h2>
                    </div>
                    <div className="flex gap-2">
                         <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>Pucuk</option>
                            <option>Nakama</option>
                        </select>
                         <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>1080p</option>
                            <option>720p</option>
                            <option>480p</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Right: Anime Details */}
            <div className="lg:col-span-3 bg-card rounded-lg p-4 overflow-y-auto">
                 <img src={anime.images.jpg.image_url} alt={anime.title} className="w-full rounded-md mb-4"/>
                <h3 className="text-lg font-bold text-primary mb-2">{anime.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-5 mb-4">{anime.synopsis}</p>
                <div className="text-sm space-y-1 text-gray-300">
                    <p><strong>Studio:</strong> {anime.studios.map(s => s.name).join(', ')}</p>
                    <p><strong>Status:</strong> {anime.status}</p>
                    <p><strong>Score:</strong> {anime.score}</p>
                </div>
                 <Link to={`/anime/${anime.mal_id}`} className="mt-4 block w-full text-center bg-primary/20 text-primary py-2 rounded hover:bg-primary/40 transition-colors">
                     View Details
                 </Link>
            </div>
        </div>
    );
};

export default WatchPage;