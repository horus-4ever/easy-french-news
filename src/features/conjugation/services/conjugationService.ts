import path from 'path';
import fs from 'fs/promises';

let conjugationCache: Record<string, any> | null = null;

export async function getConjugations(): Promise<Record<string, any>> {
  if (conjugationCache) {
    return conjugationCache;
  }

  const filePath = path.join(process.cwd(), 'src/data/conjugations.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  conjugationCache = JSON.parse(fileContents);
  if (conjugationCache === null) {
    throw new Error('Failed to load conjugations');
  }
  return conjugationCache;
}
