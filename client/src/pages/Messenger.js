import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Paper, Button, TextField } from '@material-ui/core';
import axios from 'axios';
import ChatUser from '../components/chatUser';
import Message from '../components/message';
//import { io } from 'socket.io-client';

function Messengers(props) {
    const [conversation, setConversation] = useState(null);
    const [conv, setConv] = useState(null);
    const [messages, setMessages] = useState(null);
    const [message, setMessage] = useState("");
    // const [arrivalMassage, setArrivalMassage] = useState(null);
    const [img, setImg] = useState(null);

    let { id } = useParams();
    let history = useHistory();
    let msgRef = useRef();
    // const socket = useRef(io('ws://localhost:5000'));

    // useEffect(() => {
    //     socket.current.on('getMessage', (data) => {
    //         setArrivalMassage({
    //             sender: data.senderId,
    //             text: data.text,
    //             createdAt: Date.now()
    //         })
    //     })
    // }, [])

    // useEffect(() => {
    //     arrivalMassage &&
    //         conv?.members.includes(arrivalMassage.sender) &&
    //         setMessages(prev => [...prev, arrivalMassage]);
    // }, [arrivalMassage, conv])

    // useEffect(() => {
    //     socket.current.emit('adduser', props.currentUser._id);
    // }, [props.currentUser])


    useEffect(() => {
        msgRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if (props.currentUser) {
            if (id) {
                const data = {
                    senderId: props.currentUser._id,
                    receiverId: id
                }
                axios.post('https://socila-media-app.herokuapp.com/api/conversation', data)
                    .then(res => {
                        ;
                        let url = res.data._id || res.data[0]._id
                        axios.get(`https://socila-media-app.herokuapp.com/api/message/${url}`)
                            .then(res => setMessages(res.data))
                            .catch(err => console.log(err))
                        setConv(res.data[0])
                    })
                    .catch(err => console.log(err))
            }
            else {
                setMessages(null)
                axios.get(`https://socila-media-app.herokuapp.com/api/conversation/${props.currentUser._id}`)
                    .then(res => {
                        setConversation(res.data)
                    })
                    .catch(err => console.log(err.response.data))
            }
        }

    }, [])

    useEffect(() => {
        if (props.currentUser) {
            if (id) {
                const data = {
                    senderId: props.currentUser._id,
                    receiverId: id
                }
                axios.post('https://socila-media-app.herokuapp.com/api/conversation', data)
                    .then(res => {
                        let url = res.data._id || res.data[0]._id;
                        axios.get(`https://socila-media-app.herokuapp.com/api/message/${url}`)
                            .then(res => setMessages(res.data))
                            .catch(err => console.log(err))
                        setConv(res.data[0])
                    })
                    .catch(err => console.log(err))
            }
            else {
                setMessages(null)
                axios.get(`https://socila-media-app.herokuapp.com/api/conversation/${props.currentUser._id}`)
                    .then(res => {
                        setConversation(res.data);
                    })
                    .catch(err => console.log(err))
            }
        }

    }, [props.currentUser, id]);

    const sendMessage = () => {
        if (message.length > 0) {
            const data = {
                conversationId: conv._id,
                text: message,
                sender: props.currentUser._id
            }

            // const receiverId = conv.members.find(mem => mem !== props.currentUser._id);
            // socket.current.emit("sendMessage", {
            //     senderId: props.currentUser._id,
            //     receiverId,
            //     text: message
            // })

            axios.post('https://socila-media-app.herokuapp.com/api/message', data)
                .then(res => {
                    const msgs = [...messages, res.data];
                    setMessages(msgs);
                })
                .catch(err => console.log(err))
        }
        setMessage("");
    }

    return (
        <div data-aos="flip-left" style={{ maxWidth: "600px", zIndex: "1", margin: "10px auto", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            <Paper elevation={3} style={{ padding: "10px 20px", margin: "10px", backgroundColor: "rgba(255,255,255,0.3)" }}>
                <div>
                    {
                        conversation === null && messages === null && < h2 style={{ textAlign: "center" }}>Loading ... </h2>
                    }
                    {
                        conversation?.length === 0 && <h2 style={{ textAlign: "center" }}>No users</h2>
                    }
                    {
                        !id && conversation && conversation.map(conv => (
                            <div
                                key={conv._id} onClick={async () => {
                                    setConv(conv);
                                    let userID = conv.members.find(user => user !== props.currentUser._id);
                                    history.push(`/message/${userID}`)
                                    const user = await axios.get(`https://socila-media-app.herokuapp.com/api/auth/user/${userID}`);
                                    setImg(user.data[0].img)
                                }}>
                                <ChatUser conv={conv} key={conv._id} currentUser={props.currentUser} />
                            </div>
                        ))
                    }

                </div>
                <div>
                    <div style={{ height: "70vh", marginBottom: "5px", overflowY: "auto", }}>

                        {
                            messages?.length === 0 && <h2 style={{ textAlign: "center" }}>No Chat</h2>
                        }
                        {
                            id && messages && messages.map(msg => (
                                <div key={msg._id} ref={msgRef} >
                                    <Message
                                        currentUser={props.currentUser ? props.currentUser : null}
                                        oppositeId={id}
                                        data={msg}
                                        img={img}
                                        myMsg={msg.sender === props.currentUser._id} />
                                </div>
                            ))
                        }
                    </div>
                    {
                        id &&
                        <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} style={{ display: "flex" }}>
                            <TextField
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                variant="outlined"
                                fullWidth
                                size="small"></TextField>
                            <Button
                                type="submit"
                                style={{ backgroundColor: "aqua" }}>send</Button>
                        </form>
                    }
                </div>

            </Paper>

        </div >
    )
}

export default Messengers
