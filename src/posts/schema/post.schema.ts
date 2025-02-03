import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Post {

    @Prop({type: String})
    title: string

    @Prop({type: String})
    content: string


    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'user'})
    user: mongoose.Schema.Types.ObjectId
}

export const postSchema = SchemaFactory.createForClass(Post)