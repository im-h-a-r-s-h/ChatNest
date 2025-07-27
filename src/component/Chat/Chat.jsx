import React, { useEffect, useState } from 'react';
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../assets/send.png";

import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../assets/closeIcon.png";

let socket;
const ENDPOINT = "http://localhost:4500/";

const Chat = () => {
    const [id, setId] = useState("");
    const [messages, setMessages] = useState([]);
    const [typingMessage, setTypingMessage] = useState("");

    useEffect(() => {
        socket = socketIO(ENDPOINT, { transports: ['websocket'] });

        socket.on('connect', () => {
            setId(socket.id);
        });

        const room = localStorage.getItem('room');
        const user = localStorage.getItem('name');

        socket.emit('join-room', { room, user });

        socket.on('welcome', (data) => setMessages(prev => [...prev, data]));
        socket.on('userJoined', (data) => setMessages(prev => [...prev, data]));
        socket.on('leave', (data) => setMessages(prev => [...prev, data]));

        socket.on('showTyping', (msg) => {
            setTypingMessage(msg);
            const chatBox = document.querySelector('.chatBox');
            if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        });

        socket.on('hideTyping', () => {
            setTypingMessage("");
        });

        return () => {
            socket.disconnect();
            socket.off();
        };
    }, []);

    useEffect(() => {
        socket.on('sendMessage', (data) => {
            setMessages(prev => [...prev, data]);
        });

        return () => {
            socket.off('sendMessage');
        };
    }, []);

    let typingTimeout;
    const handleTyping = () => {
        const room = localStorage.getItem('room');
        socket.emit('typing', room);

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit('stopTyping', room);
        }, 2000);
    };

    const send = () => {
        const textarea = document.getElementById('chatInput');
        const message = textarea.value.trim();
        if (message === "") return;

        const room = localStorage.getItem('room');
        socket.emit('message', { message, room });
        socket.emit('stopTyping', room);
        textarea.value = "";
    };

    return (
        <div className="chatPage">
            <div className="chatContainer">
                <div className="header">
                    <h2>ChatNest</h2>
                    <a href="/"> <img src={closeIcon} alt="Close" /></a>
                </div>

                <ReactScrollToBottom className="chatBox">
                    {messages.map((item, i) => (
                        <Message
                            key={i}
                            user={item.id === id ? '' : item.user}
                            message={item.message}
                            classs={item.id === id ? 'right' : 'left'}
                        />
                    ))}

                    {typingMessage && (
                        <div className="message left typingIndicator">
                            <span><em>{typingMessage}</em></span>
                        </div>
                    )}
                </ReactScrollToBottom>

                <div className="inputBox">
                    <textarea
                        id="chatInput"
                        rows="2"
                        placeholder="Type a message..."
                        onChange={handleTyping}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                send();
                            }
                        }}
                    ></textarea>
                    <button onClick={send} className="sendBtn">
                        <img src={sendLogo} alt="Send" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;






// import React, { useEffect, useState } from 'react';
// import socketIO from "socket.io-client";
// import "./Chat.css";
// import sendLogo from "../../assets/send.png";

// import Message from "../Message/Message";
// import ReactScrollToBottom from "react-scroll-to-bottom";
// import closeIcon from "../../assets/closeIcon.png";

// let socket;
// const ENDPOINT = "http://localhost:4500/";

// const Chat = () => {
//     const [id, setId] = useState("");
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         socket = socketIO(ENDPOINT, { transports: ['websocket'] });

//         socket.on('connect', () => {
//             console.log(`Connected with socket ID: ${socket.id}`);
//             setId(socket.id);
//         });

//         const room = localStorage.getItem('room');
//         const user = localStorage.getItem('name');

//         socket.emit('join-room', { room, user });

//         socket.on('welcome', (data) => {
//             setMessages(prev => [...prev, data]);
//         });

//         socket.on('userJoined', (data) => {
//             setMessages(prev => [...prev, data]);
//         });

//         socket.on('leave', (data) => {
//             setMessages(prev => [...prev, data]);
//         });

//         return () => {
//             socket.disconnect();
//             socket.off();
//         };
//     }, []);

//     useEffect(() => {
//         socket.on('sendMessage', (data) => {
//             setMessages(prev => [...prev, data]);
//         });

//         return () => {
//             socket.off('sendMessage');
//         };
//     }, []);

//     const send = () => {
//         const message = document.getElementById('chatInput').value;
//         document.getElementById('chatInput').value = "";
//         if (message.trim() === "") return;

//         const room = localStorage.getItem('room');
//         socket.emit('message', { message, room });
//     };

//     return (
//         <div className="chatPage">
//             <div className="chatContainer">
//                 <div className="header">
//                     <h2>CHATJAM</h2>
//                     <a href="/"> <img src={closeIcon} alt="Close" /></a>
//                 </div>

//                 <ReactScrollToBottom className="chatBox">
//                     {messages.map((item, i) => (
//                         <Message
//                             key={i}
//                             user={item.id === id ? '' : item.user}
//                             message={item.message}
//                             classs={item.id === id ? 'right' : 'left'}
//                         />
//                     ))}
//                 </ReactScrollToBottom>

//                 <div className="inputBox">
//                     <input
//                         onKeyDown={(event) => event.key === 'Enter' && send()}
//                         type="text"
//                         id="chatInput"
//                     />
//                     <button onClick={send} className="sendBtn">
//                         <img src={sendLogo} alt="Send" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Chat;
