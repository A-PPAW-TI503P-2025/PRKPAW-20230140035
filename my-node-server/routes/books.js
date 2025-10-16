const express = require('express');
const router = express.Router();

let books = [
  { id: 1, title: 'Laut Bercerita', author: 'Leila S. Chudori' },
  { id: 2, title: 'Aroma Karsa', author: 'Dee Lestari' }
];

// GET semua buku
router.get('/', (req, res) => {
  res.json(books);
});

// GET buku by ID
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// POST tambah buku baru
router.post('/', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  const book = {
    id: books.length + 1,
    title,
    author
  };

  books.push(book);
  res.status(201).json(book);
});

// ✅ PUT update buku by ID
router.put('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  book.title = title;
  book.author = author;

  res.json({ message: 'Book updated successfully', book });
});

// ✅ DELETE hapus buku by ID
router.delete('/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const deletedBook = books[index]; // simpan data sebelum dihapus
  books.splice(index, 1); // hapus data dari array

  res.json({
    message: 'Buku berhasil dihapus',
    deleted: deletedBook
  });
});

module.exports = router;
