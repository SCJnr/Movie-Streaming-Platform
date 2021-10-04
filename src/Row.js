import {useState,useEffect} from 'react';
import axios from './axios';
import './row.css';
import Youtube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url="https://image.tmdb.org/t/p/original/";

function Row({title, fetchUrl,islargerow}) {

    const [movies,setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");
    useEffect(()=>
    {
        async function fetchData()
        {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
           
            return request;
        }
        fetchData();
    },[fetchUrl]);

    const handleClick = (movie) =>{
        if(trailerUrl)
        {
            setTrailerUrl("");
        }
        else{
            movieTrailer(movie?.title || movie?.name || movie?.original_name || "").then((url)=>
            {
                const urlParams =new URLSearchParams( new URL(url).search);
                console.log(urlParams);
                setTrailerUrl(urlParams.get("v"));
            }).catch((error) => console.log(error));
        }
    }


    const opts = {
        height: '380px',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };
    return (
        <div className="row">
            <h2 className="row_title">{title}</h2>
            <div className="row__posters">
            {movies.map(movie => (
                <img 
                key={movie.id} 
                onClick={() => handleClick(movie)}
                className={`row__poster ${islargerow && "row__posterlarge"}`} 
                src={`${base_url}${islargerow ? movie.poster_path : movie.backdrop_path}`} 
                alt={movie.name}
                />
                ))}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts}/>}
        </div>
        
    )
}

export default Row