var connectToMongo = require('./db')
const express = require('express')
var cors = require('cors');
const path = require('path');
connectToMongo().then(() => console.log("Mongodb connected"));

const app = express()
const PORT = 5000;
app.use(cors())
app.use(express.json())

app.use(cors({
  origin: "https://todo-taupe-omega.vercel.app"
}));
//Available Routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// app.get("/", (req, res) => {
//     app.use(express.static(path.resolve(__dirname, "frontend", "build")));
//     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
// });

app.listen(PORT, () => {
    console.log("server started")
})

