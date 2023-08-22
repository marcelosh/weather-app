const request = require('request');
const weather = require('./weather.js');

const forecast = (latitude, longitude, debug, callback) => {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current_weather=true';

    request({ url, json: true }, (error, { body } = {}) => {
        if(error) {
            if(debug) {
                console.log('DEBUG: forecast request error', error);
            }

            callback('Não foi possível conectar ao serviço de informações climáticas.', undefined);
            return;
        }

        if(body.error) {
            if(debug) {
                console.log('DEBUG: forecast api error', body.error);
            }

            callback('Não foi possível encontrar informações sobre o clima deste local.', undefined);
            return;
        }

        const { temperature, weathercode, is_day } = body.current_weather;
        const daytime = is_day === 1 ? 'dia' : 'noite';

        if(debug) {
            console.log('DEBUG: forecast api body', body);
        }

        callback(undefined, {
            temperature,
            weather: weather.types[weathercode],
            daytime
        });
    });
};

module.exports = forecast;