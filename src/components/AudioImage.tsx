import { useRef, useState } from "react";
import { Pause, Play, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AudioImageContent = {
  type: "audio_image";
  image_url: string;
  audio_url: string;
  image_file_name?: string;
  audio_file_name?: string;
  title?: string;
};

export function AudioImageRenderer({ content }: { content: AudioImageContent }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = async (restart = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (restart) audio.currentTime = 0;
    setError(null);
    try {
      await audio.play();
    } catch {
      setError("Audio could not play. Try again or check the sound file.");
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {content.image_url ? (
        <img src={content.image_url} alt={content.title || ""} className="h-full w-full object-contain" />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">No image selected</div>
      )}
      <audio
        ref={audioRef}
        src={content.audio_url || undefined}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError("Audio could not load. Check the sound file.")}
      />
      <div className="absolute inset-x-0 top-14 z-10 flex flex-col items-center gap-2 px-3 sm:top-16">
        <div role="group" aria-label="Audio controls" className="flex shrink-0 items-center gap-2 rounded-md border border-border bg-background/90 p-2 text-foreground">
          <Button variant="secondary" size="icon" className="h-11 w-11" disabled={!content.audio_url}
            aria-label={playing ? "Pause audio" : "Play audio"} title={playing ? "Pause audio" : "Play audio"}
            onClick={() => playing ? audioRef.current?.pause() : void play()}>
            {playing ? <Pause /> : <Play />}
          </Button>
          <Button variant="secondary" size="icon" className="h-11 w-11" disabled={!content.audio_url}
            aria-label="Stop audio" title="Stop audio" onClick={stop}><Square /></Button>
          <Button variant="secondary" size="icon" className="h-11 w-11" disabled={!content.audio_url}
            aria-label="Replay audio" title="Replay audio" onClick={() => void play(true)}><RotateCcw /></Button>
        </div>
        {error && <p role="alert" className="max-w-sm rounded-md bg-background/90 p-2 text-center text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}