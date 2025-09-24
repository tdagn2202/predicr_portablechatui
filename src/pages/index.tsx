"use client";

import type React from "react";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { getChatId } from "@/utils/getIds";

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

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

export default function Page() {
  const [listContacts, setListContacts] = useState<User[]>([]);
  const currentUser = "0aeg2rd7Qw2NXVH8yQU8";
  // const currentUser = "3dmdKFsB9fHBBpcLfI88";
  // const currentUser = "s0zf9QgXbajYfe2p9Tl3";
  const [activeContact, setActiveContact] = useState<string>("");
  const activeContactData = listContacts.find((c) => c.id === activeContact);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);


  console.log(listContacts, activeContactData);
  

  useEffect(() => {
    getListContacts();
  }, []); 

  const getListContacts = async () => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("userId", "!=", currentUser));
      const querySnapshot = await getDocs(q);

      const users: any[] = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
          online: true,
        });
      });

      setListContacts(users);
    } catch (error) {
      console.error("Error getting contacts:", error);
    }
  };

  // Tạo chat room nếu chưa tồn tại
  const createChatRoomIfNotExist = async (contactId: string) => {
    if (!contactId) return;

    const chatId = getChatId(currentUser, contactId);
    const chatRef = doc(db, "chat", chatId);
    
    try {
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          chatId,          
          createdAt: Timestamp.fromDate(new Date()),         
        });
        console.log("Chat room created:", chatId);
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };

  // Listen to messages khi active contact thay đổi
  useLayoutEffect(() => {
    if (!activeContactData) {
      setMessages([]);
      return;
    }

    // Tạo chat room trước khi lắng nghe messages
    createChatRoomIfNotExist(activeContactData.id);

    const roomId = getChatId(currentUser, activeContactData.id);
    const docRef = doc(db, "chat", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy("created", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          sender: data.userId === currentUser ? ("user" as const) : ("contact" as const),
          created: data.created.toDate(),
        };
      });

      setMessages(newMessages);
    }, (error) => {
      console.error("Error listening to messages:", error);
    });

    return unsubscribe;
  }, [activeContactData?.id]);

  const onSend = useCallback(
    async (text: string) => {
      if (!text.trim() || !activeContactData) return;

      const chatId = getChatId(currentUser, activeContactData.id);
      const docRef = doc(db, "chat", chatId);
      const messageRef = collection(docRef, "messages");

      try {
        await addDoc(messageRef, {
          text: text.trim(),
          created: Timestamp.fromDate(new Date()),
          userId: currentUser, 
        });

        await setDoc(docRef, {
          lastMessage: text.trim(),
          lastMessageTime: Timestamp.fromDate(new Date()),
        }, { merge: true });

      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [activeContactData?.id] 
  );

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    onSend(newMessage);
    setNewMessage("");
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
            contacts={listContacts}
            setActiveContact={setActiveContact}
          />
        </div>

        <div className="flex-1 bg-card border-2 border-foreground flex flex-col">
          <Chatheader activeContactData={activeContactData!} />
          <Messages
            currentUser={currentUser}
            currentMessages={messages}
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