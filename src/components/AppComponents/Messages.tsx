import React, { useEffect, useLayoutEffect, useState } from "react";
import Dialogue from "../ui/8bit/blocks/dialogue";
import { getChatId } from "@/utils/getIds";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

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
  created: Date;
}

interface messageType {
  currentUser:string;
  currentMessages: Message[];
  activeContactData: Contact;
}

const Messages = ({currentUser, currentMessages, activeContactData }: messageType) => {

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
