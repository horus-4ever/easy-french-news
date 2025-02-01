import { Article } from '@/features/articles/models/Article';
import { BadRequestError } from '@/lib/errors/errorTypes';
import mongoose from 'mongoose';

/**
 * Fetches published articles filtered by tags, with pagination.
 *
 * @param {string[]} tags - An array of tag strings to filter the articles by. If empty, no tag filtering is applied.
 * @param {number} limit - The maximum number of articles to return per page.
 * @param {number} page - The page number for pagination. The first page is 1.
 * @param {boolean} published - A flag indicating whether to fetch published articles (true) or not (false).
 * @returns {Promise<Array<{ title: string; imageUrl?: string; labels?: string[]; publishDate: Date }>>} A promise that resolves to an array of articles.
 *
 * @example
 * // Fetch published articles with tag "santé" on page 2, 10 per page.
 * getArticles(['santé'], 10, 2, true);
 */
export async function getArticles(tags: string[], limit: number, page: number, published: boolean) {
  const skip = (page - 1) * limit;
  let query: any = { published: published };
  
  // If any tags are provided, filter the articles whose labels match any of the tags.
  if (tags.length > 0) {
    query.labels = { $in: tags };
  }
  
  // Execute the query with sorting, pagination, and field selection.
  return Article.find(query)
    .sort({ publishDate: -1 })
    .skip(skip)
    .limit(Math.min(limit, 50)) // Limit the maximum number of articles returned to 50.
    .select('title imageUrl labels publishDate')
    .exec();
}

/**
 * Fetches all unpublished articles.
 *
 * @returns {Promise<Array<any>>} A promise that resolves to an array of unpublished articles.
 *
 * @example
 * // Fetch all unpublished articles.
 * getUnpublishedArticles();
 */
export async function getUnpublishedArticles() {
  return Article.find({ published: false })
    .sort({ publishDate: -1 })
    .exec();
}

/**
 * Retrieves a single article by its ID.
 *
 * This function validates the provided ID to ensure it is a valid MongoDB ObjectId.
 * If the ID is invalid or the article is not found, a BadRequestError is thrown.
 *
 * @param {string} id - The unique identifier of the article.
 * @returns {Promise<any>} A promise that resolves to the found article.
 * @throws {BadRequestError} Throws an error if the ID is invalid or the article is not found.
 *
 * @example
 * // Fetch an article by its ID.
 * getArticleById('614c1b5e4f1a256e6f9d1234');
 */
export async function getArticleById(id: string) {
  // Validate that the provided ID is a valid MongoDB ObjectId.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('Invalid article ID');
  }

  const article = await Article.findById(id).exec();

  // If no article is found, throw an error.
  if (!article) {
    throw new BadRequestError('Article not found');
  }
  
  return article;
}

/**
 * Fetches articles based on an array of IDs.
 *
 * This function retrieves all articles whose IDs are in the provided array.
 * The articles are sorted in descending order by publishDate and only selected fields are returned.
 *
 * @param {string[]} ids - An array of article IDs to fetch.
 * @returns {Promise<Array<{ title: string; imageUrl?: string; labels?: string[]; publishDate: Date }>>} A promise that resolves to an array of articles.
 *
 * @example
 * // Fetch articles with the given IDs.
 * getArticlesByIds(['614c1b5e4f1a256e6f9d1234', '614c1b5e4f1a256e6f9d5678']);
 */
export async function getArticlesByIds(ids: string[]) {
  const articles = await Article.find({ _id: { $in: ids } })
    .sort({ publishDate: -1 })
    .select('title imageUrl labels publishDate')
    .exec();
  return articles;
}
