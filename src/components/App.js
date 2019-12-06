import React from 'react';
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
  }

  render() {
    return (

        <div>
          <ZipForm onSubmit={this.onFormSubmit} />
          <WeatherList />
          <CurrentDay />
        </div>

    );
  }


}

export default App;
