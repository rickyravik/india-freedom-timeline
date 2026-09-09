import type { ArchiveDocument } from '@/types';
import { queensProclamation1858 } from './queens-proclamation-1858';

export const documents: ArchiveDocument[] = [queensProclamation1858];
export const documentBySlug = new Map(documents.map((d) => [d.slug, d]));
