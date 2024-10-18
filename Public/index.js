import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config";


const app = express();
const port = 3000;
const authToken = process.env.APIKEY;

function getCurrentDay(){
const currentDay = new Date()
const options = {
    weekday: "long"
}
return currentDay.toLocaleDateString("en-GB", options)
}
function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }
    return currentDate.toLocaleDateString("en-GB", options)
    }
console.log(getCurrentDay());



app.use(express.static("public"))
app.use("/css",express.static("dist"))
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.day = getCurrentDay();
const day = app.locals.day
app.locals.date = getCurrentDate();
const date = app.locals.date

app.get("/", async (req, res) => {
    try{
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=so53,GB&appid=${authToken}`)
        const result = response.data;
        const lat = response.data.lat;
        const lon = response.data.lon;
        const responseCoord = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${authToken}`)
        const resultcoord = responseCoord.data;
        res.locals.nameOfPlace = response.data.name;
        res.locals.icon = responseCoord.data.current.weather[0].icon;

        res.render("index.ejs", {data: resultcoord});
        
    }
    catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500);
        res.render("index.ejs", {
            error: error.message,
    });
    }
});


app.post("/Search", async (req, res) => {
    try{
        const location = req.body.location;
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${location},GB&appid=` + authToken)
        const lat = response.data.lat;
        const lon = response.data.lon;
        const responseCoord = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${authToken}`)
        const resultcoord = responseCoord.data;
        res.locals.nameOfPlace = response.data.name;
        res.locals.icon = responseCoord.data.current.weather[0].icon;
        res.render("index.ejs", {data: resultcoord});

        
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