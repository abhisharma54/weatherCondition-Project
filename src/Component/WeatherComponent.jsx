import { useState, useEffect } from "react";
import {
  rainIcon,
  sunIcon,
  cloudyIcon,
  thunderIcon,
  mistIcon,
  clearSkyIcon,
  searchIcon,
  windSpeed,
  humidity,
  location,
  date,
  condition,
  time,
} from "../assets/assest";
import axios from "axios";

function WeatherComponent() {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('')
  const [input, setInput] = useState("");

  const search = async (city) => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;
    try {
      setInput("");
      setLoading(true);
      const response = await axios.get(url);
      const data = response.data;
      
      const dayNow = new Intl.DateTimeFormat("en-US", {
        timeZone: data.location.tz_id,
        weekday: "long",
      })
        .format(new Date())
        .toUpperCase();

      const timeNow = new Intl.DateTimeFormat("en-US", {
        timeZone: data.location.tz_id,
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());

      const weatherDetails = {
        location: data.location.name,
        windSpeed: data.current.wind_kph,
        humidity: data.current.humidity,
        temperature: Math.floor(data.current.temp_c),
        feelsTemp: Math.floor(data.current.feelslike_c),
        date: data.location.localtime,
        condition: data.current.condition.text,
        day: dayNow,
        time: timeNow,
      }

      setWeatherData(weatherDetails);
      sessionStorage.setItem("weatherData", JSON.stringify(weatherDetails))
    } catch (error) {
      console.log(error)
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedWeatherData = sessionStorage.getItem("weatherData");
    if (savedWeatherData) {
      setWeatherData(JSON.parse(savedWeatherData));
    } else {
      search("new delhi");
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if(input.trim() !== '') {
      search(input);
      setInputError("")
    } else {
      setInputError("Please enter a city name")
    }
  };
  
  const weatherCondition = weatherData?.condition || "";
  const conditions = {
    mist: mistIcon,
    "light rain": thunderIcon,
    rain: rainIcon,
    drizzle: rainIcon,
    cloudy: cloudyIcon,
    sunny: sunIcon,
    overcast: cloudyIcon,
    clear: clearSkyIcon,
  };

  const getWeatherIcon = () => {
    const weather = weatherCondition.toLowerCase();
    const matchWeather = Object.keys(conditions).find(condition => 
      weather.includes(condition)
    )

    return conditions[matchWeather];
  }

  const weatherIcon = getWeatherIcon();

  return (
    <div className="w-full h-screen text-white">
      {error ? (
      <div className="min-h-full flex justify-center items-center">
        <div className="flex flex-col items-center justify-center gap-10 px-4">
          <img
            className="w-[250px] p-4 border-t-4 border-l-4 rounded-full shadow-2xl max-[425px]:w-[150px]"
            src={condition}
            alt=""
          />
          <h1 className="text-3xl text-center font-bold tracking-wide max-[425px]:text-lg">
            {error}
          </h1>
          <button
            className="px-5 py-2 mt-[-1.5rem] text-lg font-semibold bg-blue-500 text-white rounded-full shadow-lg transition-all hover:bg-blue-600 focus:bg-zinc-700 focus:text-white max-[425px]:text-[1.1rem]"
            onClick={() => window.location.reload()}
          >
            Go back
          </button>
        </div>
      </div>
      ) : (
        <div className="flex justify-center items-center gap-4 py-32 max-[1024px]:px-9 max-[768px]:flex-col">
          <div className="w-[30rem] bg-weather-img bg-cover rounded-2xl shadow-lg border-[1px] border-gray-400 overflow-hidden max-[768px]:w-[25rem] max-[425px]:w-[23rem]">
            <div className="backdrop-blur-sm px-8 py-12 w-[101%] h-[101%]">
              {inputError && <p className="text-center [text-shadow:_1px_1px_20px_green] max-[768px]:mb-6 max-[425px]:mb-8">{inputError}</p>}
              <form
                onSubmit={handleSearch}
                className="search flex gap-2.5 w-full justify-center items-center max-[768px]:mt-[-20px] max-[425px]:mt-[-30px]"
              >
                <input
                  type="text"
                  placeholder="search city..."
                  value={input}
                  onChange={(e) => setInput(e.currentTarget.value)}
                  className="search-input w-full bg-zinc-800 tracking-wide px-3.5 py-2 rounded-full shadow-xl transition-all focus:border-2 focus:outline-none"
                />
                <button type="submit">
                  <img
                    className="search-icon w-[40px] cursor-pointer transition hover:scale-110"
                    src={searchIcon}
                    alt="search-icon-img"
                  />
                </button>
              </form>
              <div className="temp-section flex flex-col justify-center items-center mt-8">
                {loading? (<img
                    className="w-32 max-[768px]:w-24 max-[425px]:w-20"
                    src={clearSkyIcon}
                    alt="default-icon"
                  />) : weatherIcon && (
                  <img
                    className="w-32 max-[768px]:w-24 max-[425px]:w-20"
                    src={weatherIcon}
                    alt="weather-icon"
                  />
                )}
                <h1 className="text-[3rem] font-bold [text-shadow:_0_0_15px_rgb(0_0_0_/_60%)] max-[768px]:text-[2.5rem]">
                  {weatherData.temperature || "0"}°c
                </h1>
                <p className="font-[600] [text-shadow:_0_0_10px_rgb(0_0_0_/_60%)] mt-[-10px]">
                  feels like {loading? "loading..." : weatherData.feelsTemp || "0"}°c
                </p>
                <h1 className="text-[3rem] font-bold [text-shadow:_0_0_5px_rgb(0_0_0_/_40%)] mt-[0.5rem] max-[1024px]:text-[2.5rem] max-[768px]:text-[2.3rem] max-[768px]:mt-[-5px]">
                  {loading ? "loading..." : weatherData.day }
                </h1>
                <div className="flex">
                  <img
                    className="w-8 h-8 mr-1.5 shadow-2xl"
                    src={location}
                    alt="wind-speed-png"
                  />
                  <p className="text-2xl font-semibold [text-shadow:_0_0_5px_rgb(0_0_0_/_50%)] tracking-wider">
                    {loading? "location loading..." : weatherData.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[30rem] flex flex-col gap-2.5 overflow-hidden py-8 px-12 rounded-2xl bg-[#202020] shadow-2xl border-[1px] border-gray-400 max-[768px]:w-[25rem] max-[425px]:w-[23rem]">
            <h1 className="text-3xl text-nowrap font-bold tracking-wider px-2 py-1.5 bg-[rgb(43,165,255)] bg-custom-gradient text-[#202020] text-center rounded-full mt-2.5 shadow-xl max-[1024px]:text-2xl max-[425px]:mt-[-5px]">
              Weather Details
            </h1>
            <div className="humidity flex justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <img
                  className="w-8 mr-1.5"
                  src={humidity}
                  alt="humdityIcon-png"
                />
                <h1 className="text-2xl mr-10 font-medium tracking-wider max-[1024px]:text-[1.2rem] max-[768px]:text-[1.3rem]">
                  Humidity
                </h1>
              </div>
              <p className="text-xl font-normal tracking-wider max-[1024px]:text-[1.1rem]">
                {loading? "loading..." : weatherData.humidity}%
              </p>
            </div>
            <div className="windSpeed flex justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  className="w-8 mr-1.5"
                  src={windSpeed}
                  alt="wind-speed-png"
                />
                <h1 className="text-2xl mr-10 text-nowrap font-medium tracking-wider max-[1024px]:text-[1.2rem] max-[768px]:text-[1.3rem]">
                  Wind Speed
                </h1>
              </div>
              <p className="text-xl font-normal tracking-wider max-[1024px]:text-[1.1rem]">
                {loading? "loading..." : weatherData.windSpeed}km/h
              </p>
            </div>
            <div className="location flex justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  className="w-8 mr-1.5"
                  src={location}
                  alt="wind-speed-png"
                />
                <h1 className="text-2xl mr-10 font-medium tracking-wider max-[1024px]:text-[1.2rem] max-[768px]:text-[1.3rem]">
                  Location
                </h1>
              </div>
              <p className="text-xl text-nowrap font-normal tracking-wider max-[1024px]:text-[1.1rem]">
                {loading? "loading..." : weatherData.location}
              </p>
            </div>
            <div className="date flex justify-between">
              <div className="flex items-center gap-2.5">
                <img className="w-8 mr-1.5" src={date} alt="wind-speed-png" />
                <h1 className="text-2xl mr-10 font-medium tracking-wider max-[1024px]:text-[1.2rem] max-[768px]:text-[1.3rem]">
                  Date
                </h1>
              </div>
              <p className="text-xl font-normal tracking-wider max-[1024px]:text-[1.1rem]">
                {loading? "loading..." : new Date(weatherData.date).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="time flex justify-between">
              <div className="flex items-center gap-2.5">
                <img className="w-8 mr-1.5" src={time} alt="wind-speed-png" />
                <h1 className="text-2xl mr-10 font-medium tracking-wider max-[1024px]:text-[1.2rem] max-[768px]:text-[1.3rem]">
                  Time
                </h1>
              </div>
              <p className="text-xl text-nowrap font-normal tracking-wider max-[1024px]:text-[1.1rem]">
                {loading? "loading..." : weatherData.time}
              </p>
            </div>
            <div className="condition flex flex-col items-center gap-2.5 cursor-text">
              <h1 className="text-2xl text-nowrap font-semibold tracking-wider px-4 py-1 bg-zinc-600 text-white w-min text-center rounded-full mt-2.5 shadow-xl max-[1024px]:text-[1.3rem]">
                Weather Condition
              </h1>
              <img
                className="w-20 bg-black p-2 mr-1.5 mt-2.5 rounded-full"
                src={condition}
                alt="wind-speed-png"
              />
              <p className="text-lg font-normal tracking-wider text-center max-[768px]:text-[1.3rem] max-[425px]:text-[1.1rem] max-[425px]:mt-0">
                {loading? "loading..." : weatherData.condition}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherComponent;
