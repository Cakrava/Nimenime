export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  xpForNextLevel: number;
}

export interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number;
  genres: { name: string; mal_id: number; }[];
  studios: { name: string }[];
  status: string;
  episodes?: number;
}

export interface AnimeFull extends Anime {
  stream_links: { episode: string; link: string }[];
}

export interface Genre {
  mal_id: number;
  name: string;
  count: number;
}

export interface Episode {
  mal_id: number;
  title: string;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}