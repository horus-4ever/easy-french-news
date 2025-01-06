/************************************************
 * 1. Type Definitions
 ***********************************************/

import { getConjugations } from "./conjugationService";

export interface Conjugations {
    // A dictionary whose keys are tense IDs (e.g. "P", "I", "S", etc.)
    // and values are arrays of 6 forms or "NA".
    // Example: { P: ["suis","suis","suit","suivons","suivez","suivent"], ... }
    [tenseKey: string]: string[];
}

// This represents the root structure of the entire JSON:
// key = "suivre", value = { P: [...], I: [...], ..., W: ["suivre"] }
export interface BigJsonDataType {
    [verbInfinitive: string]: Conjugations;
}

/**
 * A single match for a conjugated form:
 * - verb: the dictionary form (infinitive)
 * - tense: which tense key (e.g. "I" for imperfect)
 * - personIndex: integer from 0..5, identifying which person
 */
export interface VerbMatch {
    verb: string;
    tense: string;
    personIndex: number;
}

/**
 * Trie node structure:
 * - keys 'a', 'b', 'c', ... lead to child TrieNodes.
 * - "_data" is an array of matches if a word ends exactly at this node.
 */
export interface TrieNode {
    [char: string]: TrieNode | VerbMatch[] | undefined;
    _data?: VerbMatch[];
}

/************************************************
 * 2. Building the Trie
 ***********************************************/

function makeTrieNode(): TrieNode {
    return {};
}

/**
 * Insert a single (form -> verb/tense/person) mapping into the trie
 */
function insertInTrie(
    root: TrieNode,
    form: string,
    verb: string,
    tenseKey: string,
    personIndex: number
): void {
    let current = root;
    for (const ch of form) {
        if (!current[ch]) {
            current[ch] = makeTrieNode();
        }
        // Because current[ch] is a TrieNode, we need to cast properly:
        current = current[ch] as TrieNode;
    }
    // Once we're at the final node, store the data
    if (!current._data) {
        current._data = [];
    }
    current._data.push({ verb, tense: tenseKey, personIndex });
}

/**
 * Builds the trie from the big JSON data
 */
export function buildTrieFromJson(jsonData: BigJsonDataType): TrieNode {
    const root: TrieNode = makeTrieNode();

    for (const [verbInfinitive, tenses] of Object.entries(jsonData)) {
        // tenses: e.g. { "P": ["suis","suis","suit","suivons","suivez","suivent"], ... }
        for (const [tenseKey, forms] of Object.entries(tenses)) {
            forms.forEach((form, idx) => {
                if (form !== "NA" && form !== null) {
                    insertInTrie(root, form, verbInfinitive, tenseKey, idx);
                }
            });
        }
    }

    return root;
}

/************************************************
 * 3. Lookup
 ***********************************************/

/**
 * Given the trie root and a verb form (e.g. "égalait"),
 * find all matches: returns an array of { verb, tense, personIndex }.
 * Usually it will return at most one, but there can be collisions
 * (e.g. "suis" might appear in multiple verbs).
 */
export function findInTrie(root: TrieNode, form: string): VerbMatch[] {
    let current: TrieNode | undefined = root;
    for (const ch of form) {
        if (!current[ch]) {
            return [];
        }
        current = current[ch] as TrieNode;
    }
    return current._data ?? [];
}

/************************************************
* 4. Module-level Cache
***********************************************/

// We'll store it in a module-level variable.
// This means on server side, it stays in memory across requests
// (unless your environment reloads often).
// On client side, it also persists as long as the page is loaded.
let cachedTrieRoot: TrieNode | null = null;

/**
 * Retrieve the trie root. If it doesn't exist, build it from the JSON.
 */
export async function getTrieRoot(): Promise<TrieNode> {
    if (cachedTrieRoot) {
        // Already built
        return cachedTrieRoot;
    }

    // 1) Load (or import) your big JSON data
    // For example, if you have a JSON file in your code base,
    // you can do: const bigJson = require("../path/to/bigVerbs.json");
    // or in Next.js, you might import it directly:
    // import bigJson from "../path/to/bigVerbs.json";
    //
    // Suppose we do something like:
    // const bigJson: BigJsonDataType = await fetch(...).then(res => res.json());
    // or if local, just import it if it's not too large.
    // For demonstration:
    const bigJson: any = await getConjugations();

    // 2) Build the trie
    cachedTrieRoot = buildTrieFromJson(bigJson);

    // 3) Return it
    return cachedTrieRoot;
}
