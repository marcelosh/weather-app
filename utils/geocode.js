const request = require('request');
let key;
try {
    const conf = require('../conf.js');
    key = conf.CKEY;
} catch(e) {
    key = process.env.CKEY;
}

const geocode = (address, debug, callback) => {
    const url = 'http://api.positionstack.com/v1/forward?access_key=' + key + '&query=' + encodeURIComponent(address) + '&limit=1';

    request({ url, json: true}, (error, { body } = {}) => {
        if(error) {
            if(debug) {
                console.log('DEBUG: geocode request error', error);
            }

            callback('Não foi possível conectar ao serviço de localização.', undefined);
            return;
        }

        if(body.error) {
            if(debug) {
                console.log('DEBUG: geocode api error', body.error);
            }

            callback('Não foi possível encontrar a localização. Tente uma busca diferente.', undefined);
            return;
        }

        if(!body.data || body.data.length === 0) {
            if(debug) {
                console.log('DEBUG: geocode api response body', body);
            }

            callback('Não foi possível encontrar a localização. Tente uma busca diferente.', undefined);
            return;
        }

        const { latitude, longitude, label } = body.data[0];

        if(debug) {
            console.log('DEBUG: geocode api body', body);
        }

        callback(undefined, {
            latitude,
            longitude,
            location: label
        });
    });
};

module.exports = geocode;
