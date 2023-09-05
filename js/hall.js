document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("hall") == undefined){
        location.replace("index.html")
    }
})

let hall = localStorage.getItem("hall")
hall = JSON.parse(hall)
let seanse = localStorage.getItem("seans")
seanse = JSON.parse(seanse)
let film = localStorage.getItem("film")
film = JSON.parse(film)
let day = localStorage.getItem("day")
console.log(day)

let allSeats = document.getElementsByClassName("conf-step__row")
let price = localStorage.getItem("price") != undefined ? parseInt(localStorage.getItem("price")) : 0
let seats = localStorage.getItem("seats") != undefined ? JSON.parse(localStorage.getItem("seats")) : {}
let numberOfexample = 4
let str = ""
let prevAns = ""
let butt = document.getElementsByClassName("acceptin-button")
butt[0].style.backgroundColor = 'grey'
butt[0].setAttribute('disabled', 'true')

let filmTit = document.getElementsByClassName("buying__info-title")
filmTit[0].textContent = film.film_name
let filmStart = document.getElementsByClassName("buying__info-start")
filmStart[0].textContent =`Начало сеанса: ${seanse.seance_time}`
let hallName = document.getElementsByClassName("buying__info-hall")
hallName[0].textContent = hall.hall_name
let orPrice = document.getElementsByClassName("conf-step__legend-value price-standart")
orPrice[0].textContent = hall.hall_price_standart
let vipPrice = document.getElementsByClassName("conf-step__legend-value price-vip")
vipPrice[0].textContent = hall.hall_price_vip

let time = new Date()
let month = (time.getDate() <= day) ? (time.getMonth() +1) : ((time.getMonth() + 2) == 13 ? 1 : (time.getMonth() + 2))
let year = ((time.getMonth() + 1) < month) ? time.getFullYear() : (time.getFullYear() + 1)
time.setDate(day)
time.setMonth(month)
time.setFullYear(year)
let sTime = seanse.seance_time.split(":")
time.setHours(sTime[0], sTime[1], 0, 0)
console.log(time)
let startFilm = time.getTime()/1000
let send = `event=get_hallConfig&timestamp=${startFilm}&hallId=${hall.hall_id}&seanceId=${seanse.seance_id}`
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
        if(hall.hall_config == localStorage.getItem("conf")) {
            cr[0].insertAdjacentHTML("afterbegin", hall.hall_config)
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
                        price += parseInt(hall.hall_price_standart)
                    }
                    if(s.classList.contains("conf-step__chair_vip")){
                        price += parseInt(hall.hall_price_vip)
                    }
                } else {
                    s.classList.toggle("conf-step__chair_selected")
                    delete seats[`seat${numSelSeat}`]
                    if(s.classList.contains("conf-step__chair_standart")){
                        price -= parseInt(hall.hall_price_standart)
                    }
                    if(s.classList.contains("conf-step__chair_vip")){
                        price -= parseInt(hall.hall_price_vip)
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
            localStorage.setItem("hallId", hall.hall_id)
            localStorage.setItem("seansId", seanse.seance_id)
            localStorage.setItem("hallName", hall.hall_name)
            localStorage.setItem("time", JSON.stringify(startFilm))
            localStorage.setItem("price", price)
            localStorage.setItem("conf", str)
            localStorage.setItem("filmName", film.film_name)
            localStorage.setItem("start", seanse.seance_time)
            localStorage.setItem("prevAns", prevAns)
            location = "payment.html"
        }
            
    })
})        

let dubl = document.getElementsByClassName("conf-step")
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

