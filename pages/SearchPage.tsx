import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
import { Anime, Pagination as PaginationType } from '../types';
import Spinner from '../components/Spinner';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';

const SearchPage: React.FC = () => {
    const { query } = useParams<{ query: string }>();
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [pagination, setPagination] = useState<PaginationType | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            try {
                setLoading(true);
                setError(null);
                const params: { [key: string]: string | number } = { page: currentPage, limit: 20 };
                if (query.length === 1 && /^[a-zA-Z]$/.test(query)) {
                    params['letter'] = query;
                } else if (query.toLowerCase() !== 'all') {
                    params['q'] = query;
                }
                
                const response = await api.getAnimeList(params);
                setAnimeList(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            } catch (err: any) {
                setError(err.message || "Failed to perform search.");
            } finally {
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [query, currentPage]);
    
    // Reset page to 1 when query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    if (loading) {
        return <div className="h-[80vh] flex items-center justify-center"><Spinner /></div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-400">{error}</div>;
    }
    
    const displayQuery = query?.toLowerCase() === 'all' ? 'All Anime' : `Results for: "${query}"`;

    return (
        <div className="p-4 md:p-8 lg:p-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-primary mb-8">{displayQuery}</h1>
             {animeList.length > 0 ? (
                <>
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
                </>
            ) : (
                <p className="text-center text-gray-400 mt-8">No results found.</p>
            )}
        </div>
    );
};

export default SearchPage;