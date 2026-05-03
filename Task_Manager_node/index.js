import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import cors from "cors";
import pgSession from "connect-pg-simple";
import path from "path";
import { fileURLToPath } from "url";



env.config();
const app= express();
const port= process.env.PORT;
const saltRounds=parseInt(process.env.SALTROUNDS);
const PgSession = pgSession(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})
db.connect();

app.set("trust proxy", 1);
app.use(express.json());
app.use(session({
    store: new PgSession({
        conObject: {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        },
        createTableIfMissing: true
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: true
    }
}))

app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, "../Task_Manager_UI/task_manager_ui/dist")));




app.get("/dashboard", async (req,res) => {
    if(req.isAuthenticated()) {
        const user = parseInt(req.user.id);
        const tasks = await db.query("SELECT * FROM tasks WHERE user_id=$1", [user]);
        res.json({ success: true, tasks: tasks.rows })
    } else {
        res.status(401).json({ success: false })
    }
})

app.post("/register", async(req,res) => {
    const email= req.body.username;
    const password= req.body.password;
    console.log(email);
    

    try {
        const registeredUser = await db.query("SELECT * FROM users WHERE email= $1",[email]);
        console.log(registeredUser.rows)
        if (registeredUser.rows.length > 0) {
            res.status(409).json({ error: "Email already exists" })
        } else {
            bcrypt.hash(password, saltRounds, async(err,hash) => {
              const result = await db.query("INSERT INTO users(email,password) VALUES($1,$2)", [email,hash])
              res.json({success:true})
            })
        }
    } catch(err) {
        res.status(500).json({ error: "Internal server error" })
        console.log(err);
    }
})


app.post("/login", passport.authenticate("local"), (req,res) => {
    res.json({ success: true })
})

passport.use(new Strategy(async function verify(username, password, cb) {
    try{
        const result = await db.query("SELECT * FROM users WHERE email=$1",[username]);

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
            return cb(null,false)
        }
        
    } catch(err) {
        cb(err);
        console.log(err);
    }
}))

app.post("/dashboard", async (req,res) => {
    const title= req.body.title;
    const description= req.body.description;
    
    try {
        if(req.isAuthenticated()) {
            const user= parseInt(req.user.id);
            const task = await db.query("INSERT INTO tasks(title,description,user_id) VALUES($1,$2,$3) RETURNING id", [title,description,user]);
            res.json({ success: true, id: task.rows[0].id })            
        } else {
            res.json({ success: false });

        }
    } catch(err) {
        res.status(501).json({error: "Cant add to database"})
        console.log(err)
    }
})

app.post('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.json({ success: true });
    });
  });

  app.post("/done", async(req,res) => {
    const done= "completed";
    const id= parseInt(req.body.id);
    try {
        const task= await db.query("UPDATE tasks SET status =$1 WHERE id=$2",[done, id]);
        res.json({success:true, id: id})
    } catch(err) {
        console.error(err);
    }
  })

  app.post("/delete", async (req,res) => {
    const id= parseInt(req.body.id);
    try {
        const task= await db.query("DELETE FROM tasks WHERE id=$1", [id])
        res.json({success:true})
    } catch(err) {
        console.error(err)
    }
  })

  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../Task_Manager_UI/dist/index.html"));
});

passport.serializeUser((user,cb) => {
    cb(null,user)
});

passport.deserializeUser((user,cb) => {
    cb(null,user)
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});


