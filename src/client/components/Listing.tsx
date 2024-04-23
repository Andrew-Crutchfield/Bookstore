import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Book {
  id: number;
  title: string;
  author: string;
  price?: number;
  categoryid: number;
}

interface Category {
  id: number;
  name: string;
}

const BookListing: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Omit<Book, 'id'> | null>(null);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [isAddingNewBook, setIsAddingNewBook] = useState(false);

  useEffect(() => {
    const fetchBooksAndCategories = async () => {
      setLoading(true);
      try {
        const booksResponse = await fetch('/data/books.json');
        const booksData = await booksResponse.json();

        const categoriesResponse = await fetch('/data/categories.json');
        const categoriesData = await categoriesResponse.json();

        setBooks(booksData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching books and categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndCategories();
  }, []);

  const handleEdit = (book: Book) => {
    setEditingBookId(book.id);
    setEditingBook({ title: book.title, author: book.author, price: book.price, categoryid: book.categoryid });
    setIsAddingNewBook(false);
  };

  const handleAddNewBook = () => {
    setEditingBookId(null);
    setEditingBook({ title: '', author: '', price: 0, categoryid: categories[0]?.id || 0 });
    setIsAddingNewBook(true);
  };

  const handleSave = () => {
    if (isAddingNewBook && editingBook) {
      const newBook = { ...editingBook, id: Math.max(0, ...books.map(book => book.id)) + 1 };
      setBooks([...books, newBook]);
    } else if (editingBookId && editingBook) {
      const updatedBooks = books.map(book =>
        book.id === editingBookId ? { ...book, ...editingBook } : book
      );
      setBooks(updatedBooks);
    }

    setEditingBook(null);
    setEditingBookId(null);
    setIsAddingNewBook(false);
  };

  const handleDelete = (id: number) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if(editingBook) {
      setEditingBook({ ...editingBook, [name]: value });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Book Listing</h1>
      <Link to="/bookdetails">Go to Book Details</Link>
      <button onClick={handleAddNewBook}>Add Book</button>
      {(isAddingNewBook || editingBookId) && editingBook && (
        <div>
          <h2>{isAddingNewBook ? 'Add New Book' : 'Edit Book'}</h2>
          <input type="text" name="title" value={editingBook.title} onChange={handleChange} placeholder="Title" required />
          <input type="text" name="author" value={editingBook.author} onChange={handleChange} placeholder="Author" required />
          <input type="number" name="price" value={editingBook.price?.toString()} onChange={handleChange} placeholder="Price" required />
          <select name="categoryid" value={editingBook.categoryid.toString()} onChange={handleChange}>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button onClick={handleSave}>{isAddingNewBook ? 'Add' : 'Save'}</button>
        </div>
      )}

      <div>
        {books.map(book => (
          <div key={book.id}>
            <h2>{book.title} by {book.author}</h2>
            <p>Price: ${book.price}</p>
            <p>Category: {categories.find(c => c.id === book.categoryid)?.name || 'Unknown Category'}</p>
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookListing;