import styles from './styles.module.scss';
import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { useWindowWidth } from '@react-hook/window-size';
   

export default function Player(){
    //Ref consegue encontrar todos os elementos HTML existentes.
    const audioRef = useRef<HTMLAudioElement>(null);

    const [progress, setProgress] = useState(0);

    const sizeWindow = useWindowWidth();


    //Busca o episodeList e o currentEpisodeIndex e set na const episode.
    //Recebe isPlaying pra saber o estado (true or false) -> (tocando ou pausado)
    //Recebe togglePlay pra saber o estado (true or false) -> pra alterar o icone do player (icone de play ou pause) e no HTML abaixo finaliza a tratativa.
    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        clearPlayerState
    } = usePlayer();

    //sempre que tiver uma mudança de estado do isPlaying via useRef (audioRef) consegue controlar o HTML do audio executando o (play e pause)
    useEffect(() => {
        if(!audioRef.current){
            return;
        }

        if(isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }
    
    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        } else {
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex];
    
    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                { episode && sizeWindow < 1081 
                    ? <strong className={styles.titleEpisodePlaying}>{episode.title}</strong>
                    : <strong>Tocando agora</strong>
                }
                
            </header>

            <div className={styles.bodyPlay}>
                { episode ? (
                    <div className={styles.currentEpisode}>
                        <Image 
                            width={592}
                            height={592}
                            src={episode.thumbnail}
                            objectFit="cover"
                        />
                        { sizeWindow > 1080 
                            ? <strong>{episode.title}</strong>
                            : '' 
                        }
                        { sizeWindow > 1080 
                            ? <span>{episode.members}</span>
                            : '' 
                        }
                        
                    </div>
                ) : (
                    <div className={styles.emptyPlayer}>
                        { sizeWindow < 1080 
                            ? <strong>Selecione um podcast</strong>
                            : <strong>Selecione um podcast para ouvir</strong>
                        }
                    </div>
                ) }

                <footer className={!episode ? styles.empty : ''}>
                    <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                        <div className={styles.slider}>
                            { episode ? (
                                <Slider 
                                    max={episode.duration}
                                    value={progress}
                                    onChange={handleSeek}
                                    trackStyle={{backgroundColor: '#04d361'}}
                                    railStyle={{backgroundColor: '#9f75ff'}}
                                    handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                                />
                            ) : (
                                <div className={styles.emptySlider} />
                            )}
                            
                        </div>
                        <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                    </div>

                    { episode && (
                        <audio 
                            src={episode.url}
                            ref={audioRef}
                            autoPlay
                            loop={isLooping}
                            onEnded={handleEpisodeEnded}
                            onPlay={() => setPlayingState(true)}
                            onPause={() => setPlayingState(false)}
                            onLoadedMetadata={setupProgressListener}
                        />
                    ) }

                    <div className={styles.buttons}>
                        <button type="button" 
                            disabled={!episode || episodeList.length === 1}
                            onClick={toggleShuffle}
                            className={isShuffling ? styles.isActive : ''}
                        >
                            <img src="/shuffle.svg" alt="Embaralhar"/>
                        </button>
                        <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                            <img src="/play-previous.svg" alt="Tocar anterior"/>
                        </button>
                        <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                            { isPlaying 
                                ? <img src="/pause.svg" alt="Pause"/>
                                : <img src="/play.svg" alt="Tocar"/>
                            }
                        </button>
                        <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                            <img src="/play-next.svg" alt="Tocar próxima"/>
                        </button>
                        <button type="button" 
                            disabled={!episode}
                            onClick={toggleLoop}
                            className={isLooping ? styles.isActive : ''}
                        >
                            <img src="/repeat.svg" alt="Repetir"/>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}