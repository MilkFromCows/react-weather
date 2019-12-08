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
    //this.apikey = "&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646";
    //my api key: 89c49560025979e7c4b8b0512750f52e
    this.apikey = "&units=imperial&appid=89c49560025979e7c4b8b0512750f52e";

    this.googleApiKey = "AIzaSyC1HTCZ6mUEKFuuLHPLdE1zM2_Q7j0vxhk";
    this.googleMapsUrl = "https://maps.googleapis.com/maps/api/timezone/json?location=";
    
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  getWeekday(date) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekDay = date.getDay();
    return dayNames[weekDay];
  }

  // parsing methods
  getIndexOfMidnight(firstDate, timezoneOffset) {
    let dt = firstDate * 1000;
    let date = new Date(dt);
    let utcHours = date.getUTCHours();
    let localHours = utcHours + timezoneOffset;
    let firstMidnightIndex = (localHours > 2) ?
      Math.round((24 - localHours) / 3) :
      Math.abs(Math.round(localHours / 3));
    return firstMidnightIndex;
  }

  findMinTemp(forecast, indexOfMidnight) {
    let min = forecast[indexOfMidnight].main.temp_min;
    for (let i = indexOfMidnight + 1; i < indexOfMidnight + 8; i++)
      if (forecast[i].main.temp_min < min)
        min = forecast[i].main.temp_min;
    return min;
  }

  findMaxTemp(forecast, indexOfMidnight) {
    let max = forecast[indexOfMidnight].main.temp_max;
    for (let i = indexOfMidnight + 1; i < indexOfMidnight + 8; i++)
      if (forecast[i].main.temp_max > max)
        max = forecast[i].main.temp_max;
    return max;
  }

  // the parseForecast method
  parseForecast(forecast, timezoneOffset) {
    let simpleForecast = new Array();
    const MIDNIGHT = this.getIndexOfMidnight(forecast[0].dt, timezoneOffset);
    const NOON = 4;
    const SIXAM = 2;
    const SIXPM = 6;
    const NINEPM = 7;
    const MORNING = SIXAM;
    const DAY = NOON;
    const EVENING = SIXPM;
    const NIGHT = NINEPM;
    const PERDAY = 8;
    const DAYS = 4;
    for (let i = MIDNIGHT; i < forecast.length - NINEPM; i += PERDAY) {
      let oneDay = new Object();
      oneDay.dt = forecast[i + NOON].dt;
      oneDay.temp = forecast[i + NOON].main.temp;
      oneDay.minTemp = this.findMinTemp(forecast, i);
      oneDay.maxTemp = this.findMaxTemp(forecast, i);
      oneDay.morningTemp = forecast[i + MORNING].main.temp;
      oneDay.dayTemp = forecast[i + DAY].main.temp;
      oneDay.eveningTemp = forecast[i + EVENING].main.temp;
      oneDay.nightTemp = forecast[i + NIGHT].main.temp;
      oneDay.description = forecast[i + NOON].weather[0].description;
      oneDay.icon = forecast[i + NOON].weather[0].icon;
      oneDay.pressure = forecast[i + NOON].main.pressure;
      oneDay.wind = forecast[i + NOON].wind.speed;
      oneDay.humidity = forecast[i + NOON].main.humidity;
      //console.log(oneDay);
      simpleForecast.push(oneDay);
      console.log(simpleForecast);
    }
    return simpleForecast;
  }

  onFormSubmit(zipcode) {
    this.setState( {zipcode} ); //or {zipcode: zipcode}
    console.log("onFormSubmit method fired");

    // AJAX call
    
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
                console.log(timezoneOffset + " is the timezoneOffset"); 
                const simpleForecast = this.parseForecast(forecast, timezoneOffset);// parseForecast is not a function yet
                console.log("simpleForecast is: " + simpleForecast); 
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
