import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Anime } from '../types';
import Spinner from '../components/Spinner';
import AnimeCard from '../components/AnimeCard';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const SchedulePage: React.FC = () => {
    const [activeDay, setActiveDay] = useState(days[new Date().getDay() -1] || 'monday');
    const [schedule, setSchedule] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.getSchedule(activeDay);
                setSchedule(response.data);
            } catch (err: any) {
                setError(err.message || "Failed to load schedule.");
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [activeDay]);

    return (
        <div className="p-4 md:p-8 lg:p-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-primary mb-8">Weekly Schedule</h1>
            
            <div className="flex flex-wrap gap-2 border-b border-gray-700 mb-8">
                {days.map(day => (
                    <button 
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`px-4 py-2 font-semibold capitalize transition-colors ${activeDay === day ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="h-[50vh] flex items-center justify-center"><Spinner /></div>
            ) : error ? (
                <div className="text-center p-8 text-red-400">{error}</div>
            ) : (
                 schedule.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {schedule.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 mt-8">No anime scheduled for today.</p>
                )
            )}
        </div>
    );
};

export default SchedulePage;