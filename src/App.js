import { useState,useEffect } from "react";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
    </div>
  );
}

async function getAppData() {
  const BASE_URL = "http://localhost:3001/api";
  const entries = await fetch(BASE_URL).then(res => res.json());
  setState((prevState) => ({
    ...prevState, 
    entries,  
  }));  
};

useEffect(() => {
  getAppData();
}, []);

async function addEntry(e) {
  e.preventDefault();

  const BASE_URL = "http://localhost:3001/api";

  const entry = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "Applications/json"
    },
    body: JSON.stringify(state.newEntry)
  }).then(res => res.json());

  setState((prevState) => ({
    entries: [...prevState.entries, entry],
    newEntry: {
      entry: "",
    },
  }));
}

export default App;
