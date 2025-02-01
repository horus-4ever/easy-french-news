import path from 'path';
import fs from 'fs/promises';

let conjugationCache: Record<string, any> | null = null;

/**
 * Fetches verb conjugations from a local JSON file.
 * 
 * This function loads and caches the conjugation data from `src/data/conjugations.json`.
 * If the data is already loaded in memory, it returns the cached version for improved performance.
 *
 * @returns {Promise<Record<string, any>>} A promise that resolves to an object containing verb conjugations.
 * @throws {Error} Throws an error if the conjugation file fails to load or is invalid.
 *
 * @example
 * // Fetch conjugations
 * const conjugations = await getConjugations();
 * console.log(conjugations['to run']); // Example usage
 */
export async function getConjugations(): Promise<Record<string, any>> {
  // Return cached data if already loaded.
  if (conjugationCache) {
    return conjugationCache;
  }

  try {
    // Resolve the full path to the conjugations JSON file.
    const filePath = path.join(process.cwd(), 'src/data/conjugations.json');

    // Read the file asynchronously.
    const fileContents = await fs.readFile(filePath, 'utf-8');

    // Parse the JSON data and store it in memory cache.
    conjugationCache = JSON.parse(fileContents);

    // Validate the parsed data to ensure it's not null.
    if (conjugationCache === null) {
      throw new Error('Failed to load conjugations: Data is null');
    }

    return conjugationCache;
  } catch (error) {
    throw new Error(`Failed to load conjugations: ${error}`);
  }
}
