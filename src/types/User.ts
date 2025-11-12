export type User = {
  id?: number;
  legalName?: string;
  username?: string;
  email?: string;
  isVerified?: boolean;
  followers?: number;
  following?: number;
  biography?: string;
  dateJoined?: Date;
  profilePicUrl?:string;
  bannerPicUrl?:string;
}

export const setCurrentUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}