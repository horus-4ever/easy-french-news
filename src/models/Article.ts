import mongoose, { Schema, Document, Model } from 'mongoose';

interface IVocabulary {
  word: string;
  reading: string;
  translation: string;
  context?: string; // optional
}

interface IGrammarExample {
  french: string;
  japanese: string;
}

interface IGrammarPoint {
  title: string;
  explanation: string;
  examples: IGrammarExample[];
}

interface IArticleVersion {
  content: string;
  audioUrl: string;
  vocabulary: IVocabulary[];
  grammarPoints: IGrammarPoint[];
}

export interface IArticle extends Document {
  title: string;
  sourceUrl: string;
  imageUrl: string;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
  easyVersion: IArticleVersion;
  mediumVersion: IArticleVersion;
}

// For schema validation
const VocabularySchema = new Schema<IVocabulary>(
  {
    word: { type: String, required: true },
    reading: { type: String, required: false },
    translation: { type: String, required: true },
    context: { type: String, required: false }
  },
  { _id: false }
);

const GrammarExampleSchema = new Schema<IGrammarExample>(
  {
    french: { type: String, required: true },
    japanese: { type: String, required: true }
  },
  { _id: false }
);

const GrammarPointSchema = new Schema<IGrammarPoint>(
  {
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    examples: { type: [GrammarExampleSchema], required: true }
  },
  { _id: false }
);

const ArticleVersionSchema = new Schema<IArticleVersion>(
  {
    content: { type: String, required: true },
    audioUrl: { type: String, required: true },
    vocabulary: { type: [VocabularySchema], required: true },
    grammarPoints: { type: [GrammarPointSchema], required: true }
  },
  { _id: false }
);

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    sourceUrl: { type: String, required: false },
    imageUrl: { type: String, required: false },
    publishDate: { type: Date, required: false },
    labels: [{ type: String, required: false }],
    easyVersion: { type: ArticleVersionSchema, required: true },
    mediumVersion: { type: ArticleVersionSchema, required: true }
  },
  {
    timestamps: true
  }
);

// This check prevents "Cannot overwrite model once compiled" error in dev
const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
