import express from "express";
import axios from "axios";
import BodyParser from "body-parser";

const app = express()
const port = 3000;

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("customer/customer_search.ejs");
})

app.get("/login",(req,res)=>{
    res.render("login_page.ejs");
})

app.get("/regis/customer",(req,res)=>{
    res.render("regis_customer.ejs");
})

app.get("/regis/landlord",(req,res)=>{
    res.render("regis_landlord.ejs");
})

app.listen(port,()=>{
    console.log("server is work!");
})