import express from "express";
import pg from "pg";
import axios from "axios";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";


const app= express();
const port= 3000;


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


