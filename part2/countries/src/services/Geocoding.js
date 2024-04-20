import axios from 'axios'

const API_key = import.meta.env.VITE_SOME_KEY

const baseUrl = (city) => 
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_key}`

let cityCoordinates = {};

const getCityCoordinates = (city) => {
    if (cityCoordinates[city]) {
        return Promise.resolve(cityCoordinates[city]);
    } else {
        const request = axios.get(baseUrl(city));
        return request.then(response => {
            const coordinates = {
                lat: response.data[0].lat,
                lon: response.data[0].lon
            };
            //console.log('coordinates',coordinates)
            cityCoordinates[city] = coordinates;
            return coordinates;
        });
    }
};



export default { getCityCoordinates };
