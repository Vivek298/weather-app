import React, { useEffect, useRef, useState } from 'react';
import search_icon from '../assets/search.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const WeatherPage = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true); // State for temperature unit
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Track online status

  const search = async (city) => {
    if (city === '') {
      alert('Enter City Name');
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: iconUrl,
        description: data.weather[0].description,
      });
    } catch (error) {
      setWeatherData(null);
      console.error('Error in Fetching Weather Data:', error);
    }
  };

  useEffect(() => {
    search('London');

    // Handle online/offline status
    const handleOnlineStatus = () => {
      setIsOnline(true);
    };

    const handleOfflineStatus = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  // Function to toggle between Celsius and Fahrenheit
  const toggleTemperatureUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  // Convert temperature to Fahrenheit if isCelsius is false
  const displayedTemperature = isCelsius
    ? `${weatherData?.temperature}°C`
    : `${Math.round((weatherData?.temperature * 9) / 5 + 32)}°F`;

  return (
    <div className='min-h-screen grid place-items-center bg-gray-600'>
      {/* Ensure the div is a complete circle with equal width and height */}
      <div className='bg-orange-950 w-96 h-96 rounded-full flex flex-col items-center justify-center shadow-lg relative'>
        {/* Display an alert when the user is offline */}
        {!isOnline && (
          <div className='absolute top-4 bg-red-500 text-white py-2 px-4 rounded-md text-sm shadow-lg'>
            You are currently offline
          </div>
        )}
        
        <div className='flex items-center gap-3 mt-12'>
          <input
            ref={inputRef}
            type='text'
            placeholder='Search'
            className='h-12 rounded-full px-5 text-gray-600 bg-teal-50 focus:outline-none'
          />
          <img
            src={search_icon}
            alt='search-icon'
            className='w-12 p-3 bg-teal-50 rounded-full cursor-pointer'
            onClick={() => search(inputRef.current.value)}
          />
        </div>

        {weatherData && (
          <>
            <img src={weatherData.icon} alt='weather-icon' className='w-40 mt-8' />
            <p className='text-white text-6xl mt-4'>{displayedTemperature}</p>
            <p className='text-white text-3xl mt-2'>{weatherData.location}</p>
            <p className='text-white text-2xl mt-1 capitalize'>{weatherData.description}</p>
            <div className='flex justify-between mt-8 w-full text-white px-8'>
              <div className='flex items-center gap-3'>
                <img src={humidity_icon} alt='humidity-icon' className='w-6' />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span className='text-sm'>Humidity</span>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <img src={wind_icon} alt='wind-icon' className='w-6' />
                <div>
                  <p>{weatherData.windSpeed} m/s</p>
                  <span className='text-sm'>Wind Speed</span>
                </div>
              </div>
            </div>

            {/* Toggle Button for Temperature Unit */}
            <button
              className='mt-5 p-2 bg-orange-950 text-white rounded-full'
              onClick={toggleTemperatureUnit}
            >
              Switch to {isCelsius ? '°F' : '°C'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
