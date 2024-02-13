import './App.css';
import { db, auth, storage } from "./config/firebase-config";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';

import SigninPage from './components/SigninPage';


function App() {

  const [movieList, setMovieList] = useState([]);
  const movieTitleRef = useRef();
  const movieReleaseDateRef = useRef();
  const movieIsGoodRef = useRef();
  const [newMovieTitle, setNewMovieTitle] = useState([""]);
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const querySnapshot = await getDocs(moviesCollectionRef);

      const moviesFirstDoc = querySnapshot?.docs[0]?.data();
      const moviesAllDocs = querySnapshot.docs.map(doc => doc.data());
      const moviesAllDocsWithIds = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))

      // console.log(moviesFirstDoc);
      // console.log(moviesAllDocs);
      // console.log(moviesAllDocsWithIds);

      setMovieList(moviesAllDocsWithIds);

    } catch (err) {
      console.error(err);
    }

  };


  useEffect(() => {
    getMovieList();
  }, []);


  const submitMovie = async () => {

    const movieTitle = movieTitleRef.current.value;
    const movieReleaseDate = movieReleaseDateRef.current.value;
    const movieIsGood = movieIsGoodRef.current.checked;

    console.log(movieTitle, movieReleaseDate, movieIsGood);

    const newMovie = {
      title: movieTitle,
      releaseDate: movieReleaseDate,
      isGood: movieIsGood,
      uid: auth?.currentUser?.uid,
      userEmail: auth?.currentUser?.email
    }

    try {
      await addDoc(moviesCollectionRef, newMovie);
      getMovieList();

    } catch (err) {
      console.error(err);
    }
  }

  const deleteMovie = async(movieId) => {

    try {

      const movieDoc = doc(db, "movies", movieId);
      console.log(movieDoc);
      await deleteDoc(movieDoc);
      console.log(`document with id: ${movieId} from collection "movies" is deleted`);
      getMovieList();
  
    } catch(err) {
      console.error(err);
    }

  }

  const updateMovie = async(movieId, newMovieTitle) => {

    try {
      const movieDoc = doc(db, "movies", movieId);
      await updateDoc(movieDoc, {title: newMovieTitle});
      getMovieList();

    } catch(err) {
      console.error(err);
    }


  }

  const uploadFileFunction = async () => {
    if (!fileUpload) return;
    const fileFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);

    try {
      await uploadBytes(fileFolderRef, fileUpload);
      console.log(`file: ${fileUpload.name} is uploaded to folder projectFiles/`);
    } catch(err) {
      console.error(err);
    }

  }

  return (
    <>
      <div className='app'>
        <SigninPage />
        <hr />
      </div>

      <div>
        <input type="text" ref={movieTitleRef} placeholder='movie title..' />
        <input type="number" ref={movieReleaseDateRef} placeholder='release date...' />
        <input type="checkbox" ref={movieIsGoodRef} />
        <label>is Good?</label>
        <button onClick={submitMovie}>Submit Movie</button>
        <hr />
      </div>

      <div>
        {movieList.map(movie =>
          <div key={movie.id}>
            <h2 style={{color: movie.isGood ? 'green' : 'red'}}>{movie.title}</h2>
            <p>{movie.releaseDate}</p> 
            <p style={{color: 'green'}}>{`submitted by: ${movie.userEmail}`}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete</button>
            <p>
              <input type="text" placeholder='New Movie Title...' onChange={(e) => setNewMovieTitle(e.target.value)} />
              <button onClick={() => {console.log(newMovieTitle); updateMovie(movie.id, newMovieTitle) }}>Update Movie Title</button>
            </p>
            <hr />
          </div>)}
      </div>

      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFileFunction}> upload file </button>
      </div>
    </>

  )
}

export default App
