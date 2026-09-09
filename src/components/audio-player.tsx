import { useEffect, useRef, useState } from 'react';
import { Segmented } from '@/components/ui';

export interface Cue {
  stopId: string;
  paragraph: number;
  start: number;
  end: number;
}

export function AudioPlayer({
  src,
  cues,
  stopId,
  narrator,
  recordedOn,
  onCue,
}: {
  src: string;
  cues: Cue[];
  stopId: string;
  narrator: string;
  recordedOn: string;
  onCue: (paragraph: number | null) => void;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState<'0.8' | '1' | '1.25' | '1.5'>('1');
  const stopCues = cues.filter((c) => c.stopId === stopId);
  const first = stopCues[0]?.start ?? 0;
  const last = stopCues[stopCues.length - 1]?.end ?? duration;

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    a.playbackRate = Number(rate);
  }, [rate]);

  useEffect(() => {
    const current = stopCues.find((c) => time >= c.start && time < c.end);
    onCue(current ? current.paragraph : null);
  }, [time, stopCues, onCue]);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      if (a.currentTime < first || a.currentTime >= last) a.currentTime = first;
      void a.play();
    } else a.pause();
  };

  return (
    <section aria-label="Listen to this stop" className="doc p-4">
      <p className="font-body text-label text-ink-faint">
        <span className="stamp mr-2 text-sepia">Recorded narration</span>
        by {narrator}, {recordedOn.slice(0, 4)}: a new recording made for this site, not a historical one. The text below is complete on its own.
      </p>
      <audio
        ref={ref}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-seal !min-h-11" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          aria-label="Seek"
          min={first}
          max={last || 0}
          step={0.5}
          value={Math.min(Math.max(time, first), last || 0)}
          onChange={(e) => {
            if (ref.current) ref.current.currentTime = Number(e.target.value);
          }}
          className="min-w-0 flex-1 accent-oxide"
        />
        <span className="num font-body text-label text-ink-faint">
          {Math.floor(Math.max(0, time - first))}s / {Math.floor(Math.max(0, last - first))}s
        </span>
        <Segmented
          label="Speed"
          value={rate}
          onChange={setRate}
          options={[
            { value: '0.8', label: '0.8×' },
            { value: '1', label: '1×' },
            { value: '1.25', label: '1.25×' },
            { value: '1.5', label: '1.5×' },
          ]}
        />
      </div>
    </section>
  );
}
