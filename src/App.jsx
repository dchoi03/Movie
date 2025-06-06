import React from 'react'
import Search from './components/Search'
import {useState, useEffect} from 'react'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NzQyYmMxY2Y4ZWRjNWQwNDc1ODlmYTlkZTNlZGU4NSIsIm5iZiI6MTc0OTE3NDM0Mi41MjQ5OTk5LCJzdWIiOiI2ODQyNDg0NjAxYjI5MzFmM2RmMmM5ZjMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vk_6wSr1p9T2ldIqWehIzLB9ZA6hAgs-JsUoMVN9CDE'
  }
};


const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.Response === 'False') {
        setErrorMessage(data.Error);
        return;
      }

      setMovieList(data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    } 
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src="./hero-img.png" alt="Hero Banner"/>
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
      <section className="all-movies">
        <h2 className="mt-[20px]">All Movies</h2>
        {isLoading ? (
          <Spinner/>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <ul>
           {movieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
           ))}
          </ul>
        )}
      </section>
      </div>
    </main>
  )
}

export default App