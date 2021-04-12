import { useState, useEffect } from "react";
import Header from "./components/partials/Header";
import Footer from "./components/partials/Footer"
import "./App.css";

import { auth } from "./services/firebase";

export default function App() {
  const [state, setState] = useState({
    user: null,
    entries: [],
    newEntry: {
      entry: "",
    },
  });

  async function getAppData() {
    if (!state.user) return;
    try {
      const BASE_URL = "http://localhost:3001/api";
      const entries = await fetch(BASE_URL).then((res) => res.json());
      setState((prevState) => ({
        ...prevState,
        entries,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAppData();

    auth.onAuthStateChanged((user) => {
      if (user) {
        setState((prevState) => ({
          ...prevState,
          user,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          entries: [],
          user,
        }));
      }
    });
  }, [state.user]);

  async function handleSubmit(e) {
    if(!state.user) return;

    e.preventDefault();

    const BASE_URL = "http://localhost:3001/api/skills";

    if(!state.editMode) {

      const entries = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-type": "Application/json"
        },
        body: JSON.stringify({
          ...state.newEntry,
          uid: state.user.uid,
        })
      }).then(res => res.json());

      setState((prevState) => ({
        ...prevState,
        entries,
        newEntry: {
          entry: "",
        },
      }));
    } else {
      const { entry, _id } = state.newEntry;

      const entries = await fetch(`${BASE_URL}/${_id}`, {
        method: "PUT",
        headers: {
          "Content-type": "Application/json"
        },
        body: JSON.stringify({ entry })
      }).then(res => res.json());

      setState(prevState => ({
        ...prevState,
        entries,
        newEntry: {
          entry: ""
        },
        editMode: false
      }));
    }
  }

  return (
    <>
      <Header user={state.user} />
      <Footer />
    </>
  );
}

