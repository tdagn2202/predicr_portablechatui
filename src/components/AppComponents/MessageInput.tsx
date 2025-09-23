import React from "react";

interface InputType {
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  newMessage: string;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
}

const MessageInput = ({
  setNewMessage,
  newMessage,
  handleKeyPress,
  sendMessage,
}: InputType) => {
  return (
    <>
      <div className="p-4 border-t-2 border-foreground bg-muted">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border-2 border-foreground bg-background text-foreground retro focus:outline-none focus:border-primary"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 border-2 border-foreground bg-primary text-primary-foreground hover:bg-primary/90 retro transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default MessageInput;
