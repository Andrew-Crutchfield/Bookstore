import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GET, POST, PUT, DELETE } from '../services/fetcher';

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
  const [newBook, setNewBook] = useState({ title: '', author: '', price: '', categoryid: '' });
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      console.log('Fetching books...');
      const response = await GET<{ books: Book[] }>('/api/books');
      console.log('Books fetched:', response.books);
      setBooks(response.books);
      const categoriesResponse = await GET<{ categories: Category[] }>('/api/categories');
      console.log('Categories fetched:', categoriesResponse.categories);
      setCategories(categoriesResponse.categories);
    } catch (error) {
      console.error('Error fetching books', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    try {
      console.log('Adding book:', newBook);
      const bookData = {
        title: newBook.title,
        author: newBook.author,
        price: newBook.price ? parseFloat(newBook.price) : undefined,
        categoryid: parseInt(newBook.categoryid),
      };
      console.log('Sending add book request with data:', bookData);
      await POST<Book>('/api/books', bookData);
      console.log('Book added successfully.');
      setNewBook({ title: '', author: '', price: '', categoryid: '' });
      await fetchBooks();
    } catch (error) {
      console.error('Error adding book', error);
    }
  };

  const handleEditBook = async () => {
    if (editingBook) {
      try {
        console.log('Editing book:', editingBook);
        const editedBookData = {
          title: newBook.title,
          author: newBook.author,
          price: newBook.price ? parseFloat(newBook.price) : undefined,
          categoryid: parseInt(newBook.categoryid),
        };
        console.log('Sending edit book request with data:', editedBookData);
        const response = await PUT<Book>(`/api/books/${editingBook.id}`, editedBookData);
        console.log('Edit book response:', response);
        console.log('Book edited successfully.');
        setEditingBook(null);
        setNewBook({ title: '', author: '', price: '', categoryid: '' });
        await fetchBooks();
      } catch (error) {
        console.error('Error editing book', error);
      }
    }
  };

  const handleStartEditing = (book: Book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      price: book.price ? String(book.price) : '',
      categoryid: String(book.categoryid),
    });
  };

  const handleCancelEditing = () => {
    setEditingBook(null);
    setNewBook({ title: '', author: '', price: '', categoryid: '' });
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await DELETE(`/api/books/${id}`);
      await fetchBooks();
    } catch (error) {
      console.error('Error deleting book', error);
    }
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <div>
      <h1>Book Listing</h1>
      <Link to="/bookdetails">Go to Book Details</Link>

      <h2>{editingBook ? 'Edit Book' : 'Add a New Book'}</h2>
      <input
        type="text"
        placeholder="Title"
        value={newBook.title}
        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Author"
        value={newBook.author}
        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newBook.price}
        onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
      />
      <select
        value={newBook.categoryid}
        onChange={(e) => setNewBook({ ...newBook, categoryid: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {editingBook ? (
        <>
          <button onClick={handleEditBook}>Save Edit</button>
          <button onClick={handleCancelEditing}>Cancel Edit</button>
        </>
      ) : (
        <button onClick={handleAddBook}>Add Book</button>
      )}

      <h2>Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <div>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Price: ${book.price}</p>
              <p>Category: {getCategoryName(book.categoryid)}</p>
            </div>
            <div>
              <button onClick={() => handleStartEditing(book)}>Edit</button>
              <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookListing;

