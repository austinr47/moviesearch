import React, { Component } from 'react';
import axios from 'axios';

export default class Trailer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      url: 'https://www.googleapis.com/youtube/v3/search',
      key: 'AIzaSyCbgZDgYB-j70TX2GRX35QONzB32fgksBQ',
    }
    this.getId=this.getId.bind(this)
  }

  componentDidMount() {
    const {title, year} = this.props
    this.getId(title, year)
  }
  
  // need this for when the props change so that it continues to show correct trailer
  componentWillReceiveProps(nextProps) {
    this.getId(nextProps.title, nextProps.year)
  }

  // method to get the movieID and setting it to state
  getId(title, year) {
    //using the google youtube api to get the video id
    let youtube = (params, callback) => {
      axios.get(this.state.url, { params: params }).then(function(response) {
          callback(response.data.items[0])
        }).catch(function(error) {
          console.error(error);
        });
    };

    // adding the parameters for the axios call
    youtube({key: this.state.key, q: `${title} + trailer + ${year}`, maxResults: 6, part: 'snippet', type: 'video'}, (response) => {
      this.setState({
        id: response.id.videoId,
      })
    })
  }

  // method to close the pop up window
  close() {
    this.props.close()
  }

  
  render() {
    return (
      <div onClick={() => this.close()} className='player-main'>
        <button  className='btn btn-light' onClick={() => this.close()}>←Continue Browsing</button>
        <iframe title='Trailer' className='trailer' width="420" height="315" src={`https://www.youtube.com/embed/${this.state.id}`} frameBorder="0" allowFullScreen></iframe>
      </div>
    );
  }
}