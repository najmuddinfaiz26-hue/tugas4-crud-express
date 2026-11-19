const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Koneksi ke database MySQL Laragon
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Isi jika MySQL Anda memakai password
  database: 'db_tugas4'
});

db.connect((err) => {
  if (err) {
    console.error('Gagal koneksi ke MySQL:', err.message);
    return;
  }
  console.log('Berhasil terhubung ke database MySQL (db_tugas4)!');
});

// 1. READ: Menampilkan semua data & form edit
app.get('/', (req, res) => {
  const editId = req.query.editId;
  db.query('SELECT * FROM mahasiswa ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).send(err.message);

    const editData = editId ? results.find(row => row.id == editId) : null;
    res.render('index', { data: results, editData });
  });
});

// 2. CREATE: Menambah data baru
app.post('/tambah', (req, res) => {
  const { nim, nama, jurusan } = req.body;
  const sql = 'INSERT INTO mahasiswa (nim, nama, jurusan) VALUES (?, ?, ?)';
  db.query(sql, [nim, nama, jurusan], (err) => {
    if (err) return res.status(500).send(err.message);
    res.redirect('/');
  });
});

// 3. UPDATE: Mengubah data
app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nim, nama, jurusan } = req.body;
  const sql = 'UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ? WHERE id = ?';
  db.query(sql, [nim, nama, jurusan, id], (err) => {
    if (err) return res.status(500).send(err.message);
    res.redirect('/');
  });
});

// 4. DELETE: Menghapus data
app.post('/hapus/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM mahasiswa WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err.message);
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});