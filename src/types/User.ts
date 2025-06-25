export type User = {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  isVerified?: boolean;
  followers?: number;
  following?: number;
  biography?: string;
  dateJoined?: Date;
}