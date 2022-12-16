import React, { useState } from "react";

import "./App.css";
import Home from "./components/Home";
import Join from "./components/Join";

function App() {
  const [isNew, setIsNew] = useState(null);

  const newHandler = () => {
    setIsNew(true);
  };

  const joinHandler = () => {
    setIsNew(false);
  };

  return (
    <div className="App">
      <div>
        <button onClick={newHandler}>Start a new connection</button>
        <button onClick={joinHandler}>Join a connection</button>
      </div>
      {isNew === true && <Home />}
      {isNew === false && <Join />}
    </div>
  );
}

export default App;
