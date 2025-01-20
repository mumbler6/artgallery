import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Gallery.css'

interface Artwork {
    id: number;
    image_id: string;
    title: string;
    date_display: string;
    artist_title: string;
}

const api = axios.create({ baseURL: 'https://api.artic.edu/api/v1/' });
class Gallery extends Component<{}, {artworks: Artwork[], filter:number, galleryActive:boolean}> {
    constructor(props: any) {
        super(props);
        this.state = {
            artworks: [] as Artwork[],
            filter: 0,
            galleryActive: false
        };
    }

    cachedResults: { [key: string]: Artwork[] } = {};

    filterOptions: { [key: number]: string } = {
        0: 'artworks?fields=id,title,image_id,date_display,artist_title&limit=32',
        1: 'artworks/search?fields=id,image_id,title,date_display,artist_title&query[term][artwork_type_id]=1&size=32',
        2: 'artworks/search?fields=id,image_id,title,date_display,artist_title&query[term][artwork_type_id]=2&size=32',
        3: 'artworks/search?fields=id,image_id,title,date_display,artist_title&query[term][artwork_type_id]=3&size=25',
        36: 'artworks/search?fields=id,image_id,title,date_display,artist_title&query[term][artwork_type_id]=36&size=31',
        37: 'artworks/search?fields=id,image_id,title,date_display,artist_title&query[term][artwork_type_id]=37&size=30',
      };

      async getResults() {
        for (const key in this.filterOptions) {
          const endpoint = this.filterOptions[key];
      
          try {
            let response = await api.get(endpoint);
            let results = null;
            if (response.data) {
              results = response.data.data
                .filter((artwork: Artwork) => artwork.image_id)
                .map((artwork: Artwork) => ({
                  id: artwork.id,
                  image_id: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
                  title: artwork.title,
                  date_display: artwork.date_display,
                  artist_title: artwork.artist_title,
                }));
            }
            this.cachedResults[endpoint] = results;
            this.updateGallery();
          } catch (error) {
            console.error('Error fetching data for endpoint', endpoint, ':', error);
          }
        }
        
      }

      async updateGallery() {
        const endpoint = this.filterOptions[this.state.filter];
        this.setState({ artworks: this.cachedResults[endpoint] });
        this.setState({galleryActive:true});
      }

    componentDidMount() {
      this.getResults();
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{ artworks: Artwork[]; filter: number; galleryActive: boolean}>, snapshot?: any): void {
        if (this.state.filter !== prevState.filter) {
            this.updateGallery();
        }
    }

    render() {
        return (
            <div>
                <div className="filter-tags">
                    <button className={this.state.filter === 0 ? 'selected' : ''} onClick={() => this.setState({filter:0})}>All</button>
                    <button className={this.state.filter === 1 ? 'selected' : ''}onClick={() => this.setState({filter:1})}>Paintings</button>
                    <button className={this.state.filter === 2 ? 'selected' : ''}onClick={() => this.setState({filter:2})}>Photographs</button>
                    <button className={this.state.filter === 3 ? 'selected' : ''}onClick={() => this.setState({filter:3})}>Sculptures</button>
                    <button className={this.state.filter === 36 ? 'selected' : ''}onClick={() => this.setState({filter:36})}>Ceramics</button>
                    <button className={this.state.filter === 37 ? 'selected' : ''}onClick={() => this.setState({filter:37})}>Glass</button>
                </div>
                <div className={`Gallery ${this.state.galleryActive ? 'active' : ''}`}>
                    {
                        this.state.artworks ? this.state.artworks.map((artwork : Artwork) => {
                                if (artwork.image_id) {
                                    return (
                                        <div key={artwork.id} className='Gallery-border'> 
                                            <Link to={`/artwork/${artwork.id}/1`} className="Gallery-box-link">
                                            <div className='Gallery-box'> 
                                                <img src={artwork.image_id} width="300" alt={artwork.title}/>
                                                <div className='subtitle'>
                                                    <p> {artwork.title}, {artwork.date_display}</p>
                                                    <p id='subtitle-smaller'> {artwork.artist_title} </p>
                                                </div>
                                            </div>
                                            </Link>
                                        </div>
                                    )
                                }
                                return <></>
                            }) : <></>
                    }
                </div>
            </div>

        );  
    }
}

export default Gallery;