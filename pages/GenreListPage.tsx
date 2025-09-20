import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import { Genre } from '../types';
import Spinner from '../components/Spinner';

const GenreListPage: React.FC = () => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.getGenres();
                setGenres(response.data);
            } catch (err: any) {
                setError(err.message || "Failed to load genres.");
            } finally {
                setLoading(false);
            }
        };
        fetchGenres();
    }, []);

    if (loading) {
        return <div className="h-[80vh] flex items-center justify-center"><Spinner /></div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-400">{error}</div>;
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-primary mb-8">Browse by Genre</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genres.map(genre => (
                    <Link
                        key={genre.mal_id}
                        to={`/genre/${genre.mal_id}/${genre.name.toLowerCase()}`}
                        className="bg-card p-4 rounded-lg text-center font-semibold text-gray-200 hover:bg-primary hover:text-background transition-colors shadow-md"
                    >
                        {genre.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GenreListPage;