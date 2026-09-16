import { useEffect, useRef, useState } from 'react';

type Lang = 'en' | 'ta' | 'hi';
const langTag: Record<Lang, string> = { en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN' };

/** Citation markers and stray markup are for the eye, not the ear. */
function speakable(paragraphs: string[]): string[] {
  return paragraphs.map((p) => p.replace(/\[\^\d+\]/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
}

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined' ? window.speechSynthesis : null;
}

function pickVoice(s: SpeechSynthesis, lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = s.getVoices();
  return voices.find((v) => v.lang.replace('_', '-') === langTag[lang]) ?? voices.find((v) => v.lang.toLowerCase().startsWith(lang)) ?? undefined;
}

/**
 * Reads a passage aloud with the device's own text-to-speech. This is the
 * no-recording fallback: it costs nothing, works offline once a voice is
 * installed, and says plainly that it is a machine voice. Pages that have a
 * real recorded narration should show that player instead of this.
 *
 * The control is rendered unconditionally and identically on every render.
 * Prerendering here is a browser snapshot taken after mount, so anything
 * that appears only after an effect runs would be in the snapshot but not
 * in a fresh client's first render, and hydration would fail (see the
 * portrait fallback for the same lesson). Speech synthesis is available in
 * every current browser; where it somehow is not, the button simply does
 * nothing.
 */
export function ReadAloud({ paragraphs, lang = 'en', className = '' }: { paragraphs: string[]; lang?: Lang; className?: string }) {
  const [state, setState] = useState<'idle' | 'speaking' | 'paused'>('idle');
  /* A run id so callbacks from a cancelled run cannot flip state afterwards. */
  const run = useRef(0);
  const key = paragraphs.join('\n');

  /* New text (a mode switch, the next stop) or leaving the page: go quiet. */
  useEffect(() => {
    return () => {
      run.current += 1;
      synth()?.cancel();
    };
  }, [key]);

  const stop = () => {
    run.current += 1;
    synth()?.cancel();
    setState('idle');
  };

  const start = () => {
    const s = synth();
    if (!s) return;
    s.cancel();
    const id = ++run.current;
    const parts = speakable(paragraphs);
    if (parts.length === 0) return;
    const voice = pickVoice(s, lang);
    /* One utterance per paragraph: some browsers stop long single
       utterances part-way through, and a queue survives that. */
    parts.forEach((text, i) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = langTag[lang];
      if (voice) u.voice = voice;
      u.rate = 0.95;
      if (i === parts.length - 1) u.onend = () => run.current === id && setState('idle');
      u.onerror = () => run.current === id && setState('idle');
      s.speak(u);
    });
    setState('speaking');
  };

  const toggle = () => {
    const s = synth();
    if (!s) return;
    if (state === 'idle') start();
    else if (state === 'speaking') {
      s.pause();
      setState('paused');
    } else {
      s.resume();
      setState('speaking');
    }
  };

  return (
    <div role="group" aria-label="Read aloud" className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button type="button" className={`chip min-h-10 ${state !== 'idle' ? 'chip-active' : ''}`} onClick={toggle}>
        {state === 'speaking' ? 'Pause' : state === 'paused' ? 'Resume' : 'Read aloud'}
      </button>
      {state !== 'idle' && (
        <button type="button" className="chip min-h-10" onClick={stop}>
          Stop
        </button>
      )}
      <span className="font-body text-label text-ink-faint">Your device’s own voice, not a recording.</span>
    </div>
  );
}
