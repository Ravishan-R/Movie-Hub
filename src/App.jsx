import { useEffect, useState } from 'react'
import Search from './components/Search'


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState ('');
  const [movies, setMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTIONS = {
    method:'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  }

  const fetchMovies = async() => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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
    fetchMovies();
  },[]);
  

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
            <p className='text-white'>Loading...</p>
          ) : errorMessage? (
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>
              {movies.map((movie) => (
                <p key={movie.id} className='text-white'>{movie.title}</p>
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
