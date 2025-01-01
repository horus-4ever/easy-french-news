import path from 'path';
import fs from 'fs/promises';

let conjugationCache: Record<string, any> | null = null;

export async function loadConjugations() {
  if (conjugationCache) {
    return conjugationCache;
  }

  try {
    const filePath = path.join(process.cwd(), 'src/data/conjugations.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    conjugationCache = JSON.parse(fileContents);
    return conjugationCache;
  } catch (error) {
    console.error('Failed to load conjugations:', error);
    throw new Error('Failed to load conjugations');
  }
}
