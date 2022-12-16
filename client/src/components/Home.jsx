import React, { useState, useEffect, useRef } from "react";
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
let dc;

let startTime, endTime;

const Home = () => {
  const [myID, setMyID] = useState();
  const [showError, setShowError] = useState(false);
  const [connected, setConnected] = useState(false);
  const otherIDRef = useRef();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    pc = new RTCPeerConnection(servers);
    dc = pc.createDataChannel("channel");

    dc.onmessage = (e) => {
      console.log("Received a message: ", e.data);
      setMessages((prev) => {
        return [...prev, e.data];
      });
      endTime = performance.now();
      console.log("time: ", endTime - startTime);
    };

    dc.onopen = (e) => {
      setConnected(true);
      console.log("Connection opened!");
    };

    // will be called when localdescription is set
    pc.onicecandidate = (e) => {
      console.log(
        "New ICE candidate! Printing SDP...\n" +
          JSON.stringify(pc.localDescription)
      );
      setMyID(JSON.stringify(pc.localDescription));
    };

    pc.createOffer()
      .then((offer) => {
        pc.setLocalDescription(offer);
      })
      .then(() => {
        console.log("Set local description successfully!");
      });
  }, []);

  const connectHandler = () => {
    if (otherIDRef.current.value.trim().length === 0) {
      setShowError(true);
      return;
    }
    setShowError(false);
    pc.setRemoteDescription(JSON.parse(otherIDRef.current.value)).then(
      console.log("Answer received")
    );
  };

  const sendHandler = (message) => {
    console.log("send handler called");
    dc.send(message);
    startTime = performance.now();
    console.log("message sent");
  };

  return (
    <div>
      <p>Start a new connection!</p>
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

export default Home;
