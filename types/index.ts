import { Session } from "@auth0/nextjs-auth0";
import { Db, Document, MongoClient, ObjectId, WithId } from "mongodb";

export interface IPostCreateDocument extends IPostContent {
  created: Date;
  userId: ObjectId;
}

export interface IPostDocument extends IPostCreateDocument {
  _id: ObjectId;
}

export interface IGetAppProps {
  userSession?: Session | null | undefined;
  client?: MongoClient;
  db?: Db;
  user?: WithId<Document> | null;
  availableTokens: number;
  posts: IFormattedPost[];
  postId?: string | null;
}
