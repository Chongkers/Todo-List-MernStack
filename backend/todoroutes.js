import express from 'express';
import TodoModel from "./model.js";

const router = express.Router();

//Get all todo items.
router.get('/', async (req, res) => {
    try {
        const todos = await TodoModel.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Post a new todo.

router.post('/', async (req, res) => {
    const todo = new TodoModel({
            text: req.body.text})
    try {
        const newtodo = await todo.save();
        res.status(201).json(newtodo)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Update a todo.

router.patch('/:id', async (req, res) => {
    const todo = new TodoModel({
            text: req.body.text})
    try {
        const todo = await TodoModel.findById(req.params.id);
        if (!todo) return res.status(404).json({message: "Todo not found."});

        if (req.body.text !== undefined) {
            todo.text = req.body.text
        }
        if (req.body.completed !== undefined) {
            todo.completed = req.body.completed
        }
        const updatedtodo = await todo.save();
        res.json(updatedtodo);

    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Delete a todo.

router.delete('/:id', async (req, res) => {
    try {
        await TodoModel.findByIdAndDelete(req.params.id)
        res.json({message: "Item deleted."})
    } catch {
        res.status(500).json({message: error.message})
    }
});

export default router;