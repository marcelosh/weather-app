const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('../utils/geocode');
const forecast = require('../utils/forecast');

const app = express();
// __dirname
// __filename
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname, '../templates/views');
const partialsDirectoryPath = path.join(__dirname, '../templates/partials');

const author = 'Jorinha Gravações';

function getDate() {
    return (new Date(Date.now())).toString();
}

app.set('view engine', 'hbs');
app.set('views', viewsDirectoryPath);
hbs.registerPartials(partialsDirectoryPath);

app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Bienvenido',
        name: author,
        date: getDate()
    });
});

app.get('/about', (req, res) => {
    const profilePic = '/img/killian-ken.png';
    const imgTitle = 'Cillian Murphy Ken';
    const imgAlt = 'Cillian Murphy Ken';

    res.render('about', {
        title: 'Sobre mim...',
        name: author,
        date: getDate(),

        profilePic,
        imgTitle,
        imgAlt
    });
});

app.get('/help', (req, res) => {
    const message = 'Desculpe, não oferecemos ajuda. Acredito que alguém da sua idade já pode se virar só.';
    const imgSrc = '/img/noppers.webp';
    const imgTitle = 'NOPERS';
    const imgAlt = 'NOPERS';

    res.render('help', {
        title: '¡Ayuda!',
        name: author,
        date: getDate(),

        message,
        imgSrc,
        imgTitle,
        imgAlt
    });
});

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if(!address) {
        return res.send({
            error: 'Preencha o campo de endereço para buscar informações.'
        });
    }

    geocode(address, undefined, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({
                error
            });
        }

        forecast(latitude, longitude, undefined, (error, { temperature, weather, daytime } = {}) => {
            if(error) {
                return res.send({
                    error
                });
            }

            res.send({
                temperature,
                weather,
                daytime,
                location,
                address
            });
        });
    });
});

app.get('/help/*', (req, res) => {
    res.render('notfound', {
        title: 'Not found',
        name: author,
        date: getDate(),
        classes: 'notfound',

        message: '🍂 Artigo de ajuda não encontrado. 🍂',
        goBack: '/help'
    });
});

app.get('*', (req, res) => {
    res.render('notfound', {
        title: 'Not found',
        name: author,
        date: getDate(),
        classes: 'notfound',

        message: 'Essa página não existe 💩🕵️',
        goBack: '/'
    });
});

app.listen(3000, () => {
    console.log('Server is up and running.')
});