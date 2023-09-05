let request = (send) => {
    return new Promise ((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://jscp-diplom.netoserver.ru/')
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        xhr.responseType = 'json'
        xhr.send(send)
        xhr.onreadystatechange = function () {
            if(xhr.readyState === xhr.DONE) {
                resolve(xhr.response)                
            }
        }
        xhr.onerror = () => reject(xhr.statusText)
    })   
}