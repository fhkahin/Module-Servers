import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('http://localhost:3001/quotes/random');
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data = await response.json();
      setQuote(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quote:', error.message);
      setLoading(false);
    }
  };

  const handleFetchNewQuote = async () => {
    setLoading(true);
    await fetchRandomQuote();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Random Quote</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          quote && (
            <div>
              <p>{quote.content}</p>
              <p>- {quote.author}</p>
              <button onClick={handleFetchNewQuote} className="new-quote-button">
                Get New Quote
              </button>
            </div>
          )
        )}
      </header>
    </div>
  );
}

export default App;