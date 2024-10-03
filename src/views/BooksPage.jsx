import Book from '../components/Book.jsx';
import Header from '../components/Header.jsx';
import { useSelector } from 'react-redux';

import { db } from '../firebase/config.js'
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';
import {selectUsers} from '../store/usersSlice.js';

function BooksPage() {

  const uid = useSelector(selectUsers).currentUser.id
  console.log(uid)
  const [books, setBooks] = useState([])

  const pageTitle = "📖 Lista de Livros Etec AE";
  
  useEffect(()=>{
      const fetchBooks = async ()=>{
        //const q = query(collection(db, "livros"));
        const q = query(collection(db, "livros"), where("user_id", "==", uid));

        const querySnapshot = await getDocs(q);
        let bookList = [];
        querySnapshot.forEach((doc) => {
            bookList.push({id: doc.id, ...doc.data()})
            console.log(bookList);
            //console.log(doc.id);
          });
        setBooks(bookList)  
      }
      
      fetchBooks();  
  }, []);

    
    return (
      <>
        <div className="container">
            <Header pageTitle={pageTitle} />
            <div className="books-container">
                <div className="books-list">
                    
                    {books.map(book => 
                    
                    <Book key={book.id} book={book}  />
                    
                    )}

                </div>
            </div>
        </div>
      </>
    )
  }
  
  export default BooksPage
  