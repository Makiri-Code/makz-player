import jancinto1 from './assets/img/jacinto-1.jpg';
import jancinto2 from './assets/img/jacinto-2.jpg';
import jancinto3 from './assets/img/jacinto-3.jpg';
import jancinto4 from './assets/img/metric-1.jpg';
import Music1 from './assets/music/jacinto-1.mp3';
import Music2 from './assets/music/jacinto-2.mp3';
import Music3 from './assets/music/jacinto-3.mp3';
import Music4 from './assets/music/metric-1.mp3';
import { FaPlay } from "react-icons/fa6";
import { FaBackward } from "react-icons/fa6";
import { FaForward } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";
import { FaVolumeLow } from "react-icons/fa6";
import { FaVolumeXmark } from "react-icons/fa6";
import './App.css';
import { useEffect, useRef, useState } from 'react';

const songs = [
  {
    name: 'jancinto-1',
    displayName: 'Electric Chill Machine',
    artist: 'Jacinto Design',
    src: Music1,
    image: jancinto1,
  }, 
  {
    name: 'jancinto-2',
    displayName: 'Seven Nation Army (Remix)',
    artist: 'Jacinto Design',
    src: Music2,
    image: jancinto2,
  }, 
  {
    name: 'jancinto-3',
    displayName: 'Front Row (Remix)',
    artist: 'Metric Jacinto Design',
    src: Music3,
    image: jancinto3,
  }, 
  {
    name: 'Metric-1',
    displayName: 'Front Row (Remix)',
    artist: 'Metric Design',
    src: Music4,
    image: jancinto4,
  },
];

function App() {
  const audioRef = useRef();
  const progressRef = useRef();
  const durationRef = useRef();
  const volumeRef = useRef();
  const currentTimeRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [songIndex, setSongIndex] = useState(0)
  const [currentSong, setCurrentSong] = useState(songs[songIndex]);
  const [showVolume, setShowVolume] = useState(false);
  const [mutedVolume, setMutedVolume] = useState(true)
  // Play
useEffect(() => {
  isPlaying ? audioRef.current.play() : audioRef.current.pause()
}, [isPlaying, songIndex])
// Update DOM
// Update progress bar
const updateProgressBar = (e) => {
  if(isPlaying) {
    const {duration, currentTime} = e.target
    // update progress bar width
    const progressPercent = (currentTime/duration) * 100;
    progressRef.current.style.width = `${progressPercent}%`;
    // calculate display for duration
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`
    }
    // Delay switching duration element to avoid NaN
    if(durationSeconds) {
      durationRef.current.textContent = `${durationMinutes}:${durationSeconds}`
    }
    // Calculate display for current time
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`
    }
    currentTimeRef.current.textContent = `${currentMinutes}:${currentSeconds}`
  }
}
// Set progress bar
const setProgressBar = (e) => {
  console.log(e);
  const width = e.target.clientWidth
  console.log('width', width);
  const clickX = e.nativeEvent.offsetX
  console.log('clickX', clickX);
  const {duration} =  audioRef.current;
  audioRef.current.currentTime = (clickX / width) * duration;

}
// Previous Song
const previousSong = () => {
  setIsPlaying(true)
  if(songIndex <= 0) {
    setSongIndex(songs.length - 1);
    setCurrentSong(songs[songIndex]);
  } else {
    setSongIndex((prev) => prev - 1);
    setCurrentSong(songs[songIndex - 1])
  }
};
// Next Song

const nextSong = () => {
  setIsPlaying(true);
  
  if(songIndex >= songs.length - 1) {
    setSongIndex(0);
    setCurrentSong(songs[0]);
  } else {
    setSongIndex((prev) => prev + 1);
    setCurrentSong(songs[songIndex + 1]) 

  }
}
// Adjust Volume
const adjustVolume = (e) => {
  console.log((volumeRef.current.value)/100)
  audioRef.current.volume = (volumeRef.current.value) / 100
}
// Mute song
const muteVolume = () => {
  audioRef.current.muted = mutedVolume
  setMutedVolume((prev) => !prev)
  console.log(mutedVolume)
}
  return (
    <div className="player-container">
      {/* Song */}
      <div className="img-container">
        <img src={currentSong.image} alt="Album Art" />
      </div>
     <h2>{currentSong.displayName}</h2>
     <h3>{currentSong.artist}</h3>
     <audio src={currentSong.src} ref={audioRef} onTimeUpdate={updateProgressBar} onEnded={nextSong}></audio>
     {/* Progress */}
     <div className="progress-container" onClick={setProgressBar}>
      <div className="progress" ref={progressRef}></div>
      <div className="duration-wrapper" >
        <span ref={currentTimeRef}>0:00</span>
        <span ref={durationRef}>2:06</span>
      </div>
     </div>
     <div className="player-controls">
      <FaBackward 
        className='fas' 
        title='Previous'
        onClick={previousSong} 
        />
      {
        isPlaying ? 
          <FaPause
            className=' fas main-button' 
            title='Pause' 
            onClick={() => setIsPlaying(false) }
          />
         : 
          <FaPlay 
            className=' fas main-button' 
            title='Play' 
            onClick={() => setIsPlaying(true) }
          />
      }
      <FaForward 
        className='fas' 
        title='Next'
        onClick={nextSong}
      />
      <div className="volume">
      {
        mutedVolume ? 
        <FaVolumeLow 
          className='fas'
          title='mute'
          onMouseEnter={() => setShowVolume(!showVolume)}
          onClick={muteVolume}
        /> :
        <FaVolumeXmark
         className='fas'
         title='volume'
         onClick={muteVolume}
        />
      }
      {showVolume && <input type="range"  orient="vertical" ref={volumeRef} onChange={adjustVolume}/>}
      </div>
     </div>
    </div>
  );
}

export default App;
