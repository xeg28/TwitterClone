import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PostsRefreshContextType {
  refreshFlag: boolean;
  triggerRefresh: () => void;
}

const PostsRefreshContext = createContext<PostsRefreshContextType | undefined>(undefined);

export const usePostsRefresh = () => {
  const context = useContext(PostsRefreshContext);
  if (!context) {
    throw new Error('usePostsRefresh must be used within a PostsRefreshProvider');
  }
  return context;
};

export const PostsRefreshProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const triggerRefresh = () => setRefreshFlag(flag => !flag);

  return (
    <PostsRefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </PostsRefreshContext.Provider>
  );
};
