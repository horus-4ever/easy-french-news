/**
 * Checks if a verb exists in the database via an API request.
 *
 * This function sends a request to the `/api/verb-check/{verb}` endpoint and checks if the verb exists.
 *
 * @param {string} verb - The verb to check.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the verb exists, otherwise `false`.
 *
 * @example
 * const exists = await checkIfVerbExists("run");
 * console.log(exists); // true or false
 */
export async function checkIfVerbExists(verb: string): Promise<boolean> {
    try {
        const res = await fetch(`/api/verb-check/${verb}`);
        const data = await res.json();
        
        // If the response contains `exists: true`, return true, otherwise false.
        return data.exists === true;
    } catch (error) {
        console.error('Error checking verb existence:', error);
        return false;
    }
}

/**
 * Fetches the conjugation of a given verb by sending a request to the API.
 *
 * This function sends a POST request to `/api/conjugate` with the verb in the request body.
 *
 * @param {string} verb - The verb to conjugate.
 * @returns {Promise<any>} A promise that resolves to the conjugated forms of the verb.
 *
 * @example
 * const conjugation = await fetchConjugation("run");
 * console.log(conjugation); // { present: "runs", past: "ran", participle: "run" }
 */
export async function fetchConjugation(verb: string): Promise<any> {
    try {
        const response = await fetch(`/api/conjugate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ verb }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching conjugation:', error);
        throw new Error('Failed to fetch conjugation');
    }
}

/**
 * Retrieves the dictionary (base) form of a conjugated verb.
 *
 * This function sends a POST request to `/api/conjugate/reversed` with the conjugated verb in the request body.
 *
 * @param {string} conjugatedVerb - The conjugated verb form.
 * @returns {Promise<any>} A promise that resolves to the base form of the verb.
 *
 * @example
 * const baseForm = await fetchDictionaryForm("ran");
 * console.log(baseForm); // { dictionaryForm: "run" }
 */
export async function fetchDictionaryForm(conjugatedVerb: string): Promise<any> {
    try {
        const response = await fetch(`/api/conjugate/reversed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ verb: conjugatedVerb }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching dictionary form:', error);
        throw new Error('Failed to fetch dictionary form');
    }
}
