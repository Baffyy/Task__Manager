import express from "express";
import pg from "pg";
import axios from "axios";
import bcrypt from "bcrypt";
import env from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import cors from "cors";



env.config();
const app= express();
const port= process.env.PORT;
const saltRounds=parseInt(process.env.SALTROUNDS);

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})
db.connect();

app.use(cors());
app.use(express.json());
app.use(session ({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use(passport.initialize());
app.use(passport.session())

app.get("/dashboard", (req,res) => {
    if(req.isAuthenticated()) {
        res.json({ success: true })
    } else {
        res.redirect("/login")
    }
})

app.post("/register", async(req,res) => {
    const email= req.body.email;
    const password= req.body.password;

    try {
        const registeredUser = await db.query("SELECT * FROM users WHERE email= $1",[email]);
        if (registeredUser.rows.length > 0) {
            res.send("Email already exists. Try logging in")
        } else {
            bcrypt.hash(password, saltRounds, async(err,hash) => {
              const result = await db.query("INSERT INTO users(email,password) VALUES($1,$2)", [email,hash])
              res.json({success:true})
            })
        }
    } catch(err) {
        res.status(500).json({ error: "Internal server error" })
    }
})

app.post("/login", passport.authenticate("local"), (req,res) => {
    res.json({ success: true })
})

app.post("/dashboard", (req,res) => {
    const title= req.body.title;
    const description= req.body.description;
    try {
        const task= db.query("INSERT INTO tasks(title,description) VALUES($1,$2)",[title,description]);
    } catch(err) {

    }
})

passport.use(new Strategy(async function verify(username, password, cb) {
    try{
        const result = await db.query("SELECT * FROM users WHERE email=$1",[username]);
        console.log(username)

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password; 
            bcrypt.compare(password, storedPassword, async (err, result) => {
                if(err) {
                    return cb(err)
                } else {
                    if(result) {
                        return cb(null, user)
                    } else {
                        return cb(null,false)
                    }
                }
            } )
        } else {
            return cb("User not found")
        }
        
    } catch(err) {
        console.log(err);
    }
}))

passport.serializeUser((user,cb) => {
    cb(null,user)
});

passport.deserializeUser((user,cb) => {
    cb(null,user)
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});


