import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Join.css";

const Join = () => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    const sendUser = () => {
        localStorage.setItem('name', name);
        localStorage.setItem('room', room);
    }

    return (
        <div className="JoinPage">
            <h1 class="header">ChatNest</h1>
            <div className="JoinContainer">
                <input 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    placeholder="Enter Your Name" 
                    type="text" 
                    id="joinInput" 
                />
                <input 
                    onChange={(e) => setRoom(e.target.value)} 
                    value={room} 
                    placeholder="Enter Room ID" 
                    type="text" 
                    id="joinRoom" 
                />
                <Link onClick={(event) => (!name || !room) ? event.preventDefault() : sendUser()} to="/chat">
                    <button className="joinbtn">Join Room</button>
                </Link>
            </div>
        </div>
    )
}

export default Join;
