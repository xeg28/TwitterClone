const KEY = "nav_history_v1";
const MAX_ENTRIES = 50;

const read = (): string[] => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as string[] : [];
  } catch {
    return [];
  }
};

const write = (history: string[]) => {
  sessionStorage.setItem(KEY, JSON.stringify(history));
};

export const pushVisited = (url: string) => {
  const history = read();
  const last = history[history.length - 1];
  if (last === url) return; 
  history.push(url);
  if (history.length > MAX_ENTRIES) history.splice(0, history.length - MAX_ENTRIES);
  write(history);
};

export const getHistory = (): string[] => read();

export const getPrevious = (): string | null => {
  const history = read();
  if (history.length < 2) return null;
  return history[history.length - 2];
};

export const getCurrent = (): string | null => {
  const history = read();
  if(history.length < 1) return null;
  return history[history.length - 1];
}

export const popPrevious = (): string | null => {
  const history = read();
  if (history.length < 2) return null;
  history.pop();

  const prev = history.pop() || null;
  if (prev) history.push(prev); 
  write(history);
  return prev;
};

export const goBack = () => {
  var history = read();
  const prev = getPrevious();
  history = history.slice(0, -2);
  write(history);
  return prev;
}

export const clearHistory = () => write([]);