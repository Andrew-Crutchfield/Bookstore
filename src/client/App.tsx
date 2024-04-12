import React, { useState, useEffect } from 'react';
import { GET } from './services/fetcher';

interface AppProps {}

const App: React.FC<AppProps> = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        GET('/api/books').then(setData);
    }, []);

    return (
        <div className="mx-auto mt-5 w-25">
            <div className="alert alert-info text-center">
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
};

export default App;
