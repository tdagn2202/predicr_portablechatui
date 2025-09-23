"use client";

import type React from "react";

import { useState } from "react";
import Dialogue from "../components/ui/8bit/blocks/dialogue";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/ui/8bit/avatar";
import Messages from "@/components/AppComponents/Messages";
import Chatheader from "@/components/AppComponents/Chatheader";
import MessageInput from "@/components/AppComponents/MessageInput";
import ListContact from "@/components/AppComponents/ListContact";
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

const contacts: Contact[] = [
  {
    id: "1",
    name: "Alex",
    avatar: "/pixel-art-character-with-blue-hair.jpg",
    online: true,
  },
  {
    id: "2",
    name: "Sam",
    avatar: "/pixel-art-character-with-red-cap.jpg",
    online: false,
  },
  {
    id: "3",
    name: "Jordan",
    avatar: "/pixel-art-character-with-green-shirt.jpg",
    online: true,
  },
  {
    id: "4",
    name: "Casey",
    avatar: "/pixel-art-character-with-purple-hoodie.jpg",
    online: true,
  },
];

export default function Page() {
  const [activeContact, setActiveContact] = useState<string>("1");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "1",
        text: "Hey there! How are you doing?",
        sender: "contact",
        timestamp: new Date(),
      },
      {
        id: "2",
        text: "I'm doing great, thanks for asking!",
        sender: "user",
        timestamp: new Date(),
      },
    ],
    "2": [
      { id: "1", text: "What's up?", sender: "contact", timestamp: new Date() },
    ],
    "3": [
      {
        id: "1",
        text: "Ready for the game tonight?",
        sender: "contact",
        timestamp: new Date(),
      },
      { id: "2", text: "Can't wait!", sender: "user", timestamp: new Date() },
    ],
    "4": [
      {
        id: "1",
        text: "Working on anything interesting?",
        sender: "contact",
        timestamp: new Date(),
      },
    ],
  });
  const [newMessage, setNewMessage] = useState("");

  const activeContactData = contacts.find((c) => c.id === activeContact);
  const currentMessages = messages[activeContact] || [];

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), message],
    }));

    setNewMessage("");

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "That's interesting!",
        "I see what you mean.",
        "Tell me more about that.",
        "Sounds good to me!",
        "I agree with you.",
        "That's a great point!",
      ];

      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "contact",
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeContact]: [...(prev[activeContact] || []), response],
      }));
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="retro min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto h-[calc(100vh-2rem)] flex gap-4">
        <div className="w-80 bg-card border-2 border-foreground p-4">
          <h2 className="text-xl font-bold mb-4 text-center">Contacts</h2>
          <ListContact
            activeContact={activeContact}
            contacts={contacts}
            setActiveContact={setActiveContact}
          />
        </div>

        <div className="flex-1 bg-card border-2 border-foreground flex flex-col">
          <Chatheader activeContactData={activeContactData!} />
          <Messages
            currentMessages={currentMessages}
            activeContactData={activeContactData!}
          />

          <MessageInput
            handleKeyPress={handleKeyPress}
            newMessage={newMessage}
            sendMessage={sendMessage}
            setNewMessage={setNewMessage}
          />
        </div>
      </div>
    </div>
  );
}
