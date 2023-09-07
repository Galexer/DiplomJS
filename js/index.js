localStorage.clear()
let send = `event=update`
let date = new Date()
let midnight = date.setHours(0, 0, 0, 0)
let dayMs = date.setHours(0, 0, 0, 0)
let oneDayMs = 86_400_000
let dayWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
let chooseDay
let timeInS
let nav = document.getElementsByClassName("page-nav")
let nawLink = document.getElementsByClassName("page-nav__day")

//навигация по дням
for(n of nawLink){
    n.classList.remove("page-nav__day_chosen")
    n.classList.remove("page-nav__day_weekend")
}
for(let i = 0; i < nawLink.length; i++){
    let weekDayNum = new Date(dayMs).getDay()
    let dayNum = new Date(dayMs).getDate()
    nawLink[i].insertAdjacentHTML(`afterbegin` ,`<span class="page-nav__day-week">${dayWeek[weekDayNum]}</span><span class="page-nav__day-number">${dayNum}</span>`)

    let day = nawLink[i]

    if( weekDayNum == 0 || weekDayNum == 6){
        day.classList.add("page-nav__day_weekend")
    }
    if(i === 0) {
        day.classList.add("page-nav__day_today", "page-nav__day_chosen")
    }
    let chooseDay1 = dayMs

    day.addEventListener("click", ()=> {
        for(n of nawLink){
            n.classList.remove("page-nav__day_chosen")
        }
        day.classList.add("page-nav__day_chosen")
        chooseDay = chooseDay1
    })
    dayMs += oneDayMs
}

//отрисовка фильмов
let main = document.getElementById("main")
let seansNum = 0
request(send).then( a => {
        let films = a.films.result
        console.log(chooseDay)
        for(f of films){
            postermaker(f)

            let seans = document.getElementById(`movie_result_${f.film_id}`)
            let hall;
            
            for (h of a.halls.result) {
                if(h.hall_open == 0) {
                    continue
                }
                let first = 1
                for(s of a.seances.result){
                    
                    if(h.hall_id === s.seance_hallid && f.film_id === s.seance_filmid) {   
                        
                        if(first){
                            seans.insertAdjacentHTML(`beforeend`, 
                                `<div class="movie-seances__hall">
                                 <h3 class="movie-seances__hall-title">${h.hall_name}</h3>
                                 <ul id="${h.hall_name}" class="movie-seances__list"></ul></div>`)
                            hall = document.getElementById(`${h.hall_name}`)
                            first = 0
                        }
                        hall.insertAdjacentHTML(`beforeend`, `<li class="movie-seances__time-block"><a id="film_${h.hall_id}_${s.seance_id}_${f.film_id}" class="movie-seances__time" href="hall.html">${s.seance_time}</a></li>`)                     
                    }   
                }
                //first = 1
            }
            
        }

        //listener для сеансов
        let link = document.getElementsByClassName("movie-seances__time")
        for (let i = 0; i < link.length; i++) {
            link[i].addEventListener("click", ()=> { 
                
                let info = link[i].id.split("_")

                a.halls.result.forEach(e => {
                    if(e.hall_id == info[1]){
                        localStorage.setItem("hall", JSON.stringify(e))
                    }
                }); 
                a.seances.result.forEach(e => {
                    if(e.seance_id == info[2]){
                        localStorage.setItem("seans", JSON.stringify(e))
                        timeInS = Math.round(chooseDay/1000) + (parseInt(e.seance_start) * 60)
                        localStorage.setItem("timestamp", timeInS)
                    }
                });
                a.films.result.forEach(e => {
                    if(e.film_id == info[3]){
                        localStorage.setItem("film", JSON.stringify(e))
                    }
                });
                
            })
            
        }

        //сегодня уже прошли        
        let navPan = document.getElementsByClassName("page-nav")
        let seanseLink = document.getElementsByClassName("movie-seances__time-block")
        if(nawLink[0].classList.contains("page-nav__day_today")) {
            setColor(seanseLink)
        }
        
        navPan[0].addEventListener('click', () => {
            if(!nawLink[0].classList.contains("page-nav__day_chosen")) {
                for(i = 0; i < seanseLink.length; i++){ 
                    seanseLink[i].children[0].style.backgroundColor = 'white'
                    seanseLink[i].setAttribute("onclick", "return true")
                }
            } else {
                setColor(seanseLink)
            }
        })

})    


function postermaker(f) {
    main.insertAdjacentHTML(`afterbegin`, `<section id="movie_result_${f.film_id}"  class="movie">
    <div class="movie__info">
        <div class="movie__poster">
            <img class="movie__poster-image" alt="${f.film_name} постер" src="${f.film_poster}">
        </div> 
        <div class="movie__description">
            <h2 class="movie__title">${f.film_name}</h2>
            <p class="movie__synopsis">${f.film_description}</p>
            <p class="movie__data">
                <span class="movie__data-duration">${f.film_duration}</span>
                <span class="movie__data-origin">${f.film_origin}</span>
            </p>
        </div>
    </div>  
</section>`)
}

function setColor(seanseLink){
    for(i = 0; i < seanseLink.length; i++){
        let times = seanseLink[i].textContent.split(":")
        let timeInSec = ((parseInt(times[0]) * 60 + parseInt(times[1])) * 60) + Math.round((midnight/1000))
        let now = Math.round(new Date().getTime() / 1000)
        if(timeInSec <= now) {
            seanseLink[i].children[0].style.backgroundColor = 'grey'
            seanseLink[i].setAttribute("onclick", "return false")
        }               
    }
}