export type Message = {
  type: string;
  content: string;
};

const hasMessage = (arr: Message[], msg: Message) =>
  arr.some(m => m.type === msg.type && m.content === msg.content);

export const addMessage = (msg: Message, setMessages: React.Dispatch<React.SetStateAction<Set<Message>>>) => {
  let isInSet = false;
  setMessages((prev: Set<Message>) => {
    isInSet = hasMessage(Array.from(prev), msg);
    if(isInSet) return prev;
    const newMsgs = new Set<Message>(prev);
    newMsgs.add(msg);
    return newMsgs;
  });

  if(isInSet) return;

  setTimeout(() => {
    setMessages((prev:Set<Message>) => {
      const newSet = new Set<Message>(prev);
      newSet.delete(msg);
      return newSet;
    });
  }, 10000); // 10 seconds
}

export const removeMessage = (msg: Message, setMessages: React.Dispatch<React.SetStateAction<Set<Message>>>) => {
  setMessages((prev:Set<Message>) => {
      const newSet = new Set<Message>(prev);
      newSet.delete(msg);
      return newSet;
    });
}