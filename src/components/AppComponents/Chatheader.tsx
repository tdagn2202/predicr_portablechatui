import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/8bit/avatar";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface ChatheaderType {
  activeContactData: Contact;
}

const Chatheader = ({ activeContactData }: ChatheaderType) => {
  return (
    <>
      <div className="p-4 border-b-2 border-foreground bg-muted">
        <div className="flex items-center gap-3">
          <Avatar variant="pixel" className="size-10">
            <AvatarImage
              src={activeContactData?.avatar || "/placeholder.svg"}
              alt={activeContactData?.name}
            />
            <AvatarFallback>{activeContactData?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold">{activeContactData?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {activeContactData?.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatheader;
