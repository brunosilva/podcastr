import { createContext, useState, ReactNode, useContext } from 'react';

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
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

//Não é legal o { children } na function abaixo ficar com tipagem any, então defini agora.
//Porém no children pode vim qualquer coisa, então faz o import "ReactNode" e define o children como abaixo
type PlayerContextProviderProp = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProp) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeListIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeListIndex(0);
        setIsPlaying(true);
    }

    //Quando quero tocar mais que 1 episódio e/ou desejo passar para o próximo, preciso ter todos os episódios.
    //Aqui passo uma lista de episódios e o indice do episódio que quero tocar.
    function playList(list: Episode[], index: number){
        setEpisodeList(list);
        setCurrentEpisodeListIndex(index);
        setIsPlaying(true);
    }

    //function somente para mudança de estado (true ou false) da const isPlaying que por default é "false"
    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }

    //Ouvindo evento de play e pause (teclado) juntamente com dois atributos na tag Audio do Player, conseguimos monitorar e controlar o audio
    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeListIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext(){
        if(isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeListIndex(nextRandomEpisodeIndex);

        } else if(hasNext){
            setCurrentEpisodeListIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious(){
        if(hasPrevious){
            setCurrentEpisodeListIndex(currentEpisodeIndex - 1);
        }
    }

    return (
        //Passando o value com todas as functions para o PlayerContext para disponibilizar em outros components e conseguir manipular!
        <PlayerContext.Provider 
        value={{ 
            episodeList, 
            currentEpisodeIndex, 
            play, 
            playList,
            playNext,
            playPrevious,
            isPlaying, 
            isLooping,
            isShuffling,
            togglePlay, 
            toggleLoop,
            toggleShuffle,
            hasNext,
            hasPrevious,
            clearPlayerState,
            setPlayingState }}
        >
            {children}
        </PlayerContext.Provider>
    )
}


//Export modelo para importar useContext e PlayerContext nas outras páginas
//usar somente como `usePlayer()`
export const usePlayer = () => {
    return useContext(PlayerContext);
}