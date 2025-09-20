import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import { Anime, Genre } from '../types';
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {animes.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)}
        </div>
    </section>
);


const GenresSection: React.FC<{ genres: Genre[] }> = ({ genres }) => (
    <section className="bg-card p-6 rounded-lg">
        <h3 className="text-xl font-bold text-primary mb-4">Genres</h3>
        <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
                <Link key={genre.mal_id} to={`/genre/${genre.mal_id}/${genre.name.toLowerCase()}`} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-background transition-colors">
                    {genre.name}
                </Link>
            ))}
        </div>
    </section>
);


const HomePage: React.FC = () => {
    const [popular, setPopular] = useState<Anime[]>([]);
    const [seasonNow, setSeasonNow] = useState<Anime[]>([]);
    const [completed, setCompleted] = useState<Anime[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                setLoading(true);
                const [popularRes, seasonNowRes, completedRes, genresRes] = await Promise.all([
                    api.getTopAnime('bypopularity', 10),
                    api.getSeasonNow(10),
                    api.getCompletedAnime(10),
                    api.getGenres()
                ]);
                setPopular(popularRes.data);
                setSeasonNow(seasonNowRes.data);
                setCompleted(completedRes.data);
                setGenres(genresRes.data);
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
                {completed.length > 0 && <AnimeGrid title="Recently Completed" animes={completed} />}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-12">
                    <div className="lg:col-span-2">
                        {/* You can add more lists like Most Favorited here */}
                    </div>
                    <div>
                        {genres.length > 0 && <GenresSection genres={genres} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;