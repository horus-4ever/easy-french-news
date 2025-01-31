import { Article, OldArticle } from '@/features/articles/models/Article'; // Adjust the import path as necessary
import dbConnect from '@/lib/dbConnect';
import { IQuestion, IVocabulary, OldIQuestion, OldIVocabulary } from '@/features/articles/types/article';
import mongoose from 'mongoose';


const transformVocabulary = (vocabulary: any) => {
    const oldVocabulary: OldIVocabulary[] = vocabulary;
    const newVocabulary: IVocabulary = {
        words: [],
        category: [],
        translations: {
            japanese: []
        },
    };

    oldVocabulary.forEach((item) => {
        newVocabulary.words.push(item.word);
        newVocabulary.category.push(item.category);
        newVocabulary.translations.japanese.push(item.translation);
    });

    return newVocabulary;
}

const transformQuestions = (questions: any) => {
    const oldQuestions: OldIQuestion[] = questions;
    const newQuestions: IQuestion[] = [];
    oldQuestions.forEach((question) => {
        const index = question.options.indexOf(question.correctAnswer);
        const newQuestion: IQuestion = {
            options: question.options,
            correctAnswer: index,
            questionText: question.questionText
        }
        newQuestions.push(newQuestion);
    });

    return newQuestions;
}

async function migrateVocabulary() {
    try {
        await dbConnect();
        console.log('Connected to MongoDB');

        // Fetch all articles
        const articles = await OldArticle.find({}).exec();
        console.log(`Found ${articles.length} articles`);

        for (const article of articles) {
            let updated = false;

            const newArticle = {
                title: article.title,
                sourceUrl: article.sourceUrl,
                imageUrl: article.imageUrl,
                publishDate: article.publishDate,
                published: article.published,
                labels: article.labels,
                easyVersion : {
                    vocabulary : transformVocabulary(article.easyVersion.vocabulary),
                    grammarPoints: article.easyVersion.grammarPoints,
                    questions: transformQuestions(article.easyVersion.questions),
                    audioUrl: article.easyVersion.audioUrl,
                    content: article.easyVersion.content
                },
                mediumVersion : {
                    vocabulary : transformVocabulary(article.mediumVersion.vocabulary),
                    grammarPoints: article.mediumVersion.grammarPoints,
                    questions: transformQuestions(article.mediumVersion.questions),
                    audioUrl: article.mediumVersion.audioUrl,
                    content: article.mediumVersion.content
                },
            };

            console.log(newArticle.easyVersion)
            await Article.updateOne({ _id: article._id }, newArticle);
            console.log(`Updated article with ID: ${article._id}`);
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

export { transformVocabulary, transformQuestions, migrateVocabulary};

// Execute the migration
// migrateVocabulary();
