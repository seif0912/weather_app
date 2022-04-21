




///////////////////////////////////////////////////////////////


let input = '' // this means the weather is local by default
let sys = 'metric' // metric system unit by defaut
let array = []
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
        header()
    }else{
        getWeatherIn(input)
        header()
    }
    
})
sysM.addEventListener('click',()=>{
    sys = 'metric'
    if (input === ''){
        getLocalWeather()
        header()
    }else{
        getWeatherIn(input)
        header()
    }
})
//////// end unit system
let T = document.querySelectorAll('.more .title p')

console.log(T)
T.forEach(ele =>{
    ele.addEventListener('click', (e)=>{
        c = e.target.innerText
        document.querySelector('.more .box.active').classList.remove('active')
        
        let b1 = document.querySelector(`.more .box.${c}`)
        b1.classList.add('active')
    })
})




/////// try code




//////// end try code


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
    forecast = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=10&aqi=yes&alerts=yes`
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
    }).catch(res =>{
        console.log(res)
        areaSearch('', false)
    })
    
}

function manipulate(data){
    // current weather widget
    currentWeatherWidget(data)
}

//////////////////// header

//// search

function searchArea(){
    let searchInput = document.querySelector('header .search input')
    let searchBtn = document.querySelector('header .search i')
    
    searchInput.addEventListener("keydown", function(event){
        if ((event.key === 'Enter' || event.which === 13) && searchInput.value !='') {
            event.preventDefault();
            areaSearch(searchInput.value, true)
            searchInput.value = ''
        }
    });
    searchBtn.addEventListener('click', () => {
        if(searchInput.value !=''){
            areaSearch(searchInput.value, true) 
        }
        
    })
    
    function areaSearch(area, b){
        //console.log('--',area)
        if(b){
            getWeatherIn(area)
            addTicket(area)
        }else{
            return
        }
        
        
    }
    function addTicket(area){

        let locations = document.querySelector('header .locations')
        let location = document.createElement('div')
        // fetching weather data
        key = 'a4ee2070c05a43e5ae3125414221604'
        current = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${area}`
        fetch(current)
            .then(res => res.json())
            .then(data => {
                //console.log('=>>', data)
                // appending child
                location.className = 'location'
                location.innerHTML = `
                    <i class="fa-solid fa-house"></i>
                    <p>${data.location.name}, ${data.location.country}</p>
                    <img src="${data.current.condition.icon}" alt="">
                    <span></span>
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                    <div class="options">
                        <div class="option pin">
                            <span>pin</span>
                            <i class="fa-solid fa-thumbtack"></i>
                        </div>
                        <div class="option remove">
                            <span>remove</span>
                            <i class="fa-solid fa-trash"></i>
                        </div>
                    </div>
                `
                location.addEventListener('click', (e) => {
                    //console.log(e.target)
                    if(e.target.className != 'fa-solid fa-ellipsis-vertical'){
                        getWeatherIn(data.location.name)
                    }
                })

                location.children[4].addEventListener('click',(e)=>{

                    //let op = document.querySelector('header .location .options')
                    location.children[5].classList.toggle('active')
                })

                array.push(`${data.location.name}, ${data.location.country}`)

                //console.log('=>>', array)
                
    
                if(sys == 'metric'){
                    location.children[3].innerHTML = `${data.current.temp_c}&deg;`
                }else{
                    location.children[3].innerHTML = `${data.current.temp_f}&deg;`
                }
                
                locations.appendChild(location)
    
            })
            .catch(err => {
                console.error(err)
            })
        
    }
    
}
let localPosition = document.querySelector('header .locations .location.self-location')
localPosition.addEventListener('click', () => {
    //console.log('heyoo')
    getLocalWeather()
})

///////////// tickets event listener



////////////
//// default weather
function localPos(){
    const success = (position)=>{
        //console.log(position)
        latitude = position.coords.latitude
        longitude = position.coords.longitude
        //console.log(latitude, longitude)
        const geoCode = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    
        localWeather(geoCode)
    }
    const error = ()=>{
        console.log('no: localPos() says fuck off')
    }

    function localWeather(pos){
        fetch(pos)
        .then(res => res.json())
        .then(data => {
            //console.log('***', data)
            let city = data.city
            let country = data.countryName
            console.log(city, country)
            key = 'a4ee2070c05a43e5ae3125414221604'
            current = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${country}`
            fetch(current)
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                let ticket = document.querySelector('header .location.self-location')
                ticket.children[1].innerText = `${data.location.name}, ${data.location.country}`
                ticket.children[2].src = data.current.condition.icon
                if(sys === 'metric'){
                    ticket.children[3].innerHTML = `${data.current.temp_c}&deg;`
                }else if(sys === 'am'){
                    ticket.children[3].innerHTML = `${data.current.temp_f}&deg;`
                }
                //console.log(';;;', ticket.children)
            })
        })

    }

    navigator.geolocation.getCurrentPosition(success, error)
}

function header(){
    searchArea()
    localPos()
}

//
header()
// end header

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
    let para = document.querySelector('.current-weather .para')
    
    
    // manipulation
    localPlace.innerText = `${data[0].location.name}, ${data[0].location.country}`
    dt.innerText = data[0].location.localtime
    weatherIcon.src = data[0].current.condition.icon
    currentCondition.innerText = data[0].current.condition.text
    humidity.innerText = `${data[1].current.humidity}%`
    windDirection.style.transform = `rotate(${data[0].current.wind_degree}deg)`
    para.innerText = `Expect ${data[1].forecast.forecastday[0].day.condition.text} skies.`

    if(sys == 'metric'){
        currentTemperature.innerText = data[0].current.temp_c
        temperatureUnit.innerText = 'C'
        feelsLike.innerHTML = `feels like ${data[1].current.feelslike_c}&deg;C`
        pressure.innerText = `${data[1].current.pressure_mb}mb`
        windSpeed.innerText = `${data[0].current.wind_kph} Kph`
        visibility.innerText = `${data[1].current.vis_km} Km`
        para.innerHTML = para.innerText + ` the high will be ${data[1].forecast.forecastday[0].day.maxtemp_c}&deg;.`
    }else if(sys == 'am'){
        currentTemperature.innerText = data[0].current.temp_f
        temperatureUnit.innerText = 'F'
        feelsLike.innerHTML = `feels like ${data[1].current.feelslike_f}&deg;F`
        pressure.innerText = `${data[1].current.pressure_in}in`
        windSpeed.innerText = `${data[0].current.wind_mph} Mph`
        visibility.innerText = `${data[1].current.vis_miles} Miles`
        para.innerHTML = para.innerText + ` the high will be ${data[1].forecast.forecastday[0].day.maxtemp_f}&deg;.`
    }

}