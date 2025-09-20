import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import { Anime } from '../types';
import Spinner from '../components/Spinner';
import AnimeCard from '../components/AnimeCard';
import { PlayIcon, HeartIcon } from '../components/Icons';

const HeroSection: React.FC<{ anime: Anime }> = ({ anime }) => (
    <div className="relative h-[60vh] -mx-4 md:-mx-8 lg:-mx-16 -mt-16">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent z-20"></div>
        <div className="absolute inset-0 flex items-center z-30 p-4 md:p-8 lg:p-16">
            <div className="w-full md:w-1/2 lg:w-1/3 text-white">
                <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">{anime.title}</h1>
                <p className="text-gray-300 mb-6 line-clamp-3">{anime.synopsis}</p>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-primary font-bold text-lg">⭐ {anime.score}</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to={`/watch/${anime.mal_id}`} className="flex items-center gap-2 bg-primary text-background font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition-colors">
                        <PlayIcon className="w-6 h-6"/>
                        <span>Watch Now</span>
                    </Link>
                    <button className="p-4 bg-card rounded-full text-white hover:text-accent-1 transition-colors">
                        <HeartIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
);


const AnimeGrid: React.FC<{ title: string; animes: Anime[] }> = ({ title, animes }) => (
    <section className="my-12">
        <h2 className="text-2xl font-bold text-primary mb-6">{title}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {animes.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)}
        </div>
    </section>
);

const AnimeListItem: React.FC<{ anime: Anime }> = ({ anime }) => (
    <Link to={`/anime/${anime.mal_id}`} className="flex items-start gap-4 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
        <img src={anime.images.jpg.image_url} alt={anime.title} className="w-12 h-16 object-cover rounded flex-shrink-0" />
        <div className="flex-1">
            <h4 className="font-semibold text-sm line-clamp-2 text-white hover:text-primary transition-colors">{anime.title}</h4>
            <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                <span>⭐ {anime.score || 'N/A'}</span>
                {anime.genres[0] && <span>• {anime.genres[0].name}</span>}
            </div>
        </div>
    </Link>
);

const AnimeSidebarList: React.FC<{ title: string; animes: Anime[] }> = ({ title, animes }) => (
    <section className="bg-card p-4 rounded-lg h-full">
        <h3 className="text-xl font-bold text-primary mb-4">{title}</h3>
        <div className="flex flex-col gap-3">
            {animes.map(anime => <AnimeListItem key={anime.mal_id} anime={anime} />)}
        </div>
    </section>
);


const HomePage: React.FC = () => {
    const [popular, setPopular] = useState<Anime[]>([]);
    const [seasonNow, setSeasonNow] = useState<Anime[]>([]);
    const [completedByDate, setCompletedByDate] = useState<Anime[]>([]);
    const [mostFavorited, setMostFavorited] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                setLoading(true);
                const [
                    popularRes, 
                    seasonNowRes, 
                    completedRes, 
                    mostFavoritedRes,
                ] = await Promise.all([
                    api.getTopAnime('bypopularity', 6),
                    api.getSeasonNow(12),
                    api.getAnimeList({ status: 'complete', order_by: 'end_date', sort: 'desc', limit: 20 }),
                    api.getTopAnime('favorite', 5),
                ]);
                setPopular(popularRes.data);
                setSeasonNow(seasonNowRes.data);
                setCompletedByDate(completedRes.data);
                setMostFavorited(mostFavoritedRes.data);
            } catch (error) {
                console.error("Failed to fetch homepage data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomePageData();
    }, []);

    if (loading) {
        return <div className="h-[80vh] flex items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="animate-fade-in">
            {popular.length > 0 && <HeroSection anime={popular[0]} />}

            <div className="p-4 md:p-8 lg:p-16">
                {seasonNow.length > 0 && <AnimeGrid title="Anime Today" animes={seasonNow} />}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
                    {popular.length > 0 && <AnimeSidebarList title="Most Popular" animes={popular} />}
                    {mostFavorited.length > 0 && <AnimeSidebarList title="Most Favorited" animes={mostFavorited} />}
                </div>

                {completedByDate.length > 0 && (
                    <section className="my-12">
                        <h2 className="text-2xl font-bold text-primary mb-6">Recently Completed</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {completedByDate.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)}
                        </div>
                        <div className="text-center mt-8">
                             <Link to="/list" className="bg-primary text-background font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition-colors">
                                View More
                            </Link>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default HomePage;