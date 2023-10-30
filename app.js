const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const connectionString = 'mongodb+srv://suhailbhatb7:lmssuhail1234@cluster0.vqsdhmn.mongodb.net/';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

app.use(bodyParser.json());

const taskSchema = new mongoose.Schema({
  title: String,
  author: String,
  summary:String,
});



const Task = mongoose.model('Task', taskSchema);
// Test api
app.get('/',  (req, res) => {
  res.send("api_runs_ok")
});


// Create a new task
app.post('/createBook', async (req, res) => {
  try {
    const book = new Task(req.body);
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error creating the task' });
  }
});

// Get all tasks
app.get('/getAllBooks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error getting tasks' });
  }
});

// Get a specific book by ID
app.get('/getSpeific_book/:id', async (req, res) => {
  try {
    console.log(req.params)
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error getting the task' });
  }
});


// Update a specific book title ,author ,description by ID
app.put('/update_Specific_book/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the task' });
  }
});

// Delete a specific book by ID
app.delete('/delete_Specific_book/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndRemove(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the task' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
