import React, { useContext, useState } from 'react'
import NotesContext from '../context/notes/notesContext'

const AddNote = (props) => {
    const context = useContext(NotesContext)
    const { addNote } = context;

    const [note, setNote] = useState({title:"", description:"", tag:""});
    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag)
        props.showAlert("Added Successfully", "success")
        setNote({title:"", description:"", tag:""})
    }

    const handleChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
        // console.log(note);
    }
    return (
        <div className='container my-3'>
            <h2>Add a note</h2>
            <form className='my-3'>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={handleChange}/>
                    {note.title.length<3 && <div id="text" className="form-text">Must be atlest 3 characters</div> }
                    
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name='description' value={note.description} onChange={handleChange}/>
                    {note.description.length<5 && <div id="text" className="form-text">Must be atlest 5 characters</div> }
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name='tag' value={note.tag} onChange={handleChange}/>
                </div>
                
                <button type="submit" disabled={note.title.length<3 || note.description.length<5} className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote
