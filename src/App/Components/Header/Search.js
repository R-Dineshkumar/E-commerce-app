/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
// src/components/AutocompleteOnlineSearch.js
import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
import {
  TextField, Box, Typography, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import { searchUrl } from '../../Environment/URL';

function Search() {
  const [open, setOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const ref = useRef();

  const navigateSearch = (e) => {
    const { type, key } = e;
    if (inputValue !== '' && (type === 'click' || (type === 'keydown' && key === 'Enter'))) {
      e.target.blur();
      setOpen(false);
      navigate(`/search?value=${inputValue}`);
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', checkIfClickedOutside);
    return () => {
      document.removeEventListener('click', checkIfClickedOutside);
    };
  }, [navigateSearch]);

  const handleChange = (e) => {
    setOpen(true);
    const { value } = e.target;
    setInputValue(value);
    if (value === '') {
      setSuggestions([]);
    } else {
      const getSuggestion = setTimeout(async () => {
        const options = {
          method: 'GET',
        };
        try {
          const response = await fetch(`${searchUrl}${value}`, options);
          if (response.ok) {
            const responseJson = await response.json();
            const { searchResults } = responseJson;
            searchResults ? setSuggestions(searchResults) : setSuggestions([]);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      }, 500);
      return () => clearTimeout(getSuggestion);
    }
  };

  return (
    <Box width="100%" position="relative" ref={ref}>
      <TextField
        placeholder="search for products"
        variant="outlined"
        size="small"
        fullWidth
        value={inputValue}
        onChange={handleChange}
        onKeyDown={navigateSearch}
        InputProps={{ endAdornment: (<InputAdornment position="end"><SearchIcon sx={{ cursor: 'pointer' }} onClick={navigateSearch} /></InputAdornment>) }}
        sx={{
          background: 'whitesmoke', color: 'white', position: 'relative',
        }}
      />
      {open && suggestions.length > 0 && (
      <Box
        alignItems="center"
        sx={{
          width: '100%',
          background: 'white',
          color: 'black',
          border: '1px solid black',
          position: 'absolute',
          zIndex: '9999',
        }}
      >
        {suggestions.map((suggestion) => (
          <Link to={`/product?id=${suggestion.productItemId}`} className="search-link" key={suggestion.productItemId} onClick={() => setOpen(false)}>
            <Typography variant="body2" sx={{ padding: '.5rem' }}>
              {suggestion.productItemName}
            </Typography>
          </Link>
        ))}
      </Box>
      )}
    </Box>
  );
}

export default Search;
