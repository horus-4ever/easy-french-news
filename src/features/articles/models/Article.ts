import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  IQuestion,
  IVocabulary,
  IGrammarExample,
  IGrammarPoint,
  IArticleVersion,
  IArticle,
  OldIVocabulary,
  OldIArticleVersion,
  OldIArticle,
  OldIQuestion,
} from '@/features/articles/types/article';


const OldQuestionsSchema = new Schema<OldIQuestion>(
  {
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true }
  }
)

const QuestionsSchema = new Schema<IQuestion>(
  {
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true }
  },
  { _id: false }
)

// Schema for Vocabulary
const VocabularySchema = new Schema<IVocabulary>(
  {
    words: { type: [String], required: true },
    category: { type: [String], required: true },
    translations: {
      japanese: { type: [String], required: true },
      english: { type: [String], required: false, default: [] },
      // Add more languages here if needed
    },
  },
  { _id: false }
);

const OldVocabularySchema = new Schema<OldIVocabulary>(
  {
    word: { type: String, required: true },
    translation: { type: String, required: true },
    category: { type: String, required: true }
  },
  { _id: false }
)

// GrammarExample Schema remains unchanged
const GrammarExampleSchema = new Schema<IGrammarExample>(
  {
    french: { type: String, required: true },
    japanese: { type: String, required: true },
  },
  { _id: false }
);

// GrammarPoint Schema remains unchanged
const GrammarPointSchema = new Schema<IGrammarPoint>(
  {
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    examples: { type: [GrammarExampleSchema], required: true },
  },
  { _id: false }
);

const ArticleVersionSchema = new Schema<IArticleVersion>(
  {
    content: { type: String, required: true },
    audioUrl: { type: String, required: true },
    vocabulary: { type: VocabularySchema, required: true },
    grammarPoints: { type: [GrammarPointSchema], required: true },
    questions: { type: [QuestionsSchema], required: true }
  },
  { _id: false }
);

// ArticleVersion Schema updated to use the new VocabularySchema
const OldArticleVersionSchema = new Schema<OldIArticleVersion>(
  {
    content: { type: String, required: true },
    audioUrl: { type: String, required: true },
    vocabulary: { type: [OldVocabularySchema], required: true },
    grammarPoints: { type: [GrammarPointSchema], required: true },
    questions: { type: [OldQuestionsSchema], required: true }
  },
  { _id: false }
);

// Article Schema remains largely unchanged, but references the updated ArticleVersionSchema
const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    sourceUrl: { type: String, required: false },
    imageUrl: { type: String, required: false },
    publishDate: { type: Date, required: false },
    published: { type: Boolean, required: true, default: false },
    labels: [{ type: String, required: false }],
    easyVersion: { type: ArticleVersionSchema, required: true },
    mediumVersion: { type: ArticleVersionSchema, required: true },
  },
  {
    timestamps: true,
  }
);

const OldArticleSchema = new Schema<OldIArticle>(
  {
    title: { type: String, required: true },
    sourceUrl: { type: String, required: false },
    imageUrl: { type: String, required: false },
    publishDate: { type: Date, required: false },
    published: { type: Boolean, required: true, default: false },
    labels: [{ type: String, required: false }],
    easyVersion: { type: OldArticleVersionSchema, required: true },
    mediumVersion: { type: OldArticleVersionSchema, required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent "Cannot overwrite model once compiled" error in development
const OldArticle: Model<OldIArticle> =
  mongoose.models.OldArticle || mongoose.model<OldIArticle>('OldArticle', OldArticleSchema, "articles");
const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema, "articles");

export { OldArticle, Article };
