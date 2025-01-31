import { Article } from '@/features/articles/models/Article';
import { BadRequestError } from '@/lib/errors/errorTypes';
import mongoose from 'mongoose';

export async function getArticles(tags: string[], limit: number, page: number, published: boolean) {
    const skip = (page - 1) * limit;
    let query: any = { published: published };
    if (tags.length > 0) {
        query.labels = { $in: tags };
    }
    return Article.find(query)
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(Math.min(limit, 50)) // limit to maximum 50 to avoid massive data transfer
        .select('title imageUrl labels publishDate')
        .exec();
}

export async function getUnpublishedArticles() {
    return Article.find({ published: false })
        .sort({ publishDate: -1 })
        .exec();
}

export async function getArticleById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) { // ensure the ID is valid
        throw new BadRequestError('Invalid article ID');
    }
    const article = await Article.findById(id).exec();
    if(!article) {
        throw new BadRequestError('Article not found');
    }
    return article;
}