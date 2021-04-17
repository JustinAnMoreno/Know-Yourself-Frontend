import { useState, useEffect } from "react";
import Header from "./components/partials/Header";
import Footer from "./components/partials/Footer"
import "./App.css";

import { auth } from "./services/firebase";

export default function App() {
  const [state, setState] = useState({
    user: null,
    entries: [{entry:""}],
    newEntry: {
      entry: "",
    },
  });
  


  async function getAppData() {
    if (!state.user) return;
    try {
      const BASE_URL = `https://know-yourself-react-app.herokuapp.com/api/entries?uid=${state.user.uid}`;
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

    const cancelSubscription = auth.onAuthStateChanged((user) => {
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

    return function() { //cleanup function
      cancelSubscription();
    }

  }, [state.user]);

  async function handleSubmit(e) {
    if(!state.user) return;

    e.preventDefault();

    const BASE_URL = "https://know-yourself-react-app.herokuapp.com/api/entries";

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
        [e.target.name]: e.target.value, 
      },
    })); 
  }

  async function handleDelete(entryId) {
    if(!state.user) return;
    const URL = `https://know-yourself-react-app.herokuapp.com/api/entries/${entryId}`;

    const entries = await fetch(URL, {
      method: "DELETE"
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
              <div className = "journalLog">{s.entry}</div>         
              { !state.editMode && (
                 <button onClick={() => handleEdit(s._id)}>{"Edit Entry"}</button> )}
                 <button onClick={() => handleDelete(s._id)}>{"Remove Entry"}</button>
            </article>
          ))}
          {
            state.user && 
            <>
            <hr />
              <form onSubmit={handleSubmit}>
                <label>
                  <span>Entry</span>
                  <input name="entry" value={state.newEntry.entry} onChange={handleChange} />
                </label>
                <button>{state.editMode ? 'Edit Entry' : 'Add Entry'}</button>
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

