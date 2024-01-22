import express from "express";
import axios from "axios";
import BodyParser from "body-parser";

const app = express()
const port = 3000;

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.listen(port,()=>{
    console.log("server is work!");
})