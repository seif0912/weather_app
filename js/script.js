




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



//// try: more section | end


//// try: tickets section overflow
let moreLoc = document.querySelector('header .more-locations')

if(array.length <= 1){
    moreLoc.classList.add('empty')
}

let otherLoc = document.querySelector('header .other-locations')
moreLoc.addEventListener('click', (e) => {
    console.log(e.target)
    if(e.target.classList.contains('more-locations')|| e.target.className == 'sp' || e.target.className == 'fa-solid fa-chevron-right' ){
        moreLoc.classList.toggle('active')
        otherLoc.classList.toggle('active')
        let ops = document.querySelector('header .location .options.active')
        if(ops != null){
            ops.classList.remove('active')
        }
    }

})

//// try: tickets section overflow | end

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
    //console.log('forecast')
    forecastManipulation(data)
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

    let locations = document.querySelector('header .more-locations .other-locations')
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
                    //location.children[6].classList.remove('active')
                    let ops = document.querySelector('header .location .options.active')
                    if(ops != null){
                        ops.classList.remove('active')
                    }
                }
            })

            location.children[5].addEventListener('click',(e)=>{
                //console.log('***', e.target)
                //let op = document.querySelector('header .location .options')
                let ops = document.querySelector('header .location .options.active')
                
                location.children[6].classList.toggle('active')
                if(ops != null){
                    ops.classList.remove('active')
                }
                
            })

            // pin option: save to local storage
            location.children[6].children[0].addEventListener('click', e => {
                if(e.target.dataset.op == 'pin'){
                    saveLocal(`${data.location.name}, ${data.location.country}`)
                    location.children[6].children[0].style.filter = 'blur(2px)'
                    location.children[6].children[0].style.cursor = 'default'
                    location.children[6].children[0].style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                }
                location.children[6].classList.remove('active')
            } )

            // remove option: remove the parent ticket from header and? local storage
            location.children[6].children[1].addEventListener('click', e => {
                if(e.target.dataset.op == 'remove'){
                    removeLocal(`${data.location.name}, ${data.location.country}`)
                    array.splice(array.indexOf(`${data.location.name}, ${data.location.country}`), 1)
                    location.remove()
                    if(array.length <= 1){
                        moreLoc.classList.add('empty')
                    }
                }
            } )
            
            //console.log('=>>', array)
            
            locations.appendChild(location)
            array.push(`${data.location.name}, ${data.location.country}`)
            
            /*let moreLoc = document.querySelector('header .more-locations')
            if(array.length <= 1){
                moreLoc.style.dislpay = 'none'
            }*/
            if(array.length >= 1){

                moreLoc.classList.remove('active')
                otherLoc.classList.remove('active')
                moreLoc.classList.remove('empty')
            }

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
            //console.log(city, country)
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


/////// forecast




function forecastManipulation(data){
    let days = document.querySelectorAll('.forecast .day')
    //console.log(data[1])
    //let i = 0
    days.forEach((day, index) =>{
        //console.log(data[1].forecast.forecastday[index])
        let dayData = data[1].forecast.forecastday[index]
        //i++
        day.children[0].innerText = dayDate(dayData.date)
        day.children[1].children[0].children[0].src = dayData.day.condition.icon
        day.children[1].children[1].children[0].innerHTML = dayData.day.condition.text
        day.children[1].children[1].children[1].children[1].innerHTML = `${dayData.day.daily_chance_of_rain}%`
        if(sys === 'Metric'){
            day.children[1].children[0].children[1].children[0].innerHTML = `${dayData.day.avgtemp_c}&deg;`
            day.children[1].children[0].children[1].children[1].innerHTML = `${dayData.day.maxtemp_c}&deg;`
        }else if(sys === 'American'){
            day.children[1].children[0].children[1].children[0].innerHTML = `${dayData.day.avgtemp_f}&deg;`
            day.children[1].children[0].children[1].children[1].innerHTML = `${dayData.day.maxtemp_f}&deg;`
        }
        //console.log(day)
    }) 
    let defDaySummary = document.querySelector('.forecast .day.active')
    let defSummary = document.querySelector('.info-box .box.active')
    //console.log(defDaySummary)
    //console.log(defSummary)
    summaryMani(defSummary, 0, data[1])
    days.forEach((day, index) =>{
        day.addEventListener('click', ()=>{
            let acDay = document.querySelector('.forecast .day.active')
            acDay.classList.remove('active')
            day.classList.add('active')
            //console.log(index)
            //console.log(data[1].forecast.forecastday[index].hour)
            summaryMani(defSummary, index, data[1])
            console.log('indes: ', index)
        })
    }) 
}

function dayDate(dateString){
    
    let getDayName = new Intl.DateTimeFormat('en-Us', { weekday: 'long' }).format(new Date(dateString));
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    if (days[new Date().getDay()] == getDayName){
        return "Today"
    }
    
    return `${getDayName.slice(0,3)} ${dateString.slice(-2)}`
}

/////// forecast | end

/////// More details

let infos = document.querySelectorAll('.more .title p')
let infoBoxes = document.querySelectorAll('.more .info-box .box')

infos.forEach((ele ,index)=>{
    //console.log(ele, index)
    ele.addEventListener('click', ()=>{
        document.querySelector('.more .title p.active').classList.remove('active')
        document.querySelector('.more .info-box .box.active').classList.remove('active')
        infos[index].classList.add('active')
        infoBoxes[index].classList.add('active')
    })
})

/// summary Chart

function summaryMani(day, ind, forecastData){
    let hourlyTemp_c = []
    let hourlyTemp_f = []
    let hours = []
    forecastData.forecast.forecastday[ind].hour.forEach((h,i)=>{
        hours = [...hours,i]
        hourlyTemp_c = [...hourlyTemp_c,h.temp_c]
        hourlyTemp_f = [...hourlyTemp_f,h.temp_f]
        console.log(ind)
    })


    if (sys == 'Metric'){
        getChart(hours, hourlyTemp_c)
    }else if (sys == 'American'){
        getChart(hours, hourlyTemp_f)
    }
    
}

let myChart = null
function getChart(hours, hourlyTemp_c){
    if (myChart != null){
        myChart.destroy()
    }
    let ctx = document.querySelector('#hourlyChart').getContext('2d')
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0,'rgba(230,136,15,0.3)')
    gradient.addColorStop(1,'rgba(0,210,255,0.3)')

    Chart.defaults.font.family = 'Helvetica';
    const labels = hours
    const data = {
        labels,
        datasets: [{
            data: hourlyTemp_c,
            label: 'temperature',
            fill: true,
            backgroundColor: gradient,
            borderColor: 'rgba(255,255,255,.75)',
            pointBackgroundColor: '#aaa',
            tension: 0.4
        }]
    }

    let delayed

    const config = {
        type: 'line',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            radius: 5,
            hitRadius: 30,
            hoverRadius: 10,
            responsive: true,
            animation: {
                onComplete:()=> {
                    delayed = true;
                },
                delay: (context) =>{
                    let delay = 0
                    if (context.type === 'data' && context.mode === 'default' && !delayed){
                        delay = context.dataIndex * 50 + context.datasetIndex * 100;
                    }
                    return delay;
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value){
                            return value + '°'
                        },
                        color: "rgba(255,255,255,.75)"
                    }
                },
                x: {
                    ticks: {
                        color: "rgba(255,255,255,.75)"
                    }
                }
            }
        }
    }

    myChart = new Chart(ctx, config) 

}




/// summary Chart | end

/////// More details | end