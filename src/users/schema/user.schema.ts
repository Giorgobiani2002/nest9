import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class User {

    @Prop({type: String})
    fullName: string

    @Prop({type: String})
    email: string

    @Prop({type: String})
    password: string

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'post', default: [] })
    posts: mongoose.Schema.Types.ObjectId[]
}

export const userSchema = SchemaFactory.createForClass(User)