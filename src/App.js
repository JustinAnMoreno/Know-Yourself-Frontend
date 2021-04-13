import { useState, useEffect } from "react";
import Header from "./components/partials/Header";
import Footer from "./components/partials/Footer"
import "./App.css";

import { auth } from "./services/firebase";
import { getQuote } from "./services/rq-api";

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
      const BASE_URL = "http://localhost:3001/api/entries";
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

    const BASE_URL = "http://localhost:3001/api/entries";

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

  function handleChange(e) {
    setState((prevState) => ({
      ...prevState, 
      newEntry: {
        ...prevState.newEntry,
        [e.target.name]: e.target.value 
      }
    })) 
  }

  async function handleDelete(entryId) {
    if(!state.user) return;
    const URL = `http://localhost:3001/api/entries/${entryId}`;
    
    const entries = await fetch(URL, {
      method: 'DELETE'
    }).then(res => res.json());

    setState(prevState => ({
      ...prevState,
      entries,
    }));
  }

  function handleEdit(entryId) {
    const { entry, _id } = state.entries.find(entry => entry._id === entryId);
    setState(prevState => ({
      ...prevState,
      newEntry: {
        entry,
        _id,
      },
      editMode: true
    }));
  }

  function handleCancel() {
    setState(prevState => ({
      ...prevState,
      newEntry: {
        entry: "",
      },
      editMode: false
    }));
  }
  return (
    <>
      <Header user={state.user} />
      <main>
        <section>
          {state.entries.map((s) => (
            <article key={s.entry}>
              <div>{s.entry}</div>
              <div onClick={() => handleDelete(s._id)}>{"🚫"}</div>
              { !state.editMode && <div onClick={() => handleEdit(s._id)}>{"✏️"}</div> }
            </article>
          ))}
          {
            state.user && 
            <>
            <hr />
              <form onSubmit={handleSubmit}>
                <label>
                  <span>Entry</span>
                  <input name="entry" value={state.newEntry.Entry} onChange={handleChange} />
                </label>
                <button>{state.editMode ? 'EDIT ENTRY' : 'ADD ENTRY'}</button>
              </form>
              {state.editMode && <button onClick={handleCancel}>CANCEL</button> }
            </>
          }
        </section>
      </main>
      <Footer />
    </>
  );
}

