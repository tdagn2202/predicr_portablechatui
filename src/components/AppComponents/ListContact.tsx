import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/8bit/avatar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface ListType {
  contacts: Contact[];
  activeContact: string;
  setActiveContact: React.Dispatch<React.SetStateAction<string>>;
}

const ListContact = ({
  contacts,
  setActiveContact,
  activeContact,
}: ListType) => {  

  return (
    <>
      <div className="space-y-2">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => setActiveContact(contact.id)}
            className={`flex items-center gap-3 p-3 border-2 cursor-pointer transition-colors ${
              activeContact === contact.id
                ? "border-primary bg-primary/10"
                : "border-muted hover:border-foreground hover:bg-muted/50"
            }`}
          >
            <div className="relative">
              <Avatar variant="pixel" className="size-12">
                <AvatarImage
                  src={contact.avatar || "/placeholder.svg"}
                  alt={contact.name}
                />
                <AvatarFallback>{contact.name[0]}</AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-background ${
                  contact.online ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            <div>
              <div className="font-semibold">{contact.name}</div>
              <div className="text-sm text-muted-foreground">
                {contact.online ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListContact;
