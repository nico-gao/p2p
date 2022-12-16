import React from "react";
import { useRef } from "react";

const SendMessage = ({ sendHandler }) => {
  const inputRef = useRef();

  const onClickHandler = () => {
    const message = inputRef.current.value;
    if (message.trim().length !== 0) {
      sendHandler(message);
    }
    inputRef.current.value = "";
  };
  return (
    <div>
      <label htmlFor="message">
        Send a message:
        <input type="text" id="message" ref={inputRef} />
      </label>
      <button onClick={onClickHandler}>Send</button>
    </div>
  );
};

export default SendMessage;
