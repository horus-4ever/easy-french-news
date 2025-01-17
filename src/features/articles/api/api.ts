export async function fetchArticles(tags: string[], page: number, limit: number) {
    const params = new URLSearchParams();
    tags.forEach((tag) => params.append('tags', tag));
    params.append('page', String(page));
    params.append('limit', String(limit));
    
    const res = await fetch(`/api/articles?${params.toString()}`);
    return res.json();
}

export async function fetchArticleById(articleId: string) {
    const res = await fetch(`/api/articles/${articleId}`);
    return res.json();
}