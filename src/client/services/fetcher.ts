import Swal from 'sweetalert2';

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
    const apiUrl = process.env.SERVER_URL || 'http://localhost:3000';
    console.debug(apiUrl+url);
    console.debug(options);
    const res = await fetch(apiUrl + url, options);

    if (!res.ok) {
      const errorData = await res.json();

      console.error(`Request to ${url} failed with status ${res.status}`);
      console.error(errorData);

      Swal.fire({
        title: 'Server error :(',
        icon: 'error',
        text: errorData.message || 'Unknown error',
        timer: 6000,
      });

      throw new Error(errorData.message || 'Request failed');
    }

    return res.json() as Promise<T>;
  } catch (error) {
    const err = error as Error;
    console.error(`Network error during request to ${url}`);
    console.error(err);

    Swal.fire({
      title: 'Networking error :(',
      icon: 'error',
      text: err.message || 'Unknown error',
      timer: 6000,
    });

    throw err;
  }
}

export const GET = <T>(url: string) => fetcher<T>(url);
export const DELETE = <T>(url: string) => fetcher<T>(url, 'DELETE');
export const POST = <T>(url: string, data: any) => fetcher<T>(url, 'POST', data);
export const PUT = <T>(url: string, data: any) => fetcher<T>(url, 'PUT', data);