import type { Trail, TrailLang, TrailTranslation } from '@/types';

export interface ResolvedTrailText {
  lang: TrailLang;
  stale: boolean;
  title: string;
  question: string;
  intro: string;
  stops: TrailTranslation['stops'];
  reflection: string;
  activityPrompt: string;
  activityExplanation: string;
  activityOptions?: string[];
  activityItems?: string[];
}

export function resolveTrailText(trail: Trail, lang: TrailLang): ResolvedTrailText {
  const t = lang === 'en' ? undefined : trail.translations?.find((x) => x.lang === lang);
  if (!t) {
    return {
      lang: 'en',
      stale: false,
      title: trail.title,
      question: trail.question,
      intro: trail.intro,
      stops: trail.stops.map((s) => ({ title: s.title, question: s.question, text: s.text, bridge: s.bridge, uncertainty: s.uncertainty, contentNote: s.contentNote })),
      reflection: trail.reflection,
      activityPrompt: trail.activity.prompt,
      activityExplanation: trail.activity.explanation,
      activityOptions: trail.activity.kind === 'choice' ? trail.activity.options : undefined,
      activityItems: trail.activity.kind === 'order' ? trail.activity.items.map((i) => i.label) : undefined,
    };
  }
  return {
    lang: t.lang,
    stale: t.sourceVersion < trail.version,
    title: t.title,
    question: t.question,
    intro: t.intro,
    stops: t.stops,
    reflection: t.reflection,
    activityPrompt: t.activity.prompt,
    activityExplanation: t.activity.explanation,
    activityOptions: t.activity.options,
    activityItems: t.activity.items,
  };
}

/** Fonts for the two scripts, loaded only when a translated trail is read. */
export const fontImportFor: Record<Exclude<TrailLang, 'en'>, () => Promise<unknown>> = {
  ta: () => import('@fontsource/noto-sans-tamil/400.css'),
  hi: () => import('@fontsource/noto-serif-devanagari/400.css'),
};
