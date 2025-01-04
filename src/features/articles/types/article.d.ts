interface IQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface IVocabulary {
  word: string;
  translation: string;
  category: 'noun' | 'verb1' | 'verb2' | 'verb3' | 'adjective' | 'adverb' | 'expression';
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
  questions: IQuestion[];
}

export interface IArticle extends Document {
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