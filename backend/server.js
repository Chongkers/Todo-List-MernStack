import express from "express";
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import TodoModel from "./model.js";
import todoroutes from "./todoroutes.js";


dotenv.config();

// This section creates the express app in the web server and prints a prompt once it is ready.
const app = express ();

app.use(express.json());

app.get("/todolists", async (req, res) => {
    const todos = await TodoModel.find();
    res.json(todos);
});

app.use("/api/todos", todoroutes);

app.listen(5100, () => {
    connectDB();
    console.log("Server started at http://localhost:5100/ ");
});

// KW15T4JQ7ZDLDNkM