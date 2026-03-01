import { User } from "./User";

export type Post = {
  id?:number;
  likes?:number;
  reposts?:number;
  repost?: Post;
  text?: string;
  mediaPath?: string;
  ownerId?: number;
  owner?: User;
  datePosted?: Date;
}