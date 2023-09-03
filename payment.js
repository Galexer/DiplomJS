document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("hall") == undefined){
        location.replace("index.html")
    }
  })


let seats = localStorage.getItem("seats")
seats = JSON.parse(seats)
let hall = localStorage.getItem("hallId")
let seans = localStorage.getItem("seansId")
let time = localStorage.getItem("time")
time = JSON.parse(time)
let price = localStorage.getItem("prise")
price = JSON.parse(price)
let conf = localStorage.getItem("conf")
let film = localStorage.getItem("filmName")
let start = localStorage.getItem("start")
let hallFullN = localStorage.getItem("hallName")
let hallName = hallFullN.slice(hallFullN.indexOf("л")+1)

let filmN = document.getElementsByClassName("ticket__details ticket__title")
filmN[0].textContent = film
let seatsN = document.getElementsByClassName("ticket__details ticket__chairs")
seatsN[0].textContent = Object.values(seats)
let hallN = document.getElementsByClassName("ticket__details ticket__hall")
hallN[0].textContent = hallName
let startT = document.getElementsByClassName("ticket__details ticket__start")
startT[0].textContent = start
let priceN = document.getElementsByClassName("ticket__details ticket__cost")
priceN[0].textContent = price

let butt = document.getElementsByClassName("acceptin-button")
butt[0].addEventListener(`click`, () => {
    let str = JSON.stringify(`На фильм: ${film}\n\nРяд/Место: ${Object.values(seats)}\n\nВ зале: ${hallName}\n\nНачало сеанса: ${start}`)
    localStorage.clear()
    localStorage.setItem("forQR", str)
    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://jscp-diplom.netoserver.ru/')
    xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
    xhr.send(`event=sale_add&timestamp=${JSON.stringify(time)}&hallId=${JSON.stringify(hall)}&seanceId=${JSON.stringify(seansId)}&hallConfiguration=${JSON.stringify(conf)}`)
})