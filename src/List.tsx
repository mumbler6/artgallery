import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {IoIosOptions} from 'react-icons/io';
import {AiOutlineArrowUp, AiOutlineArrowDown} from 'react-icons/ai';
import React from 'react';
import './List.css'
import { Link } from 'react-router-dom';

interface Artwork {
    id: number;
    image_id: string;
    title: string;
    date_start: string;
    artist_title: string;
    boost_rank: number;
}

const api = axios.create({ baseURL: 'https://api.artic.edu/api/v1/' });
export default function List () {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [sortTitle, setTitleFilter] = useState(false);
    const [sortDate, setDateFilter] = useState(false);
    const [sortRelevance, setRelevanceFilter] = useState(true);
    const [sortAscending, setAscedingFilter] = useState(true);
    const [sortDescending, setDescendingFilter] = useState(false);
    const [artworks, setArtworks] = useState<Artwork[]>();
    const [listContainerActive, setListContainerActive] = useState(false);

    const toggleFilter = () => {
      setFilterOpen(!isFilterOpen);
    };

    const toggleTitle = () => {
        setTitleFilter(!sortTitle);
        setDateFilter(false);
        setRelevanceFilter(false);
    }

    const toggleDate = () => {
        setDateFilter(!sortDate);
        setTitleFilter(false);
        setRelevanceFilter(false);
    }

    const toggleRelevance = () => {
        setRelevanceFilter(!sortRelevance);
        setTitleFilter(false);
        setDateFilter(false);
    }
    
    const toggleAscending = () => {
        setAscedingFilter(!sortAscending);
        setDescendingFilter(false);
    }
    
    const toggleDescending = () => {
        setDescendingFilter(!sortDescending);
        setAscedingFilter(false);
    }
    
    const getAPIURL = useCallback(() => {
        let additional_fields = "&query[exists][field]=title&query[exists][field]=date_start";
        return `artworks/search?fields=id,image_id,title,date_start,artist_title,boost_rank&q=${searchTerm}&size=100` + additional_fields;
    }, [searchTerm])

    const compareArtworks = useCallback((artwork1 : Artwork, artwork2 : Artwork) => {
        if (sortRelevance) {
            if (!artwork1.boost_rank && !artwork2.boost_rank) {
                return 0;
            } else if (!artwork1.boost_rank && artwork2.boost_rank) {
                return 1;
            } else if (artwork1.boost_rank && !artwork2.boost_rank) {
                return -1;
            } else if (artwork1.boost_rank < artwork2.boost_rank) {
                return -1;
            } else {
                return 1;
            }
        } else if (sortTitle) {
            if (artwork1.title < artwork2.title) {
                return -1;
            } else if (artwork1.title > artwork2.title) {
                return 1;
            }
            return 0;
        } else if (sortDate) {
            if (artwork1.date_start < artwork2.date_start) {
                return -1;
            } else if (artwork1.date_start > artwork2.date_start) {
                return 1;
            }
            return 0;
        }
        return 0;
    }, [sortDate, sortTitle, sortRelevance])

    useEffect(() => {
        let url = getAPIURL();
        api.get(url)
            .then((response) => {
                if (response.data) {
                    const results = response.data.data
                    .filter((artwork: Artwork) => artwork.image_id && artwork.title && artwork.date_start && artwork.artist_title)
                    .map((artwork: Artwork) => ({
                        id: artwork.id,
                        image_id: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
                        title: artwork.title,
                        date_start: artwork.date_start,
                        artist_title: artwork.artist_title,
                        boost_rank: artwork.boost_rank,
                    }));
                    results.sort(compareArtworks);
                    if (sortDescending) results.reverse();
                    setArtworks(results);
                    setListContainerActive(true);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }, [searchTerm, sortTitle, sortDate, sortAscending, sortDescending, compareArtworks, getAPIURL]);


    return (
        <div> 
            <div className="search-bar-container">
                <input type="text" placeholder="Search for artworks" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/> 
                <button onClick={toggleFilter} className="filter-button">
                    <IoIosOptions/>
                </button>
                {isFilterOpen && (
                    <div className="filter-options">
                        <button onClick={toggleRelevance} className={`sort-button ${sortRelevance ? 'selected' : ''}`}>Relevance</button>
                        <button onClick={toggleTitle} className={`sort-button ${sortTitle ? 'selected' : ''}`}>Title</button>
                        <button onClick={toggleDate} className={`sort-button ${sortDate ? 'selected' : ''}`}>Date</button>
                        <button onClick={toggleAscending} className={`sort-direction-button ${sortAscending ? 'selected' : ''}`}> <AiOutlineArrowUp/> </button>
                        <button onClick={toggleDescending} className={`sort-direction-button ${sortDescending ? 'selected' : ''}`}> <AiOutlineArrowDown/></button>
                    </div>
                )}
            </div>
            <div className='parent'>
                <div className={`list-container ${listContainerActive ? 'active' : ''}`}> 
                        {
                            artworks ? artworks.map((artwork : Artwork) => {
                                return (
                                    <Link to={`/artwork/${artwork.id}/1`} className="list-box-link">
                                        <div className="list-box"> 
                                            <img src={artwork.image_id} width="100" height="100" alt={artwork.title}/>
                                            <p id="title"> {artwork.title} </p>
                                            <p id="artist"> {artwork.artist_title} </p>
                                            <p id="date"> {artwork.date_start} </p>
                                        </div>
                                    </Link>
                                )
                            }) : <div> </div>
                        }
                </div>
            </div> 
        </div>
    );
}   