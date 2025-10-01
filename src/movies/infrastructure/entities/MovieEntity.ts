import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'movies',
  timestamps: true,
})
export class Movie extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  created: string;

  @Prop({ required: true })
  edited: string;

  @Prop({ required: true })
  starships: string[];

  @Prop({ required: true })
  vehicles: string[];

  @Prop({ required: true })
  planets: string[];

  @Prop({ required: true })
  producer: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  episode_id: number;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  release_date: string;

  @Prop({ required: true })
  opening_crawl: string;

  @Prop({ required: true })
  characters: string[];

  @Prop({ required: true })
  species: string[];

  @Prop({ required: true })
  url: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
