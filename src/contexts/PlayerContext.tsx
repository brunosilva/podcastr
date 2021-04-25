import { createContext, useState, ReactNode } from 'react';

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
    playList: (list: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
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

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeListIndex(0);
        setIsPlaying(true);
    }

    //Quando quero tocar mais que 1 episódio e/ou desejo passar para o próximo, preciso ter todos os episódios.
    //Aqui passo uma lista de episódios e o indice do episódio que quero tocar.
    function playList(list: Episode[], index: number){
        setEpisodeList([list]);
        setCurrentEpisodeListIndex(index);
        setIsPlaying(true);
    }

    //function somente para mudança de estado (true ou false) da const isPlaying que por default é "false"
    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    //Ouvindo evento de play e pause (teclado) juntamente com dois atributos na tag Audio do Player, conseguimos monitorar e controlar o audio
    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    return (
        //Passando o value com todas as functions para o PlayerContext para disponibilizar em outros components e conseguir manipular!
        <PlayerContext.Provider 
        value={{ 
            episodeList, 
            currentEpisodeIndex, 
            play, 
            playList,
            isPlaying, 
            togglePlay, 
            setPlayingState }}
        >
            {children}
        </PlayerContext.Provider>
    )
}