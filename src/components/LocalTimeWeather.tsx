import { useState, useEffect } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Clock,
  MapPin,
  Wind,
  Thermometer,
} from "lucide-react";

export default function LocalTimeWeather() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{
    temp: number;
    feelsLike: number;
    windSpeed: number;
    code: number;
    city: string;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      try {
        let lat, lon, city;
        
        // Attempt 1: geojs (reliable, no cors issues)
        try {
          const locRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
          if (locRes.ok) {
            const locData = await locRes.json();
            if (locData && locData.latitude) {
              lat = parseFloat(locData.latitude);
              lon = parseFloat(locData.longitude);
              city = locData.city;
            }
          }
        } catch (e) {}

        // Attempt 2: ipapi (frequently rate limited but good fallback)
        if (!lat || !lon) {
          try {
            const locRes = await fetch("https://ipapi.co/json/");
            if (locRes.ok) {
              const locData = await locRes.json();
              if (locData && locData.latitude) {
                lat = locData.latitude;
                lon = locData.longitude;
                city = locData.city;
              }
            }
          } catch (e) {}
        }

        // Fallback if all IP trackers are blocked (e.g. Brave browser)
        if (!lat || !lon) {
          // Defaulting to user's likely region based on CV insights
          lat = 23.8103;
          lon = 90.4125;
          city = "Dhaka";
        }

        if (lat && lon) {
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code`,
          );
          if (weatherRes.ok) {
            const weatherData = await weatherRes.json();
            setWeather({
              temp: weatherData.current.temperature_2m,
              feelsLike: weatherData.current.apparent_temperature,
              windSpeed: weatherData.current.wind_speed_10m,
              code: weatherData.current.weather_code,
              city: city || "Local",
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch weather", err);
      }
    }
    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun className="w-3.5 h-3.5 text-yellow-500" />;
    if (code <= 3) return <Cloud className="w-3.5 h-3.5 text-slate-400" />;
    if (code <= 67)
      return <CloudRain className="w-3.5 h-3.5 text-brand-blue" />;
    if (code <= 77) return <CloudSnow className="w-3.5 h-3.5 text-slate-300" />;
    if (code <= 99)
      return <CloudLightning className="w-3.5 h-3.5 text-brand-purple" />;
    return <Sun className="w-3.5 h-3.5 text-yellow-500" />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code === 1) return "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if (code === 45 || code === 48) return "Fog";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code === 56 || code === 57) return "Freezing Drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code === 66 || code === 67) return "Freezing Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code === 85 || code === 86) return "Snow Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Weather";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col items-end gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
      <div className="flex items-center space-x-1 border border-slate-200 dark:border-white/10 rounded-full px-2 py-1 bg-slate-50 dark:bg-white/5 whitespace-nowrap shadow-sm backdrop-blur-md">
        <Clock className="w-3.5 h-3.5 text-brand-cyan" />
        <span className="w-[54px] text-center">
          {formatTime(time)}
        </span>
        <span className="opacity-40">&bull;</span>
        <span>{formatDate(time)}</span>
      </div>

      {weather && (
        <>
          <div
            className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 border border-slate-200 dark:border-white/10 rounded-full px-2 py-1 sm:px-3 bg-slate-50 dark:bg-white/5 shadow-sm backdrop-blur-md"
            title="Location and Wind Speed"
          >
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-blue" />
              <span className="max-w-[80px] sm:max-w-[120px] truncate">
                {weather.city}
              </span>
            </div>

            <span className="opacity-40">&bull;</span>

            <div className="flex items-center gap-1" title="Wind speed">
              <Wind className="w-3.5 h-3.5 text-slate-400" />
              <span>{Math.round(weather.windSpeed)} <span className="text-[9px] uppercase tracking-wide">km/h</span></span>
            </div>
          </div>

          <div
            className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 border border-slate-200 dark:border-white/10 rounded-full px-2 py-1 sm:px-3 bg-slate-50 dark:bg-white/5 shadow-sm backdrop-blur-md"
            title="Temperature & Feels like"
          >
            <div
              className="flex items-center gap-1 cursor-help"
              title={getWeatherDescription(weather.code)}
            >
              {getWeatherIcon(weather.code)}
              <span>{Math.round(weather.temp)}°C</span>
            </div>

            <span className="opacity-40">&bull;</span>
            
            <div className="flex items-center gap-1" title="Feels like">
              <Thermometer className="w-3.5 h-3.5 text-orange-500" />
              <span>{Math.round(weather.feelsLike)}°C</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
