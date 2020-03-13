import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'

function App() {
  //holding posts in component state
  const [posts, setPosts] = useState([])

  //initial render of posts
  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => {
        setPosts(res.data)
      })
  }, [])

  return (
    <div className="App">
      {posts.map(post => {
        return <div key={post.id}>
          <h2>{post.title}</h2>
          <h6>{post.contents}</h6>
        </div>
      })}
    </div>
  );
}

export default App;
