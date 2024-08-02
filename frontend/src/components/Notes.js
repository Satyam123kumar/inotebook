import React, { useContext, useEffect, useRef, useState } from 'react'
import NotesContext from '../context/notes/notesContext'
import NoteItem from './NoteItem';
import AddNote from './AddNote'
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(NotesContext)
    const { notes, getNote, editNote } = context;
    const [note, setNote] = useState({_id:"", title:"", description:"", tag:""});
    let navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("token")){
            getNote()
        }
        else{
            navigate('/login');
        }
        // eslint-disable-next-line
    }, [])

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote(currentNote);
        
    }
    const handleClick = (e) => {
        console.log("Update", note);
        editNote(note._id, note.title, note.description, note.tag);
        props.showAlert("Updated Successfully", "success")
        // e.preventDefault();
        refClose.current.click();
    }

    const handleChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
        // console.log(note);
    }

    const ref = useRef(null)
    const refClose = useRef(null);
    return (
        <>
            <AddNote showAlert={props.showAlert}/>
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className='my-3'>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={handleChange}/>

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="description" name='description' value={note.description} onChange={handleChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="tag" name='tag' value={note.tag} onChange={handleChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" disabled={note.title.length<3 || note.description.length<5} className="btn btn-primary" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row my-3'>
                <h2>Your notes</h2>
                <div className='container mx-2'>
                {notes.length===0 && "No notes to display"}
                </div>
                {notes.map((note) => {
                    return <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
                })}
            </div>
        </>
    )
}

export default Notes
