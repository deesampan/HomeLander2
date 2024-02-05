import express from "express";
import axios from "axios";
import BodyParser from "body-parser";

const app = express()
const port = 3000;

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("main_page.ejs");
})

app.get("/landlord",(req,res)=>{
    res.render("landlord/landlord_main.ejs");
})

app.listen(port,()=>{
    console.log("server is work!");
})