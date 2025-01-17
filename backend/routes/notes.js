const express = require('express');
const router = express.Router();

const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const {body, validationResult} = require('express-validator')

//Route 1: - Get all notes of loggedin user using get request at /api/notes/getuser. Login is required 
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({user: req.user.id})
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

//Route 2: - add a new note of loggedin user using post request at /api/notes/addnote. Login is required 
router.post('/addnote', fetchuser, [
    body('title', 'Must be at least 3 character').isLength({ min: 3 }),
    body("description", "Must be at least 5 character").isLength({ min: 5 }),
], async (req, res) => {

    try {
        const {title, description, tag} = req.body;
        
        //if there is some error return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const saveNote = await note.save();
        res.json(saveNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

//Route 3: - update a note of loggedin user using put request at /api/notes/updatenote. Login is required 
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const {title, description, tag} = req.body;
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;