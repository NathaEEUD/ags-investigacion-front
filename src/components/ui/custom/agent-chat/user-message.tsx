import * as React from "react";
import { motion } from "framer-motion";
import { Message } from "./types";

interface UserMessageProps {
  message: Message;
}

export const UserMessage = React.memo(({ message }: UserMessageProps) => {
  return (
    <motion.div
      initial={message.isNew ? { x: 50, opacity: 0 } : false}
      animate={message.isNew ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-3 rounded-lg bg-primary text-primary-foreground self-end max-w-[80%] relative"
    >
      {message.content}
    </motion.div>
  );
});

UserMessage.displayName = "UserMessage";
