const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Veritabanı Bağlantısı
const db = new sqlite3.Database('./flashcards.db', (err) => {
    if (err) {
        console.error('SQLite bağlantı hatası:', err.message);
    } else {
        console.log('SQLite bağlantısı başarılı!');
        // Kartlar Tablosunu Oluştur
        db.run(`
            CREATE TABLE IF NOT EXISTS cards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                course TEXT NOT NULL,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                tags TEXT
            )
        `);
    }
});

// Tüm Kartları Listele
app.get('/cards', (req, res) => {
    const sql = 'SELECT * FROM cards';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Yeni Kart Ekle
app.post('/cards', (req, res) => {
    const { course, question, answer, difficulty, tags } = req.body;
    const sql = 'INSERT INTO cards (course, question, answer, difficulty, tags) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [course, question, answer, difficulty, tags], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, ...req.body });
        }
    });
});

// Soruyu güncelleme
app.put('/cards/:id', (req, res) => {
    const { id } = req.params;
    const { course, question, answer, difficulty, tags } = req.body;

    // Eksik alan kontrolü
    if (!course || !question || !answer) {
        res.status(400).json({ error: 'Eksik alanlar mevcut. Tüm alanları doldurun!' });
        return;
    }

    db.run(
        `UPDATE cards SET course = ?, question = ?, answer = ?, difficulty = ?, tags = ? WHERE id = ?`,
        [course, question, answer, difficulty, tags, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Kart başarıyla güncellendi!' });
        }
    );
});


// Kart Sil
app.delete('/cards/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM cards WHERE id = ?';
    db.run(sql, id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Kart bulunamadı' });
        } else {
            res.status(204).send();
        }
    });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`API http://localhost:${PORT} adresinde çalışıyor`);
});
