import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILabel extends Document {
  name: string;
  count: number;
}

const LabelSchema = new Schema<ILabel>(
  {
    name: { type: String, required: true },
    count: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

const Label: Model<ILabel> =
  mongoose.models.Label || mongoose.model<ILabel>('Label', LabelSchema);

export default Label;
