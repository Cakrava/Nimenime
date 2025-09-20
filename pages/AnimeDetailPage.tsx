import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/api';
import { AnimeFull, Episode } from '../types';
import Spinner from '../components/Spinner';
import { PlayIcon, HeartIcon } from '../components/Icons';

const AnimeDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [anime, setAnime] = useState<AnimeFull | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnime = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [animeResponse, episodesResponse] = await Promise.all([
                    api.getAnimeById(id),
                    api.getAnimeEpisodes(id)
                ]);
                setAnime(animeResponse.data);
                setEpisodes(episodesResponse.data);
            } catch (err: any) {
                setError(err.message || "Failed to load anime details.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnime();
    }, [id]);

    if (loading) {
        return <div className="h-[80vh] flex items-center justify-center"><Spinner /></div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-400">{error}</div>;
    }

    if (!anime) {
        return <div className="text-center p-8">Anime not found.</div>;
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8 bg-card p-8 rounded-lg">
                <div className="md:w-1/3 flex-shrink-0">
                    <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full rounded-lg shadow-lg"/>
                </div>
                <div className="md:w-2/3">
                    <h1 className="text-4xl font-bold text-primary mb-2">{anime.title}</h1>
                    <div className="flex items-center gap-4 text-gray-400 mb-4 flex-wrap">
                        <span>⭐ {anime.score}</span>
                        <span>•</span>
                        <span>{anime.status}</span>
                        <span>•</span>
                        <span>Episodes: {episodes.length} / {anime.episodes || '?'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {anime.genres.map(g => (
                            <span key={g.name} className="text-sm bg-gray-700 text-gray-200 px-3 py-1 rounded-full">{g.name}</span>
                        ))}
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-6">{anime.synopsis}</p>

                     <div className="flex items-center gap-4">
                        <Link to={`/watch/${anime.mal_id}`} className="flex items-center gap-2 bg-primary text-background font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition-colors">
                            <PlayIcon className="w-6 h-6"/>
                            <span>Watch Now</span>
                        </Link>
                        <button className="p-4 bg-gray-700 rounded-full text-white hover:text-accent-1 transition-colors">
                            <HeartIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                 <h2 className="text-2xl font-bold text-primary mb-4">Episodes</h2>
                 <p className="text-gray-400">Episode list will be displayed here.</p>
                 {/* Episode list would be rendered here, linking to the watch page for each */}
            </div>
        </div>
    );
};

export default AnimeDetailPage;