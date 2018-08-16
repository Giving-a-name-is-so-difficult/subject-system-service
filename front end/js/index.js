$(function () {
    //**************************登录界面操作*************************************
    let $login = $('#login')
    let $register = $('#register')
    $register.click(function () {
        $('.register').removeClass('register-hide')
        $('.login').addClass('login-hide')
    })
    $login.click(function () {
        let account = $('.login input').eq(0).val()
        let pwd = $('.login input').eq(1).val()
        if(account === '' || pwd === ''){
            alert("账号或密码不能为空！")
        }else if(account === '123456' && pwd === '123456'){
            window.location.href = './teacher.html'
        }else if(account === '12345678' && pwd === '12345678'){
            window.location.href = './student.html'
        }else{
            alert('账号或密码错误！')
        }
    })
    //**************************登录界面操作*************************************
})
