import { useState } from "react"
import NotesContext from "./notesContext";
const NoteState = (props) => {
    const host = "http://localhost:5000"
    // const host = "window.location.origin"
    
    const notesInitial = []
    const[notes, setNotes] = useState(notesInitial)
    //get all notes 
    const getNote = async () => {
        //API call 
        const url = `${host}/api/notes/fetchallnotes`;
        const response = await fetch(url, {
            method: "GET",

            headers:{
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token'),
            }
          });
        
          const json = await response.json()
          console.log(json)
          setNotes(json);
    }

    //Add a note
    const addNote = async (title, description, tag) => {
        //API call 
        const url = `${host}/api/notes/addnote`;
        const response = await fetch(url, {
            method: "POST",

            headers:{
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token'),
            },

            body: JSON.stringify({title, description, tag}),
          });
        //client side logic to add a note
        const note = await response.json();
        setNotes(notes.concat(note));
    }
    //delete a note 
    const deleteNote = async (id) => {
        //API call
        const url = `${host}/api/notes/deletenote/${id}`;
        const response = await fetch(url, {
            method: "DELETE",

            headers:{
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token'),
            }
          });
          
          const json =  response.json()
          console.log(json)

        //client side logic to delete a note
        // console.log("deleting the node", id);
        const newNotes = notes.filter((e)=> {return e._id!==id})
        setNotes(newNotes);
    }
    //edit a note
    const editNote = async (id, title, description, tag) => {
        //API call
        const url = `${host}/api/notes/updatenote/${id}`;
        const response = await fetch(url, {
            method: "PUT",

            headers:{
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token'),
            },

            body: JSON.stringify({title, description, tag}),
          });
          
          const json =  await response.json()
        //   getNote();
        //LOgic to edit in client
          let newNote = JSON.parse(JSON.stringify(notes))
        for (let i = 0; i < newNote.length; i++) {
            const element = newNote[i];
            if (element._id === id){
                newNote[i].title = title
                newNote[i].description = description
                newNote[i].tag = tag 
                break;           
            }
        }
        setNotes(newNote)
    }

    return (
        <NotesContext.Provider value={{ notes, getNote, addNote, deleteNote, editNote }}>
            {props.children}
        </NotesContext.Provider>

    )
}

export default NoteState;