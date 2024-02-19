import express from "express";
import axios from "axios";
import BodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import path from "path";
import 'dotenv/config';

const app = express()
const port = 3000;
const saltpower= 10;

app.use(BodyParser.urlencoded({extended:false}));

//connecting database user 
const db = new pg.Client({
    port:process.env.PORT,
    user:process.env.USER,
    password:process.env.PASSWORD, //fill with your damn password
    database:process.env.DATABASE, //have to be match with same name
    host:process.env.HOST,
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

app.get("/landlord",(req,res)=>{
    res.render("landlord/landlord_main.ejs",{username : user_now});
});

app.get("/land",(req,res)=>{
    res.render("landlord/landlord_land.ejs");
});

app.get("/land/create",(req,res)=>{
    res.render("landlord/landlord_item.ejs");
});

app.post("/regis/customer/send",async (req,res)=>{
    const pass1 = req.body.password1;
    const pass2 = req.body.password2;
    
    
    if(pass1 == pass2){
        await db.query("INSERT INTO users (name,password,role) VALUES ($1,$2,$3)",[req.body.username,pass1,"customer"]);
        res.redirect("/login");
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
        if(data.password === password){
            user_now = data.name;
            if(data.role === "customer"){
                res.redirect("/home_customer");
            }else if (data.role === "landlord"){
                res.redirect("/landlord");
            }
            else if(data.role === "admin"){
                res.redirect("/admin");
            }else if(data.role === "governor"){
                res.redirect("/Dashboard");
            }
        }else{
            console.log("Incorrect password");
            res.redirect("/login");
        }
    }catch(err){
        console.log(err);
    }
});

//customer

app.get("/fav",(req,res)=>{
   res.render("customer/customer_fav.ejs"); 
});

app.post("/customer/addfav",(req,res)=>{
    res.render("customer/customer_fav.ejs");
});


//landlord
app.post("/land",(req,res)=>{
    console.log(req.body);
    res.render("landlord/landlord_land.ejs")
})


app.get("/home_customer",(req,res)=>{
    res.render("customer/customer_main.ejs",{customer_name: user_now});
})

app.get("/search",(req,res)=>{
    res.render("customer/customer_search.ejs",{customer_name: user_now});
})

app.get("/items/id",(req,res)=>{
    res.render("customer/customer_item.ejs");
})
app.get("/governor/dashboard",(req,res)=>{
    res.render("governor/governor_dashboard.ejs");
})
app.get("/governor/audit",(req,res)=>{
    res.render("governor/governor_audit_log.ejs");
})

app.listen(port,()=>{
    console.log("server is work!");
});

//admin
app.get("/admin",(req,res)=>{
    res.render("admin/admin_dash.ejs");
})

app.get("/admin_land",(req,res)=>{
    res.render("admin/admin_land.ejs");
})

app.get("/admin_user",(req,res)=>{
    res.render("admin/admin_user.ejs");
})

app.get("/admin/Blacklist",(req,res)=>{
    res.render("admin/admin_blacklist.ejs");
})

app.get("/admin/landlord/detail",(req,res)=>{
    res.render("admin/admin_detail_landlord.ejs");
})

app.get("/admin/user/detail",(req,res)=>{
    res.render("admin/admin_detail_user.ejs");
})



//governor
app.get("/Dashboard",(req,res)=>{
    res.render("governor/governor_dashboard.ejs");
})

app.get("/governor/audit", (req,res)=>{
    res.render("governor/governor_audit_log.ejs");
})

