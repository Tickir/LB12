import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { router as movieRouter } from './movie/index.js';
import { engine } from 'express-handlebars';
import auth from './auth.js';
import { ensureLoggedIn } from 'connect-ensure-login';

const app = express();

// 🔥 ДЛЯ RENDER — ОБОВ’ЯЗКОВО
const PORT = process.env.PORT || 8080;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', [`${__dirname}/movie/views`]);

app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: false }));

auth(app);

app.use('/movie', ensureLoggedIn('/login.html'), movieRouter);

app.get('/', (req, res) => res.redirect('/movie'));

app.listen(PORT, () => {
    console.log(`Сервер слухає порт ${PORT}`);
});
