import express from "express";
import pg from "pg";
import axios from "axios";
import bcrypt from "bcrypt";
import env from "dotenv";
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

app.post("/login", async(req,res) => {
    const email= req.body.email;
    const loginPassword = req.body.password;

    try{
        const result = await db.query("SELECT * FROM users WHERE email=$1",[email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password; 
            bcrypt.compare(loginPassword, storedPassword, async (err, result) => {
                if(err) {
                    console.log("Error comparing passwords", err)
                } else {
                    if(result) {
                        res.json({ success: true })
                    } else {
                        res.send("Incorrect Password")
                    }
                }
            } )
        } else {
            res.send("user not found");
        }
        
    } catch(err) {
        console.log(err);
    }
   
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


