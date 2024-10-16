import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config";


const app = express();
const port = 3000;
const authToken = process.env.APIKEY;
// const today = new Date();
// const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday","Saturday"];
// const day = daysOfWeek[today.getDay()];
// console.log(daysOfWeek);
const locationNames = {
    chandlersford:{
        lat: 50.995323,
        lon: -1.369236
    },
    donkeys:{
        lat: 50.627220,
        lon: -1.225843
    },
    gosport:{
        lat: 50.790797,
        lon: -1.138200
    },
}



app.use(express.static("public"))
app.use("/css",express.static("dist"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${locationNames.chandlersford.lat}&lon=${locationNames.chandlersford.lon}&units=metric&exclude=minutely&appid=` + authToken)
        const result = response.data;
        res.render("index.ejs", {data: result});
    }
    catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500);
        res.render("index.ejs", {
            error: error.message,
    });
    }
});

app.post("/", async (req, res) => {
    try{
        const location = req.body.location;
        console.log(location);
        // const locationSelected = locationNames.donkeys.lat
        const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${locationNames.chandlersford.lat}&lon=${locationNames.chandlersford.lon}&units=metric&exclude=minutely&appid=` + authToken)
        const result = response.data;
        res.render("index.ejs", {data: result});
    }
    catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500);
        res.render("index.ejs", {
            error: error.message,
    });
    }
});

app.listen(port, () =>{
    console.log(`Listening on port ${port}`)
});