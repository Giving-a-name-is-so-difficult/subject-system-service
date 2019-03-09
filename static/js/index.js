const domain = 'http://127.0.0.1:8080/'
// const domain = ' http://subject.ngrok.xiaomiqiu.cn/'
// const domain = ' http://59.67.228.242/'
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
//底部版权信息处理
function copyRightUpdate() {
    let date = new Date()
    let year = date.getFullYear()
    if (year === 2018){
        let string  = '&copy;2018 华北电力大学（保定） 版权所有 '
        $('.footer .f-up').html(string)
    }else{
        let string  = '&copy;2018-'+year+' 华北电力大学（保定） 版权所有 '
        $('.footer .f-up').html(string)
    }

}
copyRightUpdate()

