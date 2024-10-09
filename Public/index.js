import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"))
app.use("/css",express.static("dist"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try{
        res.render("index.ejs");
    }
    catch (error) {
        console.log(error);
        res.status(500);
    }
});

app.listen(port, () =>{
    console.log(`Listening on port ${port}`)
});