import '../styles/global.scss'

import Header from '../components/Header'
import Player from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';

import styles from '../styles/app.module.scss';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeListIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode){
    setEpisodeList([episode]);
    setCurrentEpisodeListIndex(0);
    setIsPlaying(true);
  }

  //function somente para mudança de estado (true ou false) da const isPlaying que por default é "false"
  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  //Ouvindo evento de play e pause (teclado) juntamente com dois atributos na tag Audio do Player, conseguimos monitorar e controlar o audio
  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  return (
    //Passando o value com todas as functions para o PlayerContext para disponibilizar em outros components e conseguir manipular!
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
