




///////////////////////////////////////////////////////////////


let input = 'paris' // this means the weather is local by default
let sys = 'metric' // metric system unit by defaut

if (input === ''){
    getLocalWeather()
}else{
    getWeatherIn(input)
}



///////// start unit system
let sysA = document.querySelector('button.am')
let sysM = document.querySelector('button.metric')

sysA.addEventListener('click',()=>{
    sys = 'am'
    if (input === ''){
        getLocalWeather()
    }else{
        getWeatherIn(input)
    }
    
})
sysM.addEventListener('click',()=>{
    sys = 'metric'
    if (input === ''){
        getLocalWeather()
    }else{
        getWeatherIn(input)
    }
})
//////// end unit system











///////// local weather | city weather
function getLocalWeather(){

    const success = (position)=>{
        //console.log(position)
        latitude = position.coords.latitude
        longitude = position.coords.longitude
        //console.log(latitude, longitude)
        const geoCode = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    
        localWeather(geoCode)
    }
    const error = ()=>{
        console.log('no')
    }

    function localWeather(pos){
        fetch(pos)
        .then(res => res.json())
        .then(data => getWeather(data.countryName))
    }

    navigator.geolocation.getCurrentPosition(success, error)
    // manipulate the DOM acourding to your local city
}

function getWeatherIn(city){
    getWeather(city)
}
/////////




// get weather
function getWeather(city){
    key = 'a4ee2070c05a43e5ae3125414221604'

    current = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`
    forecast = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=7&aqi=yes&alerts=yes`
    search_autocomplete = `http://api.weatherapi.com/v1/search.json?key=${key}&q=${city}`
    astronomy = `http://api.weatherapi.com/v1/astronomy.json?key=${key}&q=${city}`
    timeZone = `http://api.weatherapi.com/v1/timezone.json?key=${key}&q=${city}`
    urls = [current, forecast, search_autocomplete, astronomy, timeZone]
    
    promises = urls.map(url => fetch(url))
    
    Promise.all(urls.map(url =>
        fetch(url).then(resp => resp.json())
    )).then(objs =>{
        console.log(objs) 
        manipulate(objs) // manipulate the DOM accourding to the weather data
    })
    
}

function manipulate(data){
    // current weather widget
    currentWeatherWidget(data)
}

// current Weather Widget
function currentWeatherWidget(data){
    // selectors
    let dt = document.querySelector('.current-weather .time')
    let localPlace = document.querySelector('.current-weather .head .location')
    let weatherIcon = document.querySelector('.current-weather .weather-general img')
    let currentTemperature = document.querySelector('.current-weather .weather-general .temp h1')
    let temperatureUnit = document.querySelector('.current-weather .weather-general .temp span')
    let currentCondition = document.querySelector('.current-weather .weather-general .disc p:first-child')
    let feelsLike = document.querySelector('.current-weather .weather-general .disc p:last-child')
    let windSpeed = document.querySelector('.current-weather .info .box.wind p .value')
    let windDirection = document.querySelector('.current-weather .info .box.wind p .arrow')
    let humidity = document.querySelector('.current-weather .info .box.humidity p')
    let visibility = document.querySelector('.current-weather .info .box.visibility p')
    let pressure = document.querySelector('.current-weather .info .box.pressure p')
    
    
    // manipulation
    localPlace.innerText = `${data[0].location.name}, ${data[0].location.country}`
    dt.innerText = data[0].location.localtime
    weatherIcon.src = data[0].current.condition.icon
    currentCondition.innerText = data[0].current.condition.text
    humidity.innerText = `${data[1].current.humidity}%`
    windDirection.style.transform = `rotate(${data[0].current.wind_degree}deg)`
    if(sys == 'metric'){
        currentTemperature.innerText = data[0].current.temp_c
        temperatureUnit.innerText = 'C'
        feelsLike.innerHTML = `feels like ${data[1].current.feelslike_c}&deg;C`
        pressure.innerText = `${data[1].current.pressure_mb}mb`
        windSpeed.innerText = `${data[0].current.wind_kph} Kph`
        visibility.innerText = `${data[1].current.vis_km} Km`
    }else if(sys == 'am'){
        currentTemperature.innerText = data[0].current.temp_f
        temperatureUnit.innerText = 'F'
        feelsLike.innerHTML = `feels like ${data[1].current.feelslike_f}&deg;F`
        pressure.innerText = `${data[1].current.pressure_in}in`
        windSpeed.innerText = `${data[0].current.wind_mph} Mph`
        visibility.innerText = `${data[1].current.vis_miles} Miles`
    }
}