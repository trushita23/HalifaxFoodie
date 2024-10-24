import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Database from "../../Database";
import RestaurantNavBar from '../navbars/RestaurantNavBar';
import './ChatList.css';

export function ChatList(props) {

    const email = localStorage.getItem("email");
    const [chats, setChats] = useState([]);

    const navigate = useNavigate()

    const db = Database


    // reference: https://firebase.google.com/docs/firestore/query-data/get-data#web-version-9
    useEffect(() => {
        const q = query(collection(db, "chat_sessions"), where("restaurantEmail", "==", email));

        async function loadMessages() {
            onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    const data = change.doc.data();
                    data.id = change.doc.id;

                    if (data.isActive) {
                        setChats(chats => [...chats, data]);
                    }
                });
            });
        }

        loadMessages();

    }, [db, email]);


    const openChat = (chat) => {
        console.log(chat);
        navigate(`/chat?sessionId=${chat.id}`);
    }

    return (
        <div>
            <RestaurantNavBar activeTab="chats" />
            <h1>Active chat sessions</h1>
            <div className="list-group">
                {chats.map((chat) => {
                    return (
                        <div key={chat.id} className="card chat-item">
                            <div className="item-content">
                                <p>Query: {chat.query}</p>
                                <div className="item">
                                    <p>Customer: {chat.customerName}</p>
                                    <button onClick={() => openChat(chat)} className="btn btn-primary">Open Chat</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ChatList