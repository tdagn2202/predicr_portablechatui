import React from "react";
import Dialogue from "../ui/8bit/blocks/dialogue";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: Date;
}

interface messageType {
  currentMessages: Message[];
  activeContactData: Contact;
}

const Messages = ({ currentMessages, activeContactData }: messageType) => {
  return (
    <>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-amber-400">
        {currentMessages.map((message) => (
          <Dialogue
            key={message.id}
            player={message.sender === "contact"}
            className={message.sender !== "contact" ? "justify-end" : undefined}
            avatarSrc={
              message.sender === "user"
                ? "/pixel-art-player-character.jpg"
                : activeContactData?.avatar
            }
            avatarFallback={
              message.sender === "user" ? "You" : activeContactData?.name[0]
            }
            title={message.sender === "user" ? "You" : activeContactData?.name}
            description={message.text}
          />
        ))}
      </div>
    </>
  );
};

export default Messages;
