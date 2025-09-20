import React from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '../types';
import { PlayIcon, HeartIcon } from './Icons';

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <div className="relative group">
      <Link 
        to={`/anime/${anime.mal_id}`} 
        className="block aspect-[2/3] rounded-lg overflow-hidden shadow-lg"
      >
        <img 
          src={anime.images.jpg.large_image_url} 
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-primary text-background font-bold text-sm px-2 py-1 rounded">
          {anime.score || 'N/A'}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <h3 className="font-bold text-white group-hover:text-primary transition-colors duration-300 line-clamp-2 text-sm">{anime.title}</h3>
        </div>
      </Link>
      
      {/* Hover Popup Detail Box */}
      <div 
        className="absolute left-full top-0 ml-2 w-72 bg-card rounded-lg shadow-2xl p-4 z-20 
                   invisible opacity-0 group-hover:visible group-hover:opacity-100 
                   transition-all duration-300 transform group-hover:translate-x-0"
        style={{ pointerEvents: 'none' }} // Let clicks pass through to the card link
      >
        <h3 className="text-lg font-bold text-primary line-clamp-2">{anime.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-4 mt-2 mb-3">{anime.synopsis}</p>
        <div className="text-xs text-gray-400 mb-2">
            {anime.studios.map(s => s.name).join(', ')}
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
            {anime.genres.slice(0, 3).map(genre => (
                <span key={genre.name} className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded-full">{genre.name}</span>
            ))}
        </div>
        <div className="flex items-center gap-4 mt-auto" style={{ pointerEvents: 'auto' }}>
            <Link to={`/watch/${anime.mal_id}`} className="flex-grow flex items-center justify-center gap-2 bg-primary text-background font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors">
              <PlayIcon className="w-5 h-5" />
              <span>Watch Now</span>
            </Link>
            <button className="p-3 bg-gray-700 rounded-full text-white hover:text-accent-1 transition-colors">
              <HeartIcon className="w-5 h-5"/>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;