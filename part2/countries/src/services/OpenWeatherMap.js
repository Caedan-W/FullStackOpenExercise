import axios from 'axios'
import Geocoding from './Geocoding'


const API_key = import.meta.env.VITE_SOME_KEY

const baseUrl = ({lat, lon}) => 
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_key}`
    
const getWeather = (city) => {
    return Geocoding.getCityCoordinates(city)
        .then(coordinates => {
            const url = baseUrl(coordinates);
            return axios.get(url);
        })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
        });
};

export default { getWeather };

