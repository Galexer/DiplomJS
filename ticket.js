document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.length == 0){
        location.replace("index.html")
    }
  })


let data = localStorage.getItem("forQR")
data = JSON.parse(data)
let part = data.split(`\n\n`)

let film = document.getElementsByClassName("ticket__details ticket__title")
film[0].textContent = part[0].slice(part[0].indexOf(":"))
let seat = document.getElementsByClassName("ticket__details ticket__chairs")
seat[0].textContent = part[1].slice(part[1].indexOf(":"))
let hall = document.getElementsByClassName("ticket__details ticket__hall")
hall[0].textContent = part[2].slice(part[2].indexOf(":"))
let start = document.getElementsByClassName("ticket__details ticket__start")
start[0].textContent = part[3].slice(part[3].indexOf(":") + 1)

let qr = QRCreator(data).result
qr.classList.add("ticket__info-qr")
let qrCode = document.getElementsByClassName("ticket__info-qr")
qrCode[0].replaceWith(qr)

window.addEventListener('beforeunload', function () {
    localStorage.clear()
  })