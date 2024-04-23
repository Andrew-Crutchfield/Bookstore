import { Book, Category } from '../types'; // Adjust the path as needed to correctly point to your types/index.ts file

type ValidMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function fetcher<T>(url: string, method: ValidMethods = 'GET', rawData?: any): Promise<T> {
  const headers: HeadersInit = {};
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`; 
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (method === 'POST' || method === 'PUT') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(rawData);
  }

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not in JSON format');
    }

    return await res.json() as T;
  } catch (error) {
    throw error;
  }
}

export const GET = async <T>(url: string): Promise<T> => {
  return fetcher<T>(url);
};

export const DELETE = async <T>(url: string): Promise<T> => {
  return fetcher<T>(url, 'DELETE');
};

export const POST = async <T>(url: string, data: any): Promise<T> => {
  return fetcher<T>(url, 'POST', data);
};

export const PUT = async <T>(url: string, data: any): Promise<T> => {
  return fetcher<T>(url, 'PUT', data);
};

export const fetchData = async () => {
  try {
    const booksData = await GET<Book[]>('/data/books.json');
    console.log('Books data:', booksData);

    const categoriesData = await GET<Category[]>('/data/categories.json');
    console.log('Categories data:', categoriesData);

    return { booksData, categoriesData };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};