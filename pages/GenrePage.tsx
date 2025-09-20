import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
import { Anime, Pagination as PaginationType } from '../types';
import Spinner from '../components/Spinner';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';

const GenrePage: React.FC = () => {
    const { genreId, genreName } = useParams<{ genreId: string; genreName: string }>();
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [pagination, setPagination] = useState<PaginationType | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnimeByGenre = async () => {
            if (!genreId) return;
            try {
                setLoading(true);
                setError(null);
                const response = await api.getAnimeList({ genres: genreId, page: currentPage, limit: 24 });
                setAnimeList(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            } catch (err: any) {
                setError(err.message || `Failed to load anime for genre.`);
            } finally {
                setLoading(false);
            }
        };
        fetchAnimeByGenre();
    }, [genreId, currentPage]);
    
    // Reset page to 1 when genre changes
    useEffect(() => {
        setCurrentPage(1);
    }, [genreId]);


    if (loading) {
        return <div className="h-[80vh] flex items-center justify-center"><Spinner /></div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-400">{error}</div>;
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-primary mb-8 capitalize">{genreName} Anime</h1>
            {animeList.length > 0 ? (
                <>
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {animeList.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)}
                    </div>
                    {pagination && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination.last_visible_page}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            ) : (
                <p className="text-center text-gray-400 mt-8">No anime found for this genre.</p>
            )}
        </div>
    );
};

export default GenrePage;