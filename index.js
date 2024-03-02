import express from "express";
import axios from "axios";
import BodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import path from "path";
import 'dotenv/config';

//for upload image
import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/WebDevelopmentProject/HomeLander2/public/images')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname);
    }
  })
const upload = multer({storage});

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
    host:"localhost",
});
db.connect(); //for connecting database with your postgresql

//checking which user is active now
let user_now = "name_of_user";
let role_now = "customer";


// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static("public"));

//login backend
app.get("/",(req,res)=>{
    user_now = "name_of_user";
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


//landlord

app.get("/landlord",(req,res)=>{
    res.render("landlord/landlord_main.ejs",{user_name : user_now});
});

app.get("/land",async (req,res)=>{
    const data = await db.query("SELECT * FROM land WHERE land_owner = ($1)",[user_now]);
    console.log(data.rows);

    res.render("landlord/landlord_land.ejs",{user_name:user_now,lands:data.rows});
});

app.get("/land/create",(req,res)=>{
    res.render("landlord/landlord_item.ejs",{user_name:user_now});
});

app.post("/land/create",upload.single('upload'),async (req,res)=>{
    console.log(req.body);
    console.log(req.body.upload);

    console.log(req.file.originalname);

    console.log(req.body.land_type); 

    const d = new Date();
    const date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    console.log(date);
    
    await db.query("INSERT INTO land (land_name,land_price,land_type,land_contanct,land_des,land_status,land_owner,land_image,date,checker) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",[req.body.land_name,req.body.land_price,req.body.land_type,req.body.land_phone,req.body.land_des,req.body.status,user_now,req.file.originalname,date,false]);
    res.redirect("/land");
})

//login , regis menu

app.post("/regis/customer/send",async (req,res)=>{
    const pass1 = req.body.password1;
    const pass2 = req.body.password2;
    
    
    if(pass1 == pass2){
        const d = new Date();
        const date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;


        await db.query("INSERT INTO customer (name,password,date) VALUES ($1,$2,$3)",[req.body.username,pass1,date]);
        res.redirect("/login");
    }else{
        res.redirect("/regis/customer");
    }
});

app.post("/regis/landlord/send",async (req,res)=>{
    const pass1 = req.body.password1;
    const pass2 = req.body.password2;
    
    
    if(pass1 == pass2){
        await db.query("INSERT INTO landlord (name,password) VALUES ($1,$2)",[req.body.username,pass1]);
        res.redirect("/login");
    }else{
        res.redirect("/regis/customer");
    }
});

app.post("/login/send",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const result = await db.query("SELECT * FROM (SELECT user_id,name,password FROM customer UNION SELECT * FROM landlord UNION SELECT * FROM governor UNION SELECT * FROM admin) WHERE name = ($1)",[username]);

        console.log(result.rows);

        const data = result.rows[0];
        if(data.password === password){
            user_now = data.name;
            if((await db.query("SELECT * FROM customer WHERE name = ($1)",[username])).rows.length > 0){
                res.redirect("/home_customer");
                role_now = "customer";
            }else if ((await db.query("SELECT * FROM landlord WHERE name = ($1)",[username])).rows.length > 0){
                res.redirect("/landlord");
                role_now = "landlord";
            }
            else if((await db.query("SELECT * FROM admin WHERE name = ($1)",[username])).rows.length > 0){
                res.redirect("/admin");
            }else if((await db.query("SELECT * FROM governor WHERE name = ($1)",[username])).rows.length > 0){
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



//filtering

app.post("/search/filter",async(req,res)=>{
    console.log(req.body);
    console.log(role_now);

    const data = await db.query("SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name) WHERE land_type = ($1)",[req.body.type]);

    if(role_now === "customer"){
        res.render("customer/customer_search.ejs",{customer_name: user_now,lands:data.rows});
    }else if(role_now === "landlord"){
        res.render("landlord/landlord_search.ejs",{user_name: user_now,lands:data.rows});
    }else if(role_now==="admin"){
        res.render("admin/admin_land.ejs",{customer_name: user_now,lands:data.rows});
    }
})

app.post("/search-filter-name",async (req,res)=>{
    console.log(req.body);

    const data = await db.query(`SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name) WHERE LOWER(land_name) LIKE '%${(req.body.search_item).toLowerCase()}%'`);

    if(role_now === "customer"){
        res.render("customer/customer_search.ejs",{customer_name: user_now,lands:data.rows});
    }else if(role_now === "landlord"){
        res.render("landlord/landlord_search.ejs",{user_name: user_now,lands:data.rows});
    }else if(role_now==="admin"){
        res.render("admin/admin_land.ejs",{customer_name: user_now,lands:data.rows});
    }
});


app.post("/filter-side",async (req,res)=>{
    console.log(role_now);
    console.log(req.body);

    const data = await db.query("SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name) WHERE land_price BETWEEN ($1) AND ($2)",[req.body.min_value,req.body.max_value]);

    if(role_now === "customer"){
        res.render("customer/customer_search.ejs",{customer_name: user_now,lands:data.rows});
    }else if(role_now === "landlord"){
        res.render("landlord/landlord_search.ejs",{user_name: user_now,lands:data.rows});
    }else if(role_now==="admin"){
        res.render("admin/admin_land.ejs",{user_name: user_now,lands:data.rows});
    }
})

//customer

app.get("/fav",async (req,res)=>{
    const data = await db.query("SELECT * FROM favorite INNER JOIN land ON (favorite.land_id = land.land_id) WHERE fav_owner = ($1)",[user_now]);

    console.log(data.rows);

   res.render("customer/customer_fav.ejs",{user_name: user_now,lands:data.rows}); 
});

app.post("/customer/addfav",async (req,res)=>{
    console.log(req.body);


    try{
        const data = await db.query("SELECT land_id FROM favorite WHERE fav_owner = ($1) AND land_id = ($2) ",[user_now,req.body.fav]);
        if(data.rows.length > 0){
            console.log("there're same land on account");
            res.redirect("/fav");
            return
        }
        await db.query("INSERT INTO favorite (land_id,fav_owner) VALUES ($1,$2)",[req.body.fav,user_now]);
        res.redirect("/fav");
    }catch(err){
        res.redirect("/fav");
    }
});

app.post("/customer/removefav",async (req,res)=>{
    console.log("TO DELETE ",req.body);

    await db.query("DELETE FROM favorite WHERE fav_owner = ($1) AND land_id = ($2)",[user_now,req.body.fav]);

    res.redirect("/fav");
});

//landlord
app.post("/land",(req,res)=>{
    console.log(req.body);

    res.render("landlord/landlord_land.ejs");
})


app.get("/home_customer",(req,res)=>{
    res.render("customer/customer_main.ejs",{customer_name: user_now});
})

app.get("/search",async (req,res)=>{
    // console.log(req.body);

    const data = await db.query("SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name)");

    res.render("customer/customer_search.ejs",{customer_name: user_now,lands:data.rows});
})

app.get("/items/:id",async (req,res)=>{
    const temp_land_id = req.params.id;

    const data = await db.query("SELECT * FROM land WHERE land_id = ($1)",[temp_land_id]);

    //adding view count
    await db.query("INSERT INTO view_count (view_type, view_owner) VALUES ($1,$2)",[data.rows[0].land_type,user_now]);

    console.log(data.rows);


    res.render("customer/customer_item.ejs",{lands:data.rows[0]});
})



app.get("/land/edit/:id",async (req,res)=>{
    console.log(req.params.id);

    const data = await db.query("SELECT * FROM land WHERE land_id = ($1) AND land_owner = ($2)",[req.params.id,user_now]);

    res.render("landlord/landlord_edit.ejs",{lands:data.rows[0]});
});

app.post("/land/edit",async(req,res)=>{
    console.log(req.body);
    console.log("HI!");

    await db.query("UPDATE land SET land_name = ($1), land_price = ($2), land_type = ($3), land_contanct = ($4), land_des = ($5), land_status = ($6) WHERE land_id = ($7)",[req.body.land_name,req.body.land_price,req.body.land_type,req.body.land_phone,req.body.land_des,req.body.status,req.body.land_id]);

    res.redirect('/land');
})

app.get("/landlord/search",async(req,res)=>{
    const data = await db.query("SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name)");

    res.render("landlord/landlord_search.ejs",{user_name:user_now,lands:data.rows});
})




app.listen(port,()=>{
    console.log("server is work!");
});

//admin
app.get("/admin",async (req,res)=>{
    // try{
    //     const data = await db.query("SELECT * FROM land INNER JOIN users ON (land.land_owner = users.name) WHERE users.role = 'landlord'");
    
    //     const lands_status = await db.query("SELECT land_status, COUNT(land_status) FROM (SELECT * FROM land INNER JOIN users ON (land.land_owner = users.name) WHERE users.role = 'landlord') GROUP BY land_status");
    //     console.log(lands_status.rows);

    //     const total_lands = parseInt(lands_status.rows[0].count) + parseInt(lands_status.rows[1].count);

   

    //     const land_unava = (parseInt(lands_status.rows[1].count) / total_lands) * 100;
    //     const land_ava = (parseInt(lands_status.rows[0].count) / total_lands) * 100;

    //     res.render("admin/admin_dash.ejs",{user_name:user_now,land_ava: data.rows, ava:land_ava,unava:land_unava});
    //      }catch(err){
    //          res.render("admin/admin_dash.ejs",{user_name:user_now});
    //      }

    const data = await db.query("SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name)");
    
        const lands_status = await db.query("SELECT land_status, COUNT(land_status) FROM (SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name)) GROUP BY land_status");
        console.log(lands_status.rows);


        //check how many land available or unavailable
        let land_ava = 0;
        let land_unava = 0;

        if(lands_status.rows.find(({land_status})=> land_status === "available")){
            land_ava = lands_status.rows.find(({land_status})=> land_status === "available").count;
        }if(lands_status.rows.find(({land_status})=> land_status === "unavailable")){
            land_unava = lands_status.rows.find(({land_status})=> land_status === "unavailable").count;
        }

        const total_lands = land_ava + land_unava;


        land_ava = (parseInt(land_ava) / total_lands) * 100;
        land_unava = (parseInt(land_unava) / total_lands) * 100;

        //check view count
        const view_check = await db.query("SELECT view_type , COUNT(view_type) FROM view_count GROUP BY view_type;")
        console.log(view_check.rows);

        let view_sale = 0
        let view_rent = 0;

        if(view_check.rows.find(({view_type})=> view_type === "Sale")){
            view_sale = view_check.rows.find(({view_type})=> view_type === "Sale").count;
        }if(view_check.rows.find(({view_type})=> view_type === "Rent")){
            view_rent = view_check.rows.find(({view_type})=> view_type === "Rent").count;
        }

        console.log(view_sale,view_rent);


        res.render("admin/admin_dash.ejs",{user_name:user_now,land_ava: data.rows, ava:land_ava,unava:land_unava,sale_count:view_sale,rent_count:view_rent});
})

app.get("/admin_land",async(req,res)=>{
    try{
        const data = await db.query("SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name)");

        console.log(data.rows);

        res.render("admin/admin_land.ejs",{lands:data.rows,user_name : user_now});
    }catch(err){
        console.log(err);
        res.render("admin/admin_land.ejs",{user_name:user_now});
    }
})

app.get("/admin_user",async (req,res)=>{
    const users_data = await db.query("SELECT * FROM customer");
    const landlord_data = await db.query("SELECT * FROM landlord");

    console.log(landlord_data.rows);

    res.render("admin/admin_user.ejs",{users:users_data.rows,landlords:landlord_data.rows,user_name:user_now});
})

app.get("/admin/Blacklist",async (req,res)=>{
    const user_data = await db.query("SELECT * FROM blacklist INNER JOIN customer ON (blacklist.user_name = customer.name)");
    const landlord_data = await db.query("SELECT * FROM blacklist INNER JOIN landlord ON (blacklist.user_name = landlord.name)");


    res.render("admin/admin_blacklist.ejs",{users:user_data.rows, landlords:landlord_data.rows});
})

app.get("/admin/landlord/detail/:id",async (req,res)=>{
    console.log(req.params.id);

    const findUser = await db.query("SELECT name FROM landlord WHERE user_id = $1",[req.params.id]);
    console.log(findUser.rows);

    const land_ava_data = await db.query("SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name) WHERE land_owner = $1 AND land_status = 'available'",[findUser.rows[0].name]);
    const land_unava_data = await db.query("SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name) WHERE land_owner = $1 AND land_status = 'unavailable'",[findUser.rows[0].name]);
    console.log(land_ava_data.rows);

    res.render("admin/admin_detail_landlord.ejs",{user_name:user_now,target:findUser.rows[0].name,land_ava:land_ava_data.rows,land_unava:land_unava_data.rows});
})

app.get("/admin/user/detail/:id",async (req,res)=>{
    console.log(req.params.id);

    const findUser = await db.query("SELECT name FROM customer WHERE user_id = $1",[req.params.id]);
    console.log(findUser.rows);

    const fav_lands = await db.query("SELECT * FROM land INNER JOIN favorite ON (land.land_id = favorite.land_id) WHERE favorite.fav_owner = ($1)",[findUser.rows[0].name]);
    console.log(fav_lands.rows);

    const view_user = await db.query("SELECT view_type,COUNT(view_type) FROM view_count WHERE view_owner = ($1) GROUP BY view_type",[findUser.rows[0].name]);
    console.log(view_user.rows);

    let view_sale = 0; let view_rent = 0;
    if (view_user.rows.find(({view_type})=>view_type ==="Sale")){
        view_sale = view_user.rows.find(({view_type})=>view_type ==="Sale").count;
    }if (view_user.rows.find(({view_type})=>view_type ==="Rent")){
        view_rent = view_user.rows.find(({view_type})=>view_type ==="Rent").count;
    }

    console.log(view_sale,view_rent);

    res.render("admin/admin_detail_user.ejs",{user_name:user_now,target:findUser.rows[0].name,lands:fav_lands.rows,view_sale:view_sale,view_rent:view_rent});
})

app.get("/admin/edit/:id",async (req,res)=>{
    console.log(req.params.id);

    const data = await db.query("SELECT * FROM land WHERE land_id = ($1)",[req.params.id]);
    console.log(data.rows);

    res.render("admin/admin_edit.ejs",{lands:data.rows[0],user_name:user_now,land_owner:data.rows[0].land_owner});
});

app.post("/admin/edit",async(req,res)=>{
    console.log(req.body);
    console.log("HI!");

    await db.query("UPDATE land SET land_name = ($1), land_price = ($2), land_type = ($3), land_contanct = ($4), land_des = ($5), land_status = ($6) WHERE land_id = ($7)",[req.body.land_name,req.body.land_price,req.body.land_type,req.body.land_phone,req.body.land_des,req.body.status,req.body.land_id]);

    res.redirect('/admin_land');
})

app.post("/admin/ban/:id",async (req,res)=>{
    console.log(req.params.id);
    const data = await db.query("SELECT * FROM ((SELECT user_id,name,password FROM customer) UNION (SELECT * FROM landlord)) WHERE user_id = ($1)",[req.params.id]);
    const name = data.rows[0].name;

    deleteDatabaseFromName(name);


    res.redirect("/admin_user");
});

app.post("/admin/blacklist/:id",async(req,res)=>{
    console.log(req.params.id);

    const find_user = await db.query("SELECT * FROM ((SELECT user_id,name,password FROM customer) UNION (SELECT * FROM landlord)) WHERE user_id = ($1)",[req.params.id]);


    console.log(find_user);
    
    const blacklist_user = await db.query("SELECT user_name FROM blacklist WHERE user_name = ($1)",[find_user.rows[0].name]);
    if(blacklist_user.rows.length > 0){
        console.log("there're same name in blacklist");
        res.redirect("/admin/Blacklist");
        return
    }else{
        console.log("added to blacklist");
        await db.query("INSERT INTO blacklist (user_name) VALUES ($1)",[find_user.rows[0].name]);
    }

    res.redirect("/admin/Blacklist");
})

app.post("/admin/unblacklist/:id",async(req,res)=>{
    console.log(req.params.id);

    const find_user = await db.query("SELECT * FROM ((SELECT user_id,name,password FROM customer) UNION (SELECT * FROM landlord)) WHERE user_id = ($1)",[req.params.id]);
    console.log(find_user.rows[0].name);

    await db.query("DELETE FROM blacklist WHERE user_name = ($1)",[find_user.rows[0].name]);

    res.redirect("/admin_user");
})



//governor
app.get("/Dashboard",async (req,res)=>{
    const data = await db.query("SELECT * FROM customer");
    console.log(data.rows);

    let sale = await db.query("SELECT land_type,COUNT(land_type) FROM land WHERE land_type = 'Sale' GROUP BY land_type");
    let rent = await db.query("SELECT land_type,COUNT(land_type) FROM land WHERE land_type = 'Rent' GROUP BY land_type");
    let sold = await db.query("SELECT land_status,COUNT(land_status) FROM land WHERE land_status = 'soldout' GROUP BY land_status");
    
    if (sale.rows.length <= 0){sale=0}else{sale = sale.rows[0].count}
    if (rent.rows.length <= 0){rent=0}else{rent = rent.rows[0].count}
    if (sold.rows.length <= 0){sold=0}else{sold = sold.rows[0].count}

    let customer = {};
    data.rows.forEach((each)=>{
        customer.key = each.date;
        customer.value = each.user_id;
    });

    console.log(sale.rows);
    console.log(rent.rows);
    console.log(sold.rows);

    // let dict = {};
    // rows.forEach((row) => {
    //     dict[row.date] = row.price;
    // });

    res.render("governor/governor_dashboard.ejs",{user_name: user_now,total_user:data.rows.length,sale,rent,sold});
})

app.get("/governor/audit", async (req,res)=>{
    const data = await db.query("SELECT * FROM land INNER JOIN landlord ON (land.land_owner = landlord.name)");



    res.render("governor/governor_audit_log.ejs",{user_name:user_now,lands:data.rows});
})

app.post("/governor/check_true",async (req,res)=>{
    console.log(req.body);

    await db.query("UPDATE land SET checker = true WHERE land_id = $1",[req.body.check]);

    console.log("this is change to be true");
    res.redirect("/governor/audit");
})

app.post("/governor/check_false",async (req,res)=>{
    console.log(req.body);
    
    await db.query("UPDATE land SET checker = false WHERE land_id = $1",[req.body.check]);

    console.log("this is change to be false")
    res.redirect("/governor/audit");
})

app.post("/governor/del_land/:id",async(req,res)=>{
    console.log(req.params.id);
    
    //deleting land
    await db.query("DELETE FROM land WHERE land_id = $1",[req.params.id]);

    res.redirect("/governor/audit");
})



//dangerous function

async function deleteDatabaseFromName(name){
    await db.query("DELETE FROM customer WHERE name = ($1)",[name]);
    await db.query("DELETE FROM landlord WHERE name = ($1)",[name]);
    // await db.query("DELETE FROM users WHERE name = ($1)",[name]);
    await db.query("DELETE FROM land WHERE land_owner = ($1)",[name]);
    await db.query("DELETE FROM favorite WHERE fav_owner = ($1)",[name]);
    await db.query("DELETE FROM blacklist WHERE user_name = ($1)",[name]);
    await db.query("DELETE FROM view_count WHERE view_owner = ($1)",[name]);
}