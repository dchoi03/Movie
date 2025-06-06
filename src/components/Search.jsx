import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
      <div>
        <img src='search.svg' alt='Search Icon'/>
        <input type='text' 
          typeof='text'
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder='Search through 1000+ movies, series, and documentaries' 
        />
      </div>
    </div>
  )
}

export default Search