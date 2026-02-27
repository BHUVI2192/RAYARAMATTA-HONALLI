import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'motion/react';

export const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Soft background music
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#8B0000] mb-4">Panchamruta Abhisheka</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
        </div>

        {/* Background Music Player (Hidden) */}
        <audio
          ref={audioRef}
          loop
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        />

        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group bg-gray-100">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            poster="https://picsum.photos/seed/video-poster/1280/720"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-20 h-20 bg-yellow-500 text-[#8B0000] rounded-full flex items-center justify-center shadow-lg"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </motion.button>
          </div>

          <div className="absolute bottom-6 right-6 flex gap-3">
            {/* Background Music Toggle */}
            <button 
              onClick={toggleMusic}
              className={`p-3 backdrop-blur-md rounded-full transition-all flex items-center gap-2 ${
                isMusicPlaying ? 'bg-yellow-500 text-[#8B0000]' : 'bg-white/20 text-white hover:bg-white/40'
              }`}
              title="Toggle Background Music"
            >
              <Music size={20} />
              {isMusicPlaying && <span className="text-[10px] font-bold uppercase pr-1">Music On</span>}
            </button>

            {/* Video Audio Toggle */}
            <button 
              onClick={toggleMute}
              className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all"
              title="Toggle Video Sound"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-gray-600 italic max-w-2xl mx-auto">
          Experience the divine Panchamruta Abhisheka of Sri Raghavendra Swamy. 
          The sacred ritual performed with milk, curd, ghee, honey, and sugar.
          <br />
          <span className="text-xs opacity-60 mt-2 block">(Click the music icon to enable soft background chanting)</span>
        </p>
      </div>
    </section>
  );
};
