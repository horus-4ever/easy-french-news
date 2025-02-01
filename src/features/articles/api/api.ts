/**
 * Fetches a paginated list of articles filtered by tags.
 *
 * This function sends a GET request to the `/api/articles` endpoint with query parameters for tags, page, and limit.
 *
 * @param {string[]} tags - An array of tags to filter the articles by. If empty, all articles are fetched.
 * @param {number} page - The page number for pagination. Starts from 1.
 * @param {number} limit - The number of articles to return per page.
 * @returns {Promise<any>} A promise that resolves to a list of articles.
 *
 * @example
 * // Fetch page 2 of articles with "santé" tags, limited to 10 per page
 * const articles = await fetchArticles(['santé'], 2, 10);
 * console.log(articles);
 */
export async function fetchArticles(tags: string[], page: number, limit: number): Promise<any> {
    try {
        // Construct URL query parameters
        const params = new URLSearchParams();
        tags.forEach((tag) => params.append('tags', tag));
        params.append('page', String(page));
        params.append('limit', String(limit));

        // Fetch articles from API
        const res = await fetch(`/api/articles?${params.toString()}`);

        // Handle potential errors
        if (!res.ok) {
            throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Failed to fetch articles');
    }
}

/**
 * Fetches a single article by its ID.
 *
 * This function sends a GET request to `/api/articles/{articleId}` to retrieve the article.
 *
 * @param {string} articleId - The unique identifier of the article.
 * @returns {Promise<any>} A promise that resolves to the article data.
 *
 * @example
 * // Fetch an article with ID "614c1b5e4f1a256e6f9d1234"
 * const article = await fetchArticleById("614c1b5e4f1a256e6f9d1234");
 * console.log(article);
 */
export async function fetchArticleById(articleId: string): Promise<any> {
    try {
        // Fetch article from API
        const res = await fetch(`/api/articles/${articleId}`);

        // Handle potential errors
        if (!res.ok) {
            throw new Error(`Failed to fetch article: ${res.status} ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching article by ID:', error);
        throw new Error('Failed to fetch article');
    }
}
