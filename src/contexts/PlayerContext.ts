import { createContext } from 'react';

//Criando uma tipagem das informações que quero salvar no contexto
type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
};


export const PlayerContext = createContext({} as PlayerContextData);