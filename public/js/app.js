const weatherForm = document.querySelector('form');
const searchElement = document.querySelector('input');
const paragraph = document.querySelector('#output-text');

function fetchData(location) {
    const url = '/weather?address=' + location;

    paragraph.textContent = 'Cargando...';

    fetch(url).then((response) => {
        response.json().then((data) => {
            const error = data.error;
            if(error) {
                paragraph.textContent = error;
                return;
            }

            const { temperature, weather, daytime, location } = data;

            const localizedTemperature = temperature.toString().replace('.', ',');

            paragraph.textContent = 'Agora é ' + daytime + ' em ' + location + '. Faz ' + localizedTemperature + ' ºC, ' + weather + '.';
        });
    });
}

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = searchElement.value;
    fetchData(location);
});