import express from "express";
import axios from "axios";
import BodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import path from "path";

const app = express()
const port = 3000;
const saltpower= 10;

app.use(BodyParser.urlencoded({extended:false}));

//connecting database user 
const db = new pg.Client({
    port:5432,
    user:"postgres",
    password:"tonton123", //fill with your damn password
    database:"homelander", //have to be match with same name
    host:"localhost"
});
db.connect(); //for connecting database with your postgresql

//checking which user is active now
let user_now = "name_of_user";


// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static("public"));

//login backend
app.get("/",(req,res)=>{
    res.render("main_page.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login_page.ejs");
});

app.get("/regis/customer",(req,res)=>{
    res.render("regis_customer.ejs");
});

app.get("/regis/landlord",(req,res)=>{
    res.render("regis_landlord.ejs");
});

app.post("/regis/customer/send",async (req,res)=>{
    const pass1 = req.body.password1;
    const pass2 = req.body.password2;
    
    
    if(pass1 === pass2){
        bcrypt.hash(pass1,saltpower,async (err,hash)=>{
            if(err) console.log (err);
            await db.query("INSERT INTO users (name,password,role) VALUES ($1,$2,$3)",[req.body.username,hash,"customer"]);
            res.redirect("/login");
        })
    }else{
        res.redirect("/regis/customer");
    }
});

app.post("/login/send",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const result = await db.query("SELECT * FROM users WHERE name = ($1)",[username]);
        const data = result.rows[0];
        bcrypt.compare(password,data.password,(err,result)=>{
            if(err) console.log(err);
            
            if(result){
                user_now = username;
                res.render("customer/customer_main.ejs",{customer_name: username});
            }else{
                console.log("Incorrect password");
                res.redirect("/login");
            }
        })
    }catch(err){
        console.log(err);
    }
});

app.get("/search",(req,res)=>{
    res.render("customer/customer_search.ejs",{customer_name: user_now});
})

app.get("/items/id",(req,res)=>{
    res.render("customer/customer_item.ejs");
})

app.listen(port,()=>{
    console.log("server is work!");
});