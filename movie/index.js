import express from 'express';
import sqlite3 from 'sqlite3';

const router = express.Router();
const db = new sqlite3.Database('movie.db');

// Список фільмів
router.get('/', (req, res) => {
    db.all('SELECT * FROM Movies', (err, rows) => {
        if (err) return res.send('Помилка бази даних');
        res.render('list', { movies: rows, title: 'Фільмотека' });
    });
});

// Форма додавання
router.get('/form', (req, res) => {
    res.render('form', { title: 'Новий фільм', movie: {} });
});

// Збереження нового або редагованого фільму
router.post('/save', (req, res) => {
    const { id, title, year, rating } = req.body;

    if (id) {
        db.run(
            'UPDATE Movies SET title=?, year=?, rating=? WHERE id=?',
            [title, year, rating, id],
            () => res.redirect('/movie')
        );
    } else {
        db.run(
            'INSERT INTO Movies (title, year, rating) VALUES (?, ?, ?)',
            [title, year, rating],
            () => res.redirect('/movie')
        );
    }
});

// Редагування
router.get('/edit/:id', (req, res) => {
    db.get('SELECT * FROM Movies WHERE id=?', [req.params.id], (err, row) => {
        if (err) return res.send('Помилка бази даних');
        res.render('form', { title: 'Редагування', movie: row });
    });
});

// Видалення
router.get('/delete/:id', (req, res) => {
    db.run('DELETE FROM Movies WHERE id=?', [req.params.id], () => {
        res.redirect('/movie');
    });
});

export { router };
