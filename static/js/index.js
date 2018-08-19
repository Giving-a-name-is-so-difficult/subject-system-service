const domain = 'http://127.0.0.1/'
// const domain = ' http://xiaoming.ngrok.xiaomiqiu.cn/'
function addCookie(key, value) {
    document.cookie = key + '=' + value
}
function getCookie(key) {
    let cookies = document.cookie.split(';');
    for(let i=0;i<cookies.length;i++){
        let temp = cookies[i].split('=')
        if(temp[0].trim() === key){
            return temp[1]
        }
    }
}
function delCookie(key) {
    let date = new Date()
    date.setDate(date.getDate()-1)
    document.cookie = key+'=;expires='+date.toGMTString()
}
function formatDate(str) {
    let date = new Date(str)
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()
    let time = year +'-'+month+'-'+day
    return time
}

