"use client";
import { IconArrowNarrowRight, IconPlayerPlay, IconPlayerPause, IconVolume, IconVolumeOff, IconMusic } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MusicSelector, AudioTrack } from "./music-selector";

interface SlideData {
  title: string;
  button: string;
  src: string;
  musicSrc?: string;
  musicTitle?: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const router = useRouter();

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 "
        onClick={() => router.push("/")}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold  relative">
            {title}
          </h2>
          <div className="flex justify-center">
            <button
              className="mt-6  px-4 py-2 w-fit mx-auto sm:text-sm text-black bg-white h-12 border border-transparent text-xs flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
            >
              {button}
            </button>
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
  audioTracks?: AudioTrack[];
}

export function Carousel({ slides, audioTracks = [] }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);
  const [audioFilter, setAudioFilter] = useState<"all" | "music" | "podcasts">("all");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (selectedTrack && audioRef.current) {
      audioRef.current.src = selectedTrack.src;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    } else {
      const currentSlide = slides[current];
      if (currentSlide.musicSrc && audioRef.current) {
        audioRef.current.src = currentSlide.musicSrc;
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  }, [current, slides, isPlaying, selectedTrack]);

  // Pick up to 4 suggestions (excluding the currently selected track)
  const suggestions = audioTracks
    .filter(
      (track) =>
        (!selectedTrack || track.id !== selectedTrack.id) &&
        track.src !== (activeAudioSource && "src" in activeAudioSource ? activeAudioSource.src : "")
    )
    .slice(0, 4);

  // Example: Pick 3 music recommendations (customize as needed)
  const recommendations = audioTracks
    .filter((track) => track.type === "music")
    .slice(0, 3);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTrackSelect = (track: AudioTrack) => {
    setSelectedTrack(track);
    setShowMusicSelector(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const id = useId();
  const currentSlide = slides[current];
  const activeAudioSource = selectedTrack || (currentSlide.musicSrc ? { 
    title: currentSlide.musicTitle || "Background Music",
    src: currentSlide.musicSrc 
  } : null);

  return (
    <div
      className="relative w-[70vmin] h-[70vmin] mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
    >
      {/* Audio element */}
      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Music Selector Overlay */}
      {showMusicSelector && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <div className="relative">
            <button
              onClick={() => setShowMusicSelector(false)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg z-10"
            >
              ×
            </button>
            <MusicSelector
              tracks={audioTracks}
              selectedTrack={selectedTrack}
              onTrackSelect={handleTrackSelect}
              activeFilter={audioFilter}
              onFilterChange={setAudioFilter}
            />
          </div>
        </div>
      )}

      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        {/* Music Selection Button */}
        {audioTracks.length > 0 && (
          <button
            className="w-10 h-10 flex items-center mx-2 justify-center bg-blue-500 hover:bg-blue-600 border-3 border-transparent rounded-full focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200"
            title="Choose music or podcast"
            onClick={() => setShowMusicSelector(true)}
          >
            <IconMusic className="text-white w-5 h-5" />
          </button>
        )}

        {/* Music Controls */}
        {activeAudioSource && (
          <div className="flex items-center mx-4 bg-neutral-200 dark:bg-neutral-800 rounded-full px-3 py-2">
            <button
              className="w-8 h-8 flex items-center justify-center hover:-translate-y-0.5 transition duration-200"
              title={isPlaying ? "Pause music" : "Play music"}
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <IconPlayerPause className="w-4 h-4 text-neutral-600 dark:text-neutral-200" />
              ) : (
                <IconPlayerPlay className="w-4 h-4 text-neutral-600 dark:text-neutral-200" />
              )}
            </button>
            
            <button
              className="w-8 h-8 flex items-center justify-center ml-1 hover:-translate-y-0.5 transition duration-200"
              title={isMuted ? "Unmute" : "Mute"}
              onClick={toggleMute}
            >
              {isMuted ? (
                <IconVolumeOff className="w-4 h-4 text-neutral-600 dark:text-neutral-200" />
              ) : (
                <IconVolume className="w-4 h-4 text-neutral-600 dark:text-neutral-200" />
              )}
            </button>

            <span className="ml-2 text-xs text-neutral-600 dark:text-neutral-200 max-w-24 truncate">
              {activeAudioSource.title}
            </span>
          </div>
        )}

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>

      {/* Music Suggestions Bar */}
      {suggestions.length > 0 && (
        <div className="w-full flex flex-col items-center mt-[8.5rem]">
          <div className="text-xs text-neutral-400 dark:text-neutral-500 mb-2">
            Music & Podcast Suggestions
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {suggestions.map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackSelect(track)}
                className="flex flex-col items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2 min-w-[90px] max-w-[120px] hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                title={track.title}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-200 dark:bg-blue-900/40 rounded-full mb-1">
                  {track.type === "music" ? (
                    <IconMusic className="text-blue-600 dark:text-blue-300 w-5 h-5" />
                  ) : (
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-300">🎙️</span>
                  )}
                </div>
                <div className="text-[11px] font-medium text-neutral-700 dark:text-neutral-200 truncate w-full">
                  {track.title}
                </div>
                {track.artist && (
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate w-full">
                    {track.artist}
                  </div>
                )}
                {track.duration && (
                  <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    {track.duration}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Music Recommendations Cards */}
      {recommendations.length > 0 && (
        <div className="w-full max-w-5xl mx-auto mt-16">
          <div className="flex items-center gap-2 mb-1">
            <IconMusic className="text-green-500 w-6 h-6" />
            <span className="text-2xl font-bold text-white">Music Recommendations</span>
          </div>
          <div className="text-neutral-400 text-sm mb-4">
            Based on your current mental state
          </div>
          <div className="flex gap-6">
            {recommendations.map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackSelect(track)}
                className="flex-1 min-w-[260px] max-w-[340px] bg-neutral-900 border border-neutral-700 rounded-xl px-6 py-5 text-left transition hover:border-green-500 hover:bg-neutral-800 focus:outline-none"
                style={{ cursor: "pointer" }}
              >
                <div className="text-lg font-bold text-white mb-1">{track.title}</div>
                <div className="text-base text-neutral-400">{track.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
