import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../../domain/models/Role';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User extends Document {
  declare _id: Types.ObjectId;
  declare createdAt: Date;
  declare updatedAt: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Object.values(Role), default: Role.USER, type: String })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
