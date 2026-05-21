export const stopPropagation =
  (handler: (e: React.MouseEvent) => void) =>
  (e: React.MouseEvent) => {
    e.stopPropagation();
    handler(e);
  };