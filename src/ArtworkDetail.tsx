import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link,  useParams } from 'react-router-dom';
import React from 'react';
import './ArtworkDetail.css'
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa';

interface Artwork {
    id: number;
    image_id: string;
    title: string;
    date_display: string;
    artist_title: string;
    place_of_origin: string;
    dimensions: string;
    medium_display: string;
    main_reference_number: string;
}

const api = axios.create({ baseURL: 'https://api.artic.edu/api/v1/' });
export default function ArtworkDetail () {
    const {id} = useParams<{id: string}>();
    const {next} = useParams<{next: string}>();
    const [state_id, setStateId] = useState<number>(Number(id));
    const [artwork, setArtwork] = useState<Artwork>();

    useEffect(() => {
        let currentId = Number(id);
        const fetchArtwork = (id : number) => {
            api.get(`artworks/${id}`)
                .then((response) => {
                    if (response.data) {
                        const artworkData = response.data.data;
                        const tempObject = {
                            id: artworkData.id,
                            image_id: `https://www.artic.edu/iiif/2/${artworkData.image_id}/full/843,/0/default.jpg`,
                            title: artworkData.title,
                            date_display: artworkData.date_display,
                            artist_title: artworkData.artist_title,
                            place_of_origin: artworkData.place_of_origin,
                            dimensions: artworkData.dimensions,
                            medium_display: artworkData.medium_display,
                            main_reference_number: artworkData.main_reference_number,
                        }
                        console.log(tempObject);
                        setArtwork(tempObject);
                        setStateId(artworkData.id);
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        // If a 404 error occurs, try fetching the next artwork
                        console.log("looking next artwork");
                        const nextArtworkId = Number(next) ? id + 1 : id - 1;
                        fetchArtwork(nextArtworkId);
                    }
                })
        }
        fetchArtwork(currentId);
    }, [id, next]);

    const previousArtworkId = state_id - 1;
    const nextArtworkId = state_id + 1;

    return (
        <div> 
            {artwork && (
                <div className='detail-view'>
                    <div className='image-container'>
                        <img src={artwork.image_id} alt={artwork.title} width='400'/>
                    </div>
                    <div className='detail-view-text'>
                        <p className='detail-title'> {artwork.title}</p>
                        {artwork.artist_title ? (<p className='detail-subtitle'> {artwork.artist_title}, {artwork.date_display} </p>) : (<p className='detail-subtitle'> {artwork.date_display} </p>)}
                        <div className='subtext'> 
                            <p><span className="non-variable-text">Origin:</span> {artwork.place_of_origin}</p>
                            <p><span className="non-variable-text">Dimensions:</span> {artwork.dimensions}</p>
                            <p><span className="non-variable-text">Medium:</span> {artwork.medium_display}</p>
                            <p><span className="non-variable-text">Reference Number:</span> {artwork.main_reference_number}</p>
                        </div>
                        <div className='button-container'>
                            <Link to={`/artwork/${previousArtworkId}/0`} className="next-prev-link"> <FaArrowLeft/> </Link>
                            <Link to={`/artwork/${nextArtworkId}/1`} className="next-prev-link"> <FaArrowRight/> </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}   