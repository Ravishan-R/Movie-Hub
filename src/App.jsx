import { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use'


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState ('');
  const [movies, setMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTIONS = {
    method:'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  }

  const fetchMovies = async(query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if(data.Response === false){
        setErrorMessage(data.Error || 'Fail to fetch movies');
        setMovies([]);
        return;
      }
      setMovies(data.results || []);
    } catch (err) {
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() =>{
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);
  

  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src="hero.png" alt="Hero Banner" />
          <h1>Find<span className='text-gradient'> You'll Enjoy Without the Hassle</span></h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        <section className='all_movies'>
        <h2>All Movies</h2>
        {isloading ?(
            <Spinner/>
          ) : errorMessage? (
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )
          }
        </section>
      </div>
    </main>
  )
}

export default App
