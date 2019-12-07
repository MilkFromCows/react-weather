import React from 'react';
import axios from 'axios';
//import logo from '../logo.svg';
import ZipForm from './ZipForm';
import WeatherList from './WeatherList';
import CurrentDay from './CurrentDay';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timezoneOffset: -7, 
      zipcode: "",
      city: {},
      forecast: [],
      simpleForecast: [], 
      selectedDate: null
    }
    this.url = "http://api.openweathermap.org/data/2.5/forecast?zip=";
    this.apikey = "&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646";

    this.googleApiKey = "AIzaSyC1HTCZ6mUEKFuuLHPLdE1zM2_Q7j0vxhk";
    this.googleMapsUrl = "https://maps.googleapis.com/maps/api/timezone/json?location=";
    
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(zipcode) {
    this.setState( {zipcode} ); //or {zipcode: zipcode}

    // AJAX call
    /*
    fetch(`${this.url}${zipcode}${this.apikey}`)
	    .then(response => response.json())
        .then(data => { 
            const {city, list: forecast } = data; 
            fetch(`${this.googleMapsUrl}
                ${city.coord.lat},${city.coord.lon}
                &timestamp=${forecast[0].dt}
                &key=${this.googleApiKey}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const timezoneOffset =  (data.rawOffset + data.dstOffset) / (60 * 60);
                const simpleForecast = this.parseForecast(forecast, timezoneOffset);
                zipcode = ""; 
                this.setState({zipcode, city, forecast, simpleForecast, timezoneOffset, selectedDate: null});         
            })
            .catch(googleError => {
                alert('There was a problem getting timezone info!')
            });
        })
        .catch(error => {
            alert('There was a problem getting info!'); 
        });

    // Axios. I changed get to axios.get, and imported axios from 'axios' at the top.
    axios.get(`${this.url}${zipcode}${this.apikey}`)
        .then(({data})  => { 
            const {city, list: forecast } = data; 
            axios.get(`${this.googleMapsUrl}${city.coord.lat},${city.coord.lon}&timestamp=${forecast[0].dt}&key=${this.googleApiKey}`)
            .then(({data})  => {
                console.log(data);
                const timezoneOffset =  (data.rawOffset + data.dstOffset) / (60 * 60);
                const simpleForecast = this.parseForecast(forecast, timezoneOffset);
                zipcode = ""; 
                this.setState({zipcode, city, forecast, simpleForecast, timezoneOffset, selectedDate: null});         
            })
            .catch(googleError => {
                alert('There was a problem getting timezone info!')
            });
        })
        .catch(error => {
            alert('There was a problem getting info!'); 
        });
    */
  }

  render() {
    const { simpleForecast, city, selectedDate } = this.state;
    return (
      <div id="app-container">
        <div className="app">
          <ZipForm onSubmit={this.onFormSubmit}/>
          <WeatherList forecastDays={simpleForecast}/>
          <CurrentDay />
        </div>
      </div>
    );
  }


}

export default App;
