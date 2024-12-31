import Article from '@/models/Article';

export async function getArticles(tags: string[], limit: number, page: number) {
    const skip = (page - 1) * limit;
    let query: any = {};
    if (tags.length > 0) {
        query = { labels: { $in: tags } };
    }
    return Article.find(query)
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .select('title imageUrl labels publishDate')
        .exec();
}

export async function getArticleById(id: string) {
    return Article.findById(id).exec();
}