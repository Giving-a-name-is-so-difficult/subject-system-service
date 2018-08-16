$(function () {
    let role = getCookie('role')
    if(role === 'student'){
        window.location.href = domain + 'student'
    }else if(role === 'teacher'){
        window.location.href = domain + 'teacher'
    }
    let $login = $('#login')
    let $register_tea = $('#register_tea')
    let $register_stu = $('#register_stu')
    let $change_to_reg = $('#change_to_reg')
    let $change_to_log = $('#change_to_log')
    //教师注册
    $register_tea.click(function () {
        $register_tea.addClass('disabled')
        let form = $('#register_mask #home input')
        let userId = form.eq(0).val()
        let userName = form.eq(1).val()
        let password = form.eq(2).val()
        if (userId === '' || userName === '' || password === '') {
            alert('请输入完整的个人信息')
            $register_tea.removeClass('disabled')
        } else {
            $.ajax({
                url: domain + 'registerAndLogin/register',
                type: 'post',
                data: {
                    userId: userId,
                    userName: userName,
                    password: password,
                    role: 'teacher'
                },
                success: (msg) => {
                    $register_tea.removeClass('disabled')
                    if (msg.state === 'success') {
                        //{userId: "201303010309", userName: "1", role: "teacher"}
                        // addCookie('userId',msg.data.userId)
                        // addCookie('userName',msg.data.userName)
                        // addCookie('role',msg.data.role)
                        // window.location.href = domain + 'teacher'
                        alert('注册成功，请登录')
                        $change_to_log.trigger('click')
                    } else if (msg.state === 'wrong') {
                        alert('该账号已注册')
                    } else {
                        alert('数据库请求错误')
                        console.log(msg.data);
                    }
                },
                error: (err) => {
                    $register_tea.removeClass('disabled')
                    alert('请求错误')
                    console.log(err);
                }
            })
        }

    })
    //学生注册
    $register_stu.click(function () {
        $register_stu.addClass('disabled')
        let form = $('#register_mask #profile input')
        let userId = form.eq(0).val()
        let userName = form.eq(1).val()
        let belongClass  = form.eq(2).val()
        let password = form.eq(3).val()
        if (userId === '' || userName === '' || password === ''||belongClass === '') {
            alert('请输入完整的个人信息')
            $register_stu.removeClass('disabled')
        } else {
            $.ajax({
                url: domain + 'registerAndLogin/register',
                type: 'post',
                data: {
                    userId: userId,
                    userName: userName,
                    password: password,
                    role: 'student',
                    belongClass:belongClass
                },
                success: (msg) => {
                    $register_stu.removeClass('disabled')
                    if (msg.state === 'success') {
                        alert('注册成功，请登录')
                        $change_to_log.trigger('click')
                    } else if (msg.state === 'wrong') {
                        alert('该账号已注册')
                    } else {
                        alert('数据库请求错误')
                        console.log(msg.data);
                    }
                },
                error: (err) => {
                    $register_stu.removeClass('disabled')
                    alert('请求错误')
                    console.log(err);
                }
            })
        }

    })
    //登录
    $login.click(()=>{
        $login.attr('disabled','disabled')
        let form = $('#login_mask #login-form input')
        let userId = form.eq(0).val()
        let password = form.eq(1).val()
        if(userId === ''||password === ''){
            alert('请输入完整信息')
            $login.removeAttr('disabled')
        }else{
            $.ajax({
                type:'post',
                url:domain + 'registerAndLogin/login',
                data:{
                    userId:userId,
                    password:password
                },
                success:(msg)=>{
                    $login.removeAttr('disabled')
                    if(msg.state === 'success'){
                        addCookie('userName',msg.data.userName)
                        addCookie('userId',msg.data.userId)
                        addCookie('role',msg.data.role)
                        addCookie('belongClass',msg.data.belongClass)
                        if(msg.data.role === 'teacher'){
                            window.location.href = domain + 'teacher'
                        }else if(msg.data.role === 'student'){
                            window.location.href = domain + 'student'
                        }
                    }else if(msg.state === 'wrong'){
                        alert(msg.data)
                    }else{
                        alert('数据库请求错误')
                    }
                },
                error:(err)=>{
                    $login.removeAttr('disabled')
                    alert('请求错误')
                }
            })
        }

    })
    $change_to_reg.click(() => {
        $('#login_mask').addClass('hidden')
        $('#register_mask').removeClass('hidden')
    })
    $change_to_log.click(() => {
        $('#register_mask').addClass('hidden')
        $('#login_mask').removeClass('hidden')
    })

})