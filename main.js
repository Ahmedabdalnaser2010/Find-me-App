let input = document.querySelector(".in")
let arrow = document.querySelector(".arrow")
let locateMe = document.querySelector(".locate-me")
let ipAddress = document.querySelector(".ip h4")
let locate = document.querySelector(".location h4")
let timeZone = document.querySelector(".time-zone h4")
let ISP = document.querySelector(".ISP h4")
let latit = document.querySelector(".late h4")
let longit = document.querySelector(".long h4")
let Loca = document.querySelector(".loc h4")
let weatherButton = document.querySelector(".weather")
let weatherConditionSection = document.querySelector(".weather-condition")


let map = L.map('map').setView([30, 31], 13);
let tileLayer = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
let attribution = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}

let firstTile = L.tileLayer(tileLayer, attribution)

firstTile.addTo(map)

let marker = L.marker([30, 31]).addTo(map);

console.log(timeZone)


// IP Addresss API

function sendReq() {

    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_hoK8hrrixwI0VDlIT0FH5EkH8zOBw&ipAddress=${input.value}`)

        .then((response) => response.json())

        .then((data) => {

            if (data.code === 422) {

                alert("Wrong Code")

            } else {
                console.log(map)
                ipAddress.innerHTML = data.ip
                locate.innerHTML = `${data.location.city}, ${data.location.region},${data.location.country}`
                timeZone.innerHTML = `UTC ${data.location.timezone}`
                ISP.innerHTML = `${data.isp}`
                map.flyTo([data.location.lat, data.location.lng], 13)
                if (marker !== null) {
                    map.removeLayer(marker)
                }
                marker = L.marker([data.location.lat, data.location.lng])
                marker.addTo(map)
                getWeather(data.location.city)
            }
        })

}

// Locate me  API

function getLocation() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("locate-me")) {
            document.querySelector(".info").style.display = "none"
            document.querySelector(".location-info").style.display = "flex"
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {

                    let lat = position.coords.latitude
                    let long = position.coords.longitude

                    fetch(`https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`)
                        .then(respon => respon.json())
                        .then(data => {
                            latit.innerHTML = data.latitude
                            longit.innerHTML = data.longitude
                            Loca.innerHTML = `${data.city},${data.countryName}`

                            console.log(data)
                            map.flyTo([data.latitude, data.longitude], 13)
                            if (marker !== null) {
                                map.removeLayer(marker)
                            }
                            marker = L.marker([data.latitude, data.longitude])
                            marker.addTo(map)
                            getWeather(data.city)
                            weatherButton.style.display = "block"
                        })
                })

            }
        }
    })


}
getLocation()





arrow.addEventListener("click", function () {
    if (input.value == "") {
        alert("Input is Empty")
    } else {
        document.querySelector(".info").style.display = "flex"
        document.querySelector(".location-info").style.display = "none"
        sendReq()
        input.value = ""
        weatherButton.style.display = "block"
    }



})

document.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        if (input.value == "") {
            alert("Input is Empty")
        } else {
            document.querySelector(".info").style.display = "flex"
            document.querySelector(".location-info").style.display = "none"
            sendReq()
            input.value = ""
            weatherButton.style.display = "block"
        }
    }


})




async function getWeather(cityName) {
    try {
        await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c1714e58688f40e7838114346242710&q=${cityName}&days=3&aqi=no&alerts=no`)
            .then(response => response.json())
            .then(data => {
                let response = data
                console.log(data)
                console.log(data.forecast.forecastday[0].date)
                weatherData(response)

            })
    }
    catch (error) {
        console.log("error")
    }

}
let locationInfo = document.querySelector(".location-info")
let info = document.querySelector(".info")

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("weather")) {
        weatherConditionSection.style.display = "flex"
        locationInfo.style.opacity = 0.7
        info.style.opacity = 0.7
    }

    if (!e.target.classList.contains("weather")) {
        weatherConditionSection.style.display = "none"
        locationInfo.style.opacity = 0.9
        info.style.opacity = 0.9

    }


})

function weatherData(response) {
    for (i = 0; i < response.forecast.forecastday.length; i++) {

        document.querySelectorAll(".day-date")[i].textContent = response.forecast.forecastday[i].date
        document.querySelectorAll(".icon")[i].src = response.forecast.forecastday[i].day.condition.icon
        document.querySelectorAll(".temp")[i].innerHTML = `${response.forecast.forecastday[i].day.maxtemp_c} <sup>o</sup>C  / ${response.forecast.forecastday[i].day.mintemp_c} <sup>o</sup>C `

        console.log(document.querySelectorAll(".day-one span")[0])
    }



}

