import { User } from "./User";

export type Post = {
  id?:number;
  likes?:number;
  views?:number;
  reposts?:number;
  replies?: number;
  repost?: Post;
  text?: string;
  mediaPath?: string;
  ownerId?: number;
  owner?: User;
  datePosted?: Date;
  rootId: number;
  parentId: number;
  grandparent?: Post;
  parent?: Post;
  isLiked?: boolean;
  hasReposted?: boolean;
}
