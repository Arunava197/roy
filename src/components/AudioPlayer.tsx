import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, SkipForward, SkipBack } from 'lucide-react';

const PLAYLIST = [
  // -------------------------------------------------------------
  // TO ADD YOUR OWN SONG:
  // 1. Upload your .mp3 file to this application. It will be put
  //    into the "public" folder (for example: "public/my-song.mp3")
  // 2. Add a new object to this PLAYLIST array, setting the `src`
  //    to "/my-song.mp3" (make sure the filename matches exactly).
  // -------------------------------------------------------------
  // Example of local file you can add:
  // { id: 'local-1', title: 'My MP3 Upload', src: '/my-song.mp3' },
  { id: 5, title: 'Dark is the Night', src: encodeURI('./Dark is the Night.mp3') },
  { id: 6, title: 'Meditation', src: encodeURI('./Meditation.mp3') },
  { id: 7, title: 'SOA - Come join the murder', src: encodeURI('./SOA - Come join the murder.mp3') },

  { id: 1, title: 'Lo-Fi Chill', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Electronic Vibes', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Acoustic Groove', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, title: 'Ambient Waves', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = PLAYLIST[currentSongIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  }, [currentSongIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
      setShowControls(true);
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % PLAYLIST.length);
    if (!isPlaying) setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    if (!isPlaying) setIsPlaying(true);
  };

  const handleEnded = () => {
    nextSong();
  };

  return (
    <div 
      className="fixed bottom-6 left-6 z-40 flex items-center gap-3"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(isPlaying)}
    >
      <audio 
        ref={audioRef} 
        src={currentSong.src} 
        preload="none" 
        onEnded={handleEnded}
      />
      
      <button
        onClick={togglePlay}
        className="w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 dark:text-white border border-slate-300 dark:border-white/10 shadow-lg hover:scale-110 active:scale-95 transition-all z-10 relative"
        title="Toggle Background Music"
      >
        {isPlaying ? <Volume2 className="w-5 h-5 text-brand-cyan" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
      </button>
      
      <div 
        className={`transition-all duration-500 overflow-hidden flex items-center ${showControls || isPlaying ? 'max-w-md opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-10'}`}
      >
        <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-200 dark:border-white/10 shadow-sm ml-[-20px] pl-8">
          
          <button onClick={prevSong} className="text-slate-500 hover:text-brand-cyan transition-colors" title="Previous Song">
            <SkipBack className="w-4 h-4" />
          </button>
          
          <div className="text-xs font-medium whitespace-nowrap flex items-center gap-2 text-slate-800 dark:text-gray-200 min-w-[100px] justify-center">
            {isPlaying ? (
              <Music className="w-3 h-3 text-brand-purple animate-pulse" />
            ) : (
              <Music className="w-3 h-3 text-slate-400" />
            )}
            <span className="truncate max-w-[90px]">{currentSong.title}</span>
          </div>

          <button onClick={nextSong} className="text-slate-500 hover:text-brand-cyan transition-colors" title="Next Song">
            <SkipForward className="w-4 h-4" />
          </button>
          
        </div>
      </div>
    </div>
  );
}
