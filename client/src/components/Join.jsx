import React, { useState, useRef } from "react";
import SendMessage from "./SendMessage";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc;

const Join = () => {
  const [myID, setMyID] = useState();
  const otherIDRef = useRef();
  const [showError, setShowError] = useState(false);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const connectHandler = () => {
    if (otherIDRef.current.value.trim() === 0) {
      setShowError(true);
      return;
    }
    setShowError(false);
    pc = new RTCPeerConnection(servers);

    // will be called when localdescription is set
    pc.onicecandidate = (e) => {
      console.log(
        "New ICE candidate! Printing SDP...\n" +
          JSON.stringify(pc.localDescription)
      );
      setMyID(JSON.stringify(pc.localDescription));
    };

    pc.ondatachannel = (e) => {
      pc.dc = e.channel;
      pc.dc.onmessage = (e) => {
        console.log("Received a message: ", e.data);
        setMessages((prev) => {
          return [...prev, e.data];
        });
        sendReturnMessage();
      };
      pc.dc.onopen = () => {
        console.log("Connection opened!!!");
        setConnected(true);
      };
    };

    pc.setRemoteDescription(JSON.parse(otherIDRef.current.value)).then(
      console.log("offer set!")
    );

    pc.createAnswer()
      .then((answer) => {
        pc.setLocalDescription(answer);
      })
      .then(() => {
        console.log("Answer created. Set local description successfully!");
      });
  };

  const sendReturnMessage = () => {
    pc.dc.send("answer");
  };

  const sendHandler = (message) => {
    console.log("send handler called");
    pc.dc.send(message);
    console.log("message sent");
  };

  return (
    <div>
      <p>Join a connection!</p>
      <div className="myID">
        <p>{myID}</p>
      </div>
      <label>
        Other ID:
        <input type="text" id="otherID" ref={otherIDRef} />
      </label>
      <button onClick={connectHandler}>Connect</button>
      {showError && <p>Please enter the Other ID first</p>}
      {connected && (
        <div>
          <SendMessage sendHandler={sendHandler} />
          <div className="messages">
            <h2>Messages from your peer: </h2>
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Join;
