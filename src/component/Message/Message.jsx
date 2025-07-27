import React, { useState, useRef, useEffect } from "react";
import "./Message.css";

const Message = ({ user, message, classs }) => {
  const [showMenu, setShowMenu] = useState(false);
  const messageRef = useRef();
  const menuRef = useRef();

  const isMe = classs === "right";
  const content = isMe ? "You:" : `${user}:`;

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setShowMenu(false);
    alert("Message copied!");
  };

  const handleReply = () => {
    setShowMenu(false);
    alert(`Reply to: ${message}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !messageRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={`messageRow ${classs}`} ref={messageRef} onContextMenu={handleContextMenu}>
      <div className={`messageBubble ${classs}`}>
        <pre className="messageText">
          <strong>{content}</strong>
          {"\n"}
          {message}
        </pre>
      </div>

      {showMenu && (
        <div className={`dropdownMenu ${classs}`} ref={menuRef}>
          <div className="dropdownItem" onClick={handleCopy}>📋 Copy</div>
          <div className="dropdownItem" onClick={handleReply}>💬 Reply</div>
        </div>
      )}
    </div>
  );
};

export default Message;
