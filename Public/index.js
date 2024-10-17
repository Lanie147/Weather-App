import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config";


const app = express();
const port = 3000;
const authToken = process.env.APIKEY;

function getCurrentDate(){
const currentDate = new Date()
const options = {
    weekday: "long",
    day: "2-digit",
    month: "short"
}
return currentDate.toLocaleDateString("en-GB", options)
}
console.log(getCurrentDate());



app.use(express.static("public"))
app.use("/css",express.static("dist"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try{
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=so53,GB&appid=${authToken}`)
        const result = response.data;
        const lat = response.data.lat;
        const lon = response.data.lon;
        const responseCoord = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${authToken}`)
        const resultcoord = responseCoord.data;
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
// app.get("/", async (req, res) => {
//     try{
//         const responseCoord = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${authToken}`)
//         const result = response.data;
//         res.render("index.ejs", {data: result});
//     }
//     catch (error) {
//         console.error("Failed to make request:", error.message);
//         res.status(500);
//         res.render("index.ejs", {
//             error: error.message,
//     });
//     }
// });

app.post("/Search", async (req, res) => {
    try{
        const location = req.body.location;
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${location},GB&appid=` + authToken)
        const result = response.data;
        const lat = response.data.lat;
        const lon = response.data.lon;
        const responseCoord = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${authToken}`)
        const resultcoord = responseCoord.data;
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