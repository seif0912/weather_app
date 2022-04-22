




///////////////////////////////////////////////////////////////


let input = '' // this means the weather is local by default
let sys = 'Metric' // metric system unit by defaut
let array = []
if (input === ''){
    getLocalWeather()
}else{
    getWeatherIn(input)
}





/////// try code


//// try: more section
let T = document.querySelectorAll('.more .title p')

console.log('-----',T.innerText)
T.forEach(ele =>{
    ele.addEventListener('click', (e)=>{
        c = e.target.innerText
        document.querySelector('.more .box.active').classList.remove('active')
        
        let b1 = document.querySelector(`.more .box.${c}`)
        b1.classList.add('active')
    })
})
//// try: more section | end



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
            let tickets = document.querySelectorAll('header .locations .location')

            addTicket(area, false)
        }else{
            return
        }
        
        
    }


    
}

function addTicket(area, pinned){

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
            let loc = `${data.location.name}, ${data.location.country}`
            if(array.indexOf(loc) != -1){
                return
            }
            location.className = 'location'
            location.innerHTML = `
                <i class="fa-solid fa-house" data-cl="y"></i>
                <p data-cl="y">${data.location.name}, ${data.location.country}</p>
                <img data-cl="y" src="${data.current.condition.icon}" alt="">
                <span data-cl="y" class="temp m">${data.current.temp_c}&deg;C</span>
                <span data-cl="y" class="temp a">${data.current.temp_f}&deg;F</span>
                <i class="fa-solid fa-ellipsis-vertical"></i>
                <div class="options">
                    <div data-op="pin" class="option pin">
                        <span data-op="pin">pin</span>
                        <i data-op="pin" class="fa-solid fa-thumbtack"></i>
                    </div>
                    <div data-op="remove" class="option remove">
                        <span data-op="remove">remove</span>
                        <i data-op="remove" class="fa-solid fa-trash"></i>
                    </div>
                </div>
            `
            if(sys ==='American'){
                location.children[4].classList.add('sys-active')
            }else{
                location.children[3].classList.add('sys-active')
            }
            if(pinned == true){
                location.children[6].children[0].style.filter = 'blur(2px)'
                location.children[6].children[0].style.cursor = 'default'
                location.children[6].children[0].style.backgroundColor = 'rgba(255, 255, 255, 0.2)'

            }
            location.addEventListener('click', (e) => {
                //console.log(e.target)
                if(e.target.className === 'location' || e.target.dataset.cl === "y"){
                    getWeatherIn(data.location.name)
                }
            })

            location.children[5].addEventListener('click',(e)=>{

                //let op = document.querySelector('header .location .options')
                location.children[6].classList.toggle('active')
                
                
            })

            // pin option: save to local storage
            location.children[6].children[0].addEventListener('click', e => {
                if(e.target.dataset.op == 'pin'){
                    saveLocal(`${data.location.name}, ${data.location.country}`)
                    location.children[6].children[0].style.filter = 'blur(2px)'
                    location.children[6].children[0].style.cursor = 'default'
                    location.children[6].children[0].style.backgroundColor = 'rgba(255, 255, 255, 0.2)'

                }
            } )

            // remove option: remove the parent ticket from header and? local storage
            location.children[6].children[1].addEventListener('click', e => {
                if(e.target.dataset.op == 'remove'){
                    removeLocal(`${data.location.name}, ${data.location.country}`)
                    location.remove()
                }
            } )
            
            //console.log('=>>', array)
            
            locations.appendChild(location)
            array.push(`${data.location.name}, ${data.location.country}`)

        })
        .catch(err => {
            console.error(err)
        })
    
}

let localPosition = document.querySelector('header .locations .location.self-location')
localPosition.addEventListener('click', () => {
    //console.log('heyoo')
    getLocalWeather()
})

///////////// tickets event listener
function saveLocal(area){
    let locations;
    if (localStorage.getItem('locations') === null) {
        locations = [];
    } else {
        locations = JSON.parse(localStorage.getItem('locations'));
    }
    if(locations.indexOf(area)== -1){
        locations.push(area);
        localStorage.setItem("locations", JSON.stringify(locations))
    }
    
}

function removeLocal(area){
    let locations;
    if (localStorage.getItem('locations') === null) {
        locations = [];
    } else {
        locations = JSON.parse(localStorage.getItem('locations'));
    }
    //const taskIndex = task.children[0].innerText
    if(locations.indexOf(area) != -1){
        locations.splice(locations.indexOf(area), 1)
        localStorage.setItem("locations", JSON.stringify(locations))  
    }
    
}

window.onload = function (){
    //console.log('loaded')
    let locations
    if (localStorage.getItem('locations') === null) {
        locations = [];
    } else {
        locations = JSON.parse(localStorage.getItem('locations'));
    }
    locations.forEach((pos)=>{
        //console.log(pos)
        addTicket(pos, true)
        
    })
}

function system(){
    let sysIcon = document.querySelector('header .sys .fa-gear')
    sysIcon.addEventListener('click',()=>{
        let menu = document.querySelector('header .sys .sys-menu')
        menu.classList.toggle('active')
    })
    let sysSpan = document.querySelectorAll('header .sys .sys-menu span')
    sysSpan.forEach((sp) => {
        sp.addEventListener('click', (e) => {
            let spActive = document.querySelector('header .sys-menu span.active')
            spActive.classList.remove('active')
            e.target.classList.add('active')
            sys = e.target.innerText
            let locM = document.querySelectorAll('header .location .temp.m')
            let locA = document.querySelectorAll('header .location .temp.a')
            if(sys === "American"){
                locM.forEach((l) => {
                    l.classList.remove('sys-active')
                })
                locA.forEach((l) => {
                    l.classList.add('sys-active')
                })
                if (input === ''){
                    getLocalWeather()
                }else{
                    getWeatherIn(input)
                }

            }else if(sys === "Metric"){
                locA.forEach((l) => {
                    l.classList.remove('sys-active')
                })
                locM.forEach((l) => {
                    l.classList.add('sys-active')
                })
                if (input === ''){
                    getLocalWeather()
                }else{
                    getWeatherIn(input)
                }
            }
        })
    })

}

function header(){
    searchArea()
    localPos()
    system()
}

//
header()
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
                ticket.children[3].innerHTML = `${data.current.temp_c}&deg;C`
                ticket.children[4].innerHTML = `${data.current.temp_f}&deg;F`
                array.push(`${data.location.name}, ${data.location.country}`)
                //console.log(';;;', ticket.children)
            })
        })

    }

    navigator.geolocation.getCurrentPosition(success, error)
}


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

    if(sys == 'Metric'){
        currentTemperature.innerText = data[0].current.temp_c
        temperatureUnit.innerText = 'C'
        feelsLike.innerHTML = `feels like ${data[1].current.feelslike_c}&deg;C`
        pressure.innerText = `${data[1].current.pressure_mb}mb`
        windSpeed.innerText = `${data[0].current.wind_kph} Kph`
        visibility.innerText = `${data[1].current.vis_km} Km`
        para.innerHTML = para.innerText + ` the high will be ${data[1].forecast.forecastday[0].day.maxtemp_c}&deg;.`
    }else if(sys == 'American'){
        currentTemperature.innerText = data[0].current.temp_f
        temperatureUnit.innerText = 'F'
        feelsLike.innerHTML = `feels like ${data[1].current.feelslike_f}&deg;F`
        pressure.innerText = `${data[1].current.pressure_in}in`
        windSpeed.innerText = `${data[0].current.wind_mph} Mph`
        visibility.innerText = `${data[1].current.vis_miles} Miles`
        para.innerHTML = para.innerText + ` the high will be ${data[1].forecast.forecastday[0].day.maxtemp_f}&deg;.`
    }

}