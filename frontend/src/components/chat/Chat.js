// @ts-nocheck
import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import Database from "../../Database";
import CustomerNavBar from "../navbars/CustomerNavBar";
import RestaurantNavBar from '../navbars/RestaurantNavBar';
import './Chat.css';

export function Chat(props) {

    const userType = localStorage.getItem("userType");
    const email = localStorage.getItem("email");

    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('sessionId');

    const [activeTab] = useState("chat");
    const [messageInputEnabled, setMessageInputEnabled] = useState(false)
    const [data, setData] = useState({});
    const [docId, setDocId] = useState("");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = React.useState('');

    const db = Database

    const msgCollection = collection(db, "chat_sessions", sessionId, "messages");
    const sessionsCollection = doc(db, "chat_sessions", sessionId);

    // reference: https://firebase.google.com/docs/firestore/query-data/get-data#web-version-9
    useEffect(() => {
        async function loadSession() {
            const sessionDoc = await getDoc(sessionsCollection);
            if (sessionDoc.exists()) {
                const d = sessionDoc.data();
                setDocId(sessionDoc.id);
                if (d.isActive) {
                    setData(sessionDoc.data());
                    setMessageInputEnabled(true)
                }
            } else {
                console.log("Invalid chat session");
            }
        }

        async function loadMessages() {
            onSnapshot(msgCollection, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        setMessages(messages => [...messages, change.doc.data()]);
                    }
                });
            });
        }

        loadSession().then(() => {
            loadMessages();
        });

    }, [sessionId, db]);


    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const sendMessage = (event) => {
        event.preventDefault();
        console.log('here')
        const data = {
            message: message,
            timestamp: new Date().getTime(),
            email: email
        }

        async function add() {
            await addDoc(msgCollection, data)
        }
        add()
        setMessage('')
    }

    const endSession = (event) => {
        event.preventDefault();

        async function end() {
            await updateDoc(sessionsCollection, {
                isActive: false
            })
        }

        end()
        sendEndSessionMessage()

        setMessage('')
        setMessageInputEnabled(false)
    }

    const sendEndSessionMessage = async () => {
        console.log('here')

        await fetch('https://us-central1-serverless-fall.cloudfunctions.net/endChatSession?'
            + new URLSearchParams(
                {
                    chatSessionId: docId,
                    customerEmail: email
                },
            ), {
            method: 'POST',
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
    }

    return (
        <div>
            {userType === 'Customer' ? <CustomerNavBar activeTab={activeTab} /> : <RestaurantNavBar activeTab={activeTab} />}
            <h1>Chat</h1>
            <p>Chatting with: {data.restaurantName}, {data.restaurantEmail} </p>
            <p>Query: {data.query}</p>

            <div className="messageWindow">
                <div className="message-container">
                    {messages.map((message, index) => (
                        <div key={index} className={message.email === email ? "message-customer message" : "message-rest message"}>
                            <div className="message-content">{message.message}</div>
                            <div className="message-timestamp-email">{message.email}</div>
                            <div className="message-timestamp-email">{new Date(message.timestamp).toLocaleString()}</div>
                        </div>)
                    )}
                </div>
                <div className="message-input">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Enter a message"
                        value={message}
                        onChange={handleChange}
                        disabled={!messageInputEnabled}
                    />
                    <button className="btn btn-primary" onClick={sendMessage} disabled={message.length < 1}>Send</button>
                    <button className="btn btn-primary" onClick={endSession}>End Session</button>
                </div>

            </div>

        </div>
    )
}

export default Chat