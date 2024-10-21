import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = 3000;
const authToken = process.env.APIKEY;

function getDayLabel(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString("en-GB", { weekday: "short" });
}
// Function to get the current day and date
function getCurrentDayAndDate() {
    const currentDate = new Date();
    return {
        day: currentDate.toLocaleDateString("en-GB", { weekday: "long" }),
        date: currentDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    };
}

// Function to fetch weather data by coordinates
async function fetchWeatherByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${authToken}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        throw error;
    }
}

// Function to fetch coordinates by location
async function fetchCoordinatesByZip(zip) {
    const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},GB&appid=${authToken}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching coordinates:", error.message);
        throw error;
    }
}

// Function to parse weather data
function parseWeatherData(weatherData) {
    return {
        currentTemp: Math.round(weatherData.current.temp),
        currentWeatherMain: weatherData.current.weather[0].main,
        currentWeatherDescription: weatherData.current.weather[0].description,
        currentWeatherIcon: weatherData.current.weather[0].icon,
        hourly: weatherData.hourly,
        daily: weatherData.daily
    };
}

app.use(express.static("public"));
app.use("/css", express.static("dist"));
app.use(bodyParser.urlencoded({ extended: true }));

// Set local variables for day and date
const currentDayAndDate = getCurrentDayAndDate();
app.locals.day = currentDayAndDate.day;
app.locals.date = currentDayAndDate.date;

// Route for the homepage
app.get("/", async (req, res) => {
    try {
        const { lat, lon, name } = await fetchCoordinatesByZip("so53");
        const weatherData = await fetchWeatherByCoordinates(lat, lon);
        const parsedData = parseWeatherData(weatherData);
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(getDayLabel(i));
        }
        res.render("index.ejs", { 
            data: parsedData,
            nameOfPlace: name,
            icon: parsedData.currentWeatherIcon,
            hourly: parsedData.hourly,
            days: days
        });
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500).render("index.ejs", {
            error: "Unable to fetch weather data. Please try again later.",
            data: {},
            nameOfPlace: null,
            icon: null,
            hourly: [],
            days: []
        });
    }
});

// Route for searching weather by location
app.post("/Search", async (req, res) => {
    try {
        const location = req.body.location;
        const { lat, lon, name } = await fetchCoordinatesByZip(location);
        const weatherData = await fetchWeatherByCoordinates(lat, lon);
        const parsedData = parseWeatherData(weatherData);
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(getDayLabel(i));
        }
        res.render("index.ejs", { 
            data: parsedData,
            nameOfPlace: name,
            icon: parsedData.currentWeatherIcon,
            hourly: parsedData.hourly,
            days: days
        });
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500).render("index.ejs", {
            error: "Unable to fetch weather data. Please check the location and try again.",
            data: {},
            nameOfPlace: null,
            icon: null,
            hourly: [],
            days: []
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
