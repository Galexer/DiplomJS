document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("hall") == undefined){
        location.replace("index.html")
    }
})


let allSeats = document.getElementsByClassName("conf-step__row")
let price = localStorage.getItem("price") != undefined ? parseInt(localStorage.getItem("price")) : 0
let seats = localStorage.getItem("seats") != undefined ? JSON.parse(localStorage.getItem("seats")) : {}
let numberOfexample = 4
let str = ""
let prevAns = ""
let butt = document.getElementsByClassName("acceptin-button")
butt[0].style.backgroundColor = 'grey'
butt[0].setAttribute('disabled', 'true')

let fullHall = localStorage.getItem("hall")
fullHall = JSON.parse(fullHall)
let seanse = localStorage.getItem("seans")
seanse = JSON.parse(seanse)
let film = localStorage.getItem("film")
film = JSON.parse(film)
let timeInSeconds = localStorage.getItem("timestamp")

let filmTit = document.getElementsByClassName("buying__info-title")
filmTit[0].textContent = film.film_name
let filmStart = document.getElementsByClassName("buying__info-start")
filmStart[0].textContent =`Начало сеанса: ${seanse.seance_time}`
let hallName = document.getElementsByClassName("buying__info-hall")
hallName[0].textContent = fullHall.hall_name
let orPrice = document.getElementsByClassName("conf-step__legend-value price-standart")
orPrice[0].textContent = fullHall.hall_price_standart
let vipPrice = document.getElementsByClassName("conf-step__legend-value price-vip")
vipPrice[0].textContent = fullHall.hall_price_vip

let send = `event=get_hallConfig&timestamp=${timeInSeconds}&hallId=${fullHall.hall_id}&seanceId=${seanse.seance_id}`
request(send).then( ans => {
    let cr = document.getElementsByClassName("conf-step__wrapper")
    if(ans != null) {
        if( ans == localStorage.getItem("prevAns")){
            cr[0].insertAdjacentHTML("afterbegin", localStorage.getItem("conf"))
            butt[0].style.backgroundColor = ''
            butt[0].removeAttribute('disabled')
            prevAns = ans
        } else {
            cr[0].insertAdjacentHTML("afterbegin", ans)
            prevAns = ans
        }
    } else {
        if(fullHall.hall_config == localStorage.getItem("conf") || localStorage.getItem("conf") == undefined) {
            cr[0].insertAdjacentHTML("afterbegin", fullHall.hall_config)
        } else {
            cr[0].insertAdjacentHTML("afterbegin", localStorage.getItem("conf"))
        }           
    }
        
    let seat = document.getElementsByClassName("conf-step__chair") 
    let row = document.getElementsByClassName("conf-step__row").length
    let seatsInRow = (seat.length- numberOfexample) / row
        
    for(i = 0; i < (seat.length - numberOfexample); i++){
        let s = seat[i]
        let numSelSeat = i
        seat[i].addEventListener('click', () => {
            if(!s.classList.contains("conf-step__chair_taken") && !s.classList.contains("conf-step__chair_disabled")){
                if(!s.classList.contains("conf-step__chair_selected")) {
                    s.classList.toggle("conf-step__chair_selected")
                    let selRow = 0
                    if(numSelSeat == 0){
                        selRow = 1
                    } else {
                        selRow = Math.trunc(numSelSeat / row) + 1
                    }
                    let selSeat = (seatsInRow - ((seatsInRow * selRow) - numSelSeat) + 1)
                    seats[`seat${numSelSeat}`] = `${selRow}/${selSeat}`
                    if(s.classList.contains("conf-step__chair_standart")){
                        price += parseInt(fullHall.hall_price_standart)
                    }
                    if(s.classList.contains("conf-step__chair_vip")){
                        price += parseInt(fullHall.hall_price_vip)
                    }
                } else {
                    s.classList.toggle("conf-step__chair_selected")
                    delete seats[`seat${numSelSeat}`]
                    if(s.classList.contains("conf-step__chair_standart")){
                        price -= parseInt(fullHall.hall_price_standart)
                    }
                    if(s.classList.contains("conf-step__chair_vip")){
                        price -= parseInt(fullHall.hall_price_vip)
                    }
                }                    
            }
            str = ""
            for(i = 0; i < allSeats.length; i++){           
                str = str + allSeats[i].outerHTML
            }
        })
    }

    cr[0].addEventListener(`click`, () => {
        butt[0].setAttribute('disabled', 'false')
        for(i = 0; i < (seat.length - numberOfexample); i++){
            if(seat[i].classList.contains("conf-step__chair_selected")){
                butt[0].style.backgroundColor = ''
                butt[0].removeAttribute('disabled')
                break
            } else {
                butt[0].style.backgroundColor = 'grey'
                butt[0].setAttribute('disabled', 'true')
            }
        }
    })      
        
    butt[0].addEventListener(`click`, () => {
        if(!butt[0].hasAttribute('disabled')) {
            localStorage.setItem("seats", JSON.stringify(seats))
            localStorage.setItem("hallId", fullHall.hall_id)
            localStorage.setItem("seansId", seanse.seance_id)
            localStorage.setItem("hallName", fullHall.hall_name)
            localStorage.setItem("time", timeInSeconds)
            localStorage.setItem("price", price)
            localStorage.setItem("conf", str)
            localStorage.setItem("filmName", film.film_name)
            localStorage.setItem("start", seanse.seance_time)
            localStorage.setItem("prevAns", prevAns)
            location = "payment.html"
        }
            
    })
})        

let dubl = document.querySelectorAll("body")
let check = 0
var tapedTwice = false
dubl[0].addEventListener('touchstart', ()=> {
    if(!tapedTwice) {
        tapedTwice = true
        setTimeout( function() { tapedTwice = false; }, 600 )
        return
    } else {
        if ( window.innerWidth <= 990) {
            if(check == 0){
              dubl[0].style.zoom = `2.0`;
              check = 1
            } else{
              dubl[0].style.zoom = `1.0`;
              check = 0
            }
        }
    }
 })