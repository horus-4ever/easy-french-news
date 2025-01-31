interface OldIQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: int;
}

interface OldIVocabulary {
  word: string;
  translation: string;
  category: 'noun' | 'verb1' | 'verb2' | 'verb3' | 'adjective' | 'adverb' | 'expression';
}

interface IVocabulary {
  words: string[];
  category: string[];
  translations: any;
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
  vocabulary: IVocabulary;
  grammarPoints: IGrammarPoint[];
  questions: IQuestion[];
}

interface OldIArticleVersion {
  content: string;
  audioUrl: string;
  vocabulary: OldIVocabulary[];
  grammarPoints: IGrammarPoint[];
  questions: OldIQuestion[];
}

export interface IArticle extends Document {
  _id: string;
  title: string;
  sourceUrl: string;
  imageUrl: string;
  publishDate: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
  easyVersion: IArticleVersion;
  mediumVersion: IArticleVersion;
}

export interface OldIArticle extends Document {
  title: string;
  sourceUrl: string;
  imageUrl: string;
  publishDate: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
  easyVersion: OldIArticleVersion;
  mediumVersion: OldIArticleVersion;
}