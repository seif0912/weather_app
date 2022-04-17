


key = 'a4ee2070c05a43e5ae3125414221604'

///////////////////////////////////////////////////////////////

// get local country

let localCountry = document.querySelector('.country')
let t = document.querySelector('.temp')

const success = (position)=>{
    //console.log(position)
    latitude = position.coords.latitude
    longitude = position.coords.longitude
    //console.log(latitude, longitude)
    const geoCode = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`

    fetch(geoCode)
    .then(res => res.json())
    .then(data => getWeather(data))
}
const error = ()=>{
    console.log('no')
}
navigator.geolocation.getCurrentPosition(success, error)

// get weather
function getWeather(data){
    //console.log(data)
    let country = data.countryName
    //country = 'new york'

    current = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${country}`
    forecast = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${country}&days=7&aqi=yes&alerts=yes`
    search_autocomplete = `http://api.weatherapi.com/v1/search.json?key=${key}&q=${country}`
    astronomy = `http://api.weatherapi.com/v1/astronomy.json?key=${key}&q=${country}`
    timeZone = `http://api.weatherapi.com/v1/timezone.json?key=${key}&q=${country}`
    urls = [current, forecast, search_autocomplete, astronomy, timeZone]
    
    promises = urls.map(url => fetch(url))
    
    Promise.all(urls.map(url =>
        fetch(url).then(resp => resp.json())
    )).then(objs =>{
        console.log(objs)
        mani(objs)
    })
    
}

function mani(data){
    localCountry.innerText = data[0].location.name
    t.innerText = data[0].current.temp_c
}