import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Anime, Pagination as PaginationType } from '../types';
import Spinner from '../components/Spinner';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';

const AnimeListPage: React.FC = () => {
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [pagination, setPagination] = useState<PaginationType | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.getAnimeList({ page: currentPage, limit: 20, order_by: 'score', sort: 'desc' });
                setAnimeList(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load anime.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnime();
    }, [currentPage]);

    if (loading) {
        return <div className="h-[80vh] flex items-center justify-center"><Spinner /></div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-400">{error}</div>;
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-primary mb-8">All Anime</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {animeList.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)}
            </div>
            {pagination && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.last_visible_page}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default AnimeListPage;