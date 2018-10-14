$(function () {
    let userName = getCookie('userName')
    let role = getCookie('role')
    if (role === 'teacher') {
        $('#nav_name').html(userName)
    } else {
        window.location.href = domain
    }
    $('#quit').click(() => {
        delCookie('userId')
        delCookie('userName')
        delCookie('role')
        delCookie('changeUserId')
        delCookie('changeUserName')
        delCookie('changeBelongClass')
        delCookie('oldExpId')
        window.location.href = domain
    })
    //我的课堂开始
    $('#my_course_title').click(() => {
        $('#all-course tbody').empty()
        $('.all_lesson').empty()
        $.ajax({
            type: "post",
            url: domain + 'teacher/getCourseByTeacherId',
            data: {
                "courseTeacherId": getCookie('userId')
            },
            success: function (msg) {
                if (msg.state === 'success') {
                    if (msg.data.length === 0) {
                        $('#all-course tbody').append('<h3>暂无数据</h3>')
                        $('.all_lesson').append('<h3>暂无数据</h3>')
                    } else {
                        for (let i = 0; i < msg.data.length; i++) {
                            let string = '<tr><td>'+msg.data[i].courseId+'</td><td>'+msg.data[i].courseName+'</td><td>'+msg.data[i].coursePersonNum+'</td><td width="250" style="text-align: center;"> <button class="btn btn-info manage-course" type="submit" style="margin-right: 20px" data-id='+msg.data[i].courseId+'>管理课堂</button> <button class="btn btn-danger del-course" type="submit">删除课堂</button> </td> </tr>'
                            let $node = $(string)
                            $('#all-course tbody').append($node)
                            let string2 = '<div class="radio"> <label> <input type="radio" name="lesson" value="'+msg.data[i].courseId+'">'+msg.data[i].courseName+'</label> </div>'
                            $('.all_lesson').append(string2)
                        }
                    }
                }else{
                    alert(msg.data)
                }
            },
            error: function (err) {
                alert('请求错误')
            }
        })
        $('#back').trigger('click')
    })
    $('#my_course_title').trigger('click')
    //我的课堂结束

    //我的课堂管理课堂开始
    $('#all-course tbody').delegate('.manage-course','click',function(){
        $(this).parents('table').addClass('hidden');
        $('.course-detail').removeClass('hidden')
        let courseId = $(this).parents('tr').children().eq(0).html()
        let courseName = $(this).parents('tr').find('td')[1].innerHTML
        $('#course_id_title').html('课堂ID:'+courseId+' 课堂名称：'+courseName)
        $('#experiment_now tbody').empty()
        $('.modal-body tbody').empty()
        $.ajax({
            type:'post',
            url:domain + 'teacher/getExp',
            data:{
                "courseId" :courseId
            },
            success:(msg)=>{
                if(msg.state === 'success'){
                    if(msg.data.length !==0){
                        for(let i=0;i<msg.data.length;i++){
                            let date = new Date(msg.data[i].expStartTime)
                            let newDate = new Date()
                            let string
                            if(msg.data[i].confirm){
                                string = $('<tr> <td>'+msg.data[i].expId+'</td> <td>'+msg.data[i].expName+'</td> <td>'+msg.data[i].expPersonNum+'</td> <td>'+msg.data[i].expPerson.length+'</td> ' +
                                    '<td><button class="btn btn-danger cancel-confirm-group" type="submit" style="margin-right: 20px">取消</button></td>' +
                                    '<td width="250" style="text-align: center;"> <button class="btn btn-info manage-experiment" type="submit" style="margin-right: 20px">管理实验</button> <button class="btn btn-danger del-experiment" type="submit">删除实验</button> </td> </tr>')
                            }else{
                                string = $('<tr> <td>'+msg.data[i].expId+'</td> <td>'+msg.data[i].expName+'</td> <td>'+msg.data[i].expPersonNum+'</td> <td>'+msg.data[i].expPerson.length+'</td> ' +
                                    '<td><button class="btn btn-info confirm-group" type="submit" style="margin-right: 20px">确认</button></td>' +
                                    '<td width="250" style="text-align: center;"> <button class="btn btn-info manage-experiment" type="submit" style="margin-right: 20px">管理实验</button> <button class="btn btn-danger del-experiment" type="submit">删除实验</button> </td> </tr>')
                            }


                            let str = $('<tr> <td>'+msg.data[i].expId+'</td> <td>'+msg.data[i].expName+'</td> <td>'+msg.data[i].expPersonNum+'</td> <td>'+msg.data[i].expPerson.length+'</td> <td width="250" style="text-align: center;"> <button class="btn btn-info change-in" type="submit" style="margin-right: 20px">移入</button>  </tr>')
                            $('#experiment_now tbody').append(string)
                            $('.modal-body tbody').append(str)
                        }
                    }else{
                        $('#experiment_now tbody').append('<h1>暂无实验</h1>')
                    }
                }else{
                    alert('数据库请求错误')
                }
            },
            error:(err)=>{
                alert('请求错误')
            }
        })
    })

    $('#experiment_now').delegate('.confirm-group','click',function () {
        let expId = $(this).parents('tr').children().eq(0).html()
        let button = $(this)
        button.attr('disabled','disabled')
        $.ajax({
            type:'post',
            url:domain + 'teacher/confirm',
            data:{
                expId:expId
            },
            success:function (msg) {
                if(msg.state ==='success'){
                    alert(msg.data)
                    let newButton = '<button class="btn btn-danger cancel-confirm-group" type="submit" style="margin-right: 20px">取消</button>'
                    button.replaceWith(newButton)
                }else if(msg.state === 'error'){
                    alert('后台错误')
                    button.removeAttr('disabled')
                }
            },
            error:function (err) {
                alert('请求错误')
                console.log(err);
                button.removeAttr('disabled')
            }
        })
    })
    $('#experiment_now').delegate('.cancel-confirm-group','click',function () {
        let expId = $(this).parents('tr').children().eq(0).html()
        let button = $(this)
        button.attr('disabled','disabled')
        $.ajax({
            type:'post',
            url:domain + 'teacher/cancelConfirm',
            data:{
                expId:expId
            },
            success:function (msg) {
                if(msg.state ==='success'){
                    alert(msg.data)
                    let newButton = '<button class="btn btn-info confirm-group" type="submit" style="margin-right: 20px">确认</button>'
                    button.replaceWith(newButton)
                }else if(msg.state === 'error'){
                    alert('后台错误')
                    button.removeAttr('disabled')
                }
            },
            error:function (err) {
                alert('请求错误')
                console.log(err);
                button.removeAttr('disabled')
            }
        })
    })


    $('#back').click(() => {
        $('#all-course').removeClass('hidden');
        $('.course-detail').addClass('hidden')
    });

    $('#my_course').delegate('.del-course','click',function () {
        let button = $(this)
        button.attr('disabled','disabled')
        let row = $(this).parents('tr')
        let courseId = $(this).parents('tr').children().eq(0).html()
        $.ajax({
            type:'post',
            url:domain + 'teacher/delCourse',
            data:{
                "courseId":courseId
            },
            success:function (msg) {
                if(msg.state === 'success'){
                    alert(msg.data)
                    row.remove()
                }else if(msg.state ==='error'){
                    alert('后台错误')
                    console.log(msg.data);
                }
            },
            error:function (err) {
                alert('请求错误')
                console.log(err);
            }
        })
    })

    //我的课堂管理课堂结束

    //管理实验开始
    $('#experiment_manage_title').click(function () {
        $('.exp-con').addClass('hidden')
    })
    $('#experiment_now').delegate('.manage-experiment','click',function () {
        $('.teacher-tab a').eq(3).tab('show')
        // $('.exp-con').removeClass('hidden')
        let expId = $(this).parents('tr').find('td')[0].innerHTML
        $.ajax({
            type:'post',
            url:domain + 'teacher/getExpById',
            data:{
                "expId":expId
            },
            success:function (msg) {
                $('.exp-con').removeClass('hidden')
                if(msg.state === 'success'){
                    $('.exp-con tbody').empty()
                    $('.exp-con #con_exp_name').html(msg.data.expName)
                    $('.exp-con #con_exp_id').html('实验编号：'+msg.data.expId)
                    $('.exp-con #con_exp_person').html('课堂容量：'+msg.data.expPersonNum)
                    $('.exp-con #con_exp_num').html('已选人数：'+msg.data.expPerson.length)
                    $('.exp-con #con_exp_time').html('实验时间：'+formatDate(msg.data.expStartTime)+'-'+msg.data.expTime)
                    for(let i=0;i<msg.data.expPerson.length;i++){
                        let string = '<tr> <td>'+msg.data.expPerson[i].userId+'</td> <td>'+msg.data.expPerson[i].userName+'</td> <td>'+msg.data.expPerson[i].belongClass+'</td> <td style="text-align: center;"><button class="btn btn-success change-group" style="width: 50px;margin-right: 10px;" data-toggle="modal" data-target="#change_group">换组</button><button class="btn btn-danger del-student" style="width: 50px;margin-right: 10px;">删除</button></td></tr>'
                        $('.exp-con tbody').append(string)
                    }
                }else if(msg.state === 'wrong'){
                    alert(msg.data)
                }else if(msg.state === 'error'){
                    alert('后台错误')
                    console.log(msg.data);
                }
            },
            error:function (err) {
                alert('请求错误')
                $('.exp-con').removeClass('hidden')
            }
        })
    })

    $('.exp-con').delegate('.del-student','click',function () {
        let button = $(this)
        button.attr('disabled','disabled')
        let row = button.parents('tr')
        let userId = button.parents('tr').children().eq(0).html()
        let expId = $('#con_exp_id').html().slice(5)
        $.ajax({
            type:'post',
            url:domain + 'teacher/delStudentById',
            data:{
                "expId":expId,
                "userId":userId
            },
            success:function (msg) {
                if(msg.state === 'success'){
                    alert(msg.data)
                    button.removeAttr('disabled')
                    row.remove()
                }else if(msg.state ==='error'){
                    alert('后台错误')
                    console.log(msg.data);
                    button.removeAttr('disabled')
                }
            },
            error:function (err) {
                alert('请求错误')
                console.log(err);
                button.removeAttr('disabled')
            }
        })
    })
    $('#change_group tbody').delegate('.change-in','click',function () {
        let button = $(this)
        button.attr('disabled','disabled')
        let newExpId = button.parents('tr').children().eq(0).html()
        $.ajax({
            type:'post',
            url:domain + 'teacher/changeGroup',
            data:{
                "newExpId" : newExpId,
                "oldExpId" : getCookie('oldExpId'),
                "userId" :	getCookie('changeUserId'),
                "userName" : getCookie('changeUserName'),
                "belongClass" : getCookie('changeBelongClass')
            },
            success:function (msg) {
                if(msg.state ==='success'){
                    alert(msg.data)
                    button.removeAttr('disabled')
                }else if(msg.state ==='wrong'){
                    alert(msg.data)
                    button.removeAttr('disabled')
                }else if(msg.state ==='error'){
                    alert('后台错误')
                    console.log(msg.data);
                    button.removeAttr('disabled')
                }
            },
            error:function (err) {
                alert('请求错误')
                console.log(err);
                button.removeAttr('disabled')
            }
        })
        $('#change_group').modal('toggle')
    })
    $('.exp-con').delegate('.change-group','click',function () {
        let button = $(this)
        button.attr('disabled','disabled')
        let row = button.parents('tr')
        let userId = row.children().eq(0).html()
        let changeUserName = row.children().eq(1).html()
        let changeBelongClass = row.children().eq(2).html()
        let oldExpId = $('#con_exp_id').html().slice(5)
        addCookie('changeUserId',userId)
        addCookie('changeUserName',changeUserName)
        addCookie('changeBelongClass',changeBelongClass)
        addCookie('oldExpId',oldExpId)
        row.remove()
        $('#change_group').modal('toggle')
    })

    $('#exp_manage_search').click(function () {
        $('.teacher-tab a').eq(3).tab('show')
        // $('.exp-con').removeClass('hidden')
        let expId = $('#exp_id2').val()
        $('#exp_id2').val('')
        $.ajax({
            type:'post',
            url:domain + 'teacher/getExpById',
            data:{
                "expId":expId
            },
            success:function (msg) {
                $('.exp-con').removeClass('hidden')
                if(msg.state === 'success'){
                    $('.exp-con tbody').empty()
                    $('.exp-con #con_exp_name').html(msg.data.expName)
                    $('.exp-con #con_exp_id').html('实验编号：'+msg.data.expId)
                    $('.exp-con #con_exp_person').html('课堂容量：'+msg.data.expPersonNum)
                    $('.exp-con #con_exp_num').html('已选人数：'+msg.data.expPerson.length)
                    $('.exp-con #con_exp_time').html('实验时间：'+formatDate(msg.data.expStartTime)+'-'+msg.data.expTime)
                    for(let i=0;i<msg.data.expPerson.length;i++){
                        // let string = '<tr> <td>'+msg.data.expPerson[i].userId+'</td> <td>'+msg.data.expPerson[i].userName+'</td> <td>'+msg.data.expPerson[i].belongClass+'</td> </tr>'
                        let string = '<tr> <td>'+msg.data.expPerson[i].userId+'</td> <td>'+msg.data.expPerson[i].userName+'</td> <td>'+msg.data.expPerson[i].belongClass+'</td> <td style="text-align: center;"><button class="btn btn-success change-group" style="width: 50px;margin-right: 10px;" data-toggle="modal" data-target="#change_group">换组</button><button class="btn btn-danger del-student" style="width: 50px;margin-right: 10px;">删除</button></td></tr>'
                        $('.exp-con tbody').append(string)
                    }
                }else if(msg.state === 'wrong'){
                    alert(msg.data)
                }else if(msg.state === 'error'){
                    alert('后台错误')
                    console.log(msg.data);
                }
            },
            error:function (err) {
                alert('请求错误')
                $('.exp-con').removeClass('hidden')
            }
        })
        return false
    })

    $('#search_student').click(function () {
        $(this).attr('disabled','disabled')
        let userId = $('#stu_id').val()
        if(userId === ''){
            alert('请输入学号')
            $('#search_student').removeAttr('disabled')
        }else{
            $.ajax({
                type:'post',
                url:domain + 'teacher/getStudentById',
                data:{
                    "userId" :	userId
                },
                success:function (msg) {
                    if(msg.state === 'success'){
                        let userId = $('.search-result span').eq(0)
                        let name = $('.search-result span').eq(1)
                        let belongClass = $('.search-result span').eq(2)
                        userId.html('学号：' + msg.data.userId)
                        name.html('姓名：' + msg.data.userName)
                        belongClass.html('班级：' + msg.data.belongClass)
                        $('#add_student').removeAttr('disabled','disabled')
                        $('#search_student').removeAttr('disabled')
                    }else{
                        let userId = $('.search-result span').eq(0)
                        let name = $('.search-result span').eq(1)
                        let belongClass = $('.search-result span').eq(2)
                        name.html(msg.data)
                        belongClass.html('')
                        userId.html('')
                        $('#add_student').attr('disabled','disabled')
                        $('#search_student').removeAttr('disabled')
                    }

                },
                error:function (err) {
                    alert('请求错误')
                    console.log(err);
                    $('#search_student').removeAttr('disabled')
                }
            })
        }
    })

    $('#add_student').click(function () {
        $(this).attr('disabled','disabled')
        let expContent = $('#con_exp_id').html()
        let courseId = expContent.slice(5,expContent.lastIndexOf('-'))
        let expId = expContent.slice(5)
        let userId = $('.search-result span').eq(0).html().slice(3)
        let name = $('.search-result span').eq(1).html().slice(3)
        let belongClass = $('.search-result span').eq(2).html().slice(3)
        $.ajax({
            type:'post',
            url:domain + 'teacher/pushExp',
            data:{
                "expId" : expId,
                "courseId" : courseId,
                "userId" :	userId,
                "userName" : name,
                "belongClass" : belongClass
            },
            success:function (msg) {
                if(msg.state === 'error'){
                    alert('后台错误')
                    console.log(msg.data);
                    $('#add_student').removeAttr('disabled')
                }else if(msg.state === 'wrong'){
                    alert(msg.data)
                    $('#add_student').removeAttr('disabled')
                }else{
                    alert(msg.data)
                    let str = '<tr> <td>'+userId+'</td> <td>'+name+'</td> <td>'+belongClass+'</td><td style="text-align: center;"><button class="btn btn-success change-group" style="width: 50px;margin-right: 10px;" data-toggle="modal" data-target="#change_group">换组</button><button class="btn btn-danger del-student" style="width: 50px;margin-right: 10px;">删除</button></td> </tr>'
                    $('.exp-con tbody').append(str)
                    $('#add_student').removeAttr('disabled')
                }
            },
            error:function (err) {
                alert('请求错误')
                console.log(err);
                $('#add_student').removeAttr('disabled')
            }
        })
        return false
    })

    $('#experiment_now').delegate('.del-experiment','click',function () {
        let button = $(this)
        button.attr('disabled','disabled')
        let expId = $(this).parents('tr').children().eq(0).html()
        let row = $(this).parents('tr')
        $.ajax({
            type:'post',
            url:domain + 'teacher/delExp',
            data:{
                "expId":expId
            },
            success:function (msg) {
                if(msg.state === 'success'){
                    alert(msg.data)
                    row.remove()
                }else if(msg.state ==='error'){
                    alert('后台错误')
                    console.log(msg.data);
                }
            },
            error:function (err) {
                alert('请求错误')
                console.log(err);
            }
        })


    })
    //导出到excel
    $('#export_to_excel').click(function () {
        // console.log($('#export_Excel tbody tr'));
        let rows = $('#export_excel tbody tr')
        let table = $('#export_excel_hidden tbody')
        table.empty()
        for(let i=0;i<rows.length;i++){
            let colums = rows.eq(i).find('td')
            let str = '<tr><td>'+colums.eq(0).html()+'_</td><td>'+colums.eq(1).html()+'</td><td>'+colums.eq(2).html()+'</td><td>   </td></tr>'
            table.append(str)
        }
        excel = new ExcelGen({
            "src_id": "export_excel_hidden",
            "show_header": true
        });
        excel.generate();
    })
    //管理实验结束

    $('#search_student').click(() => {
        $('.search-result').removeClass('hidden')
    })
    //统计开始
    $('#my_sta_title').click(() => {
        $('#all_course_statistics tbody').empty()
        $.ajax({
            type: "post",
            url: domain + 'teacher/getCourseByTeacherId',
            data: {
                "courseTeacherId": getCookie('userId')
            },
            success: function (msg) {
                if (msg.state === 'success') {
                    if (msg.data.length === 0) {
                        $('#all_course_statistics tbody').append('<h3>暂无数据</h3>')
                    } else {
                        for (let i = 0; i < msg.data.length; i++) {
                            let string = '<tr> <td>'+msg.data[i].courseId+'</td> <td>'+msg.data[i].courseName+'</td> <td>'+msg.data[i].coursePersonNum+'</td> <td width="250" style="text-align: center;"> <button class="btn btn-success launch" type="submit" style="margin-right: 20px">发起统计</button> <button class="btn btn-info query" type="submit">查看统计</button></td> </tr>'
                            let $node = $(string)
                            $('#all_course_statistics tbody').append($node)
                        }
                    }
                }else{
                    alert(msg.data)
                }
            },
            error: function (err) {
                alert('请求错误')
            }
        })
        $('#all_course_statistics').removeClass('hidden')
        $('.launch-detail').addClass('hidden')
        $('.sta-result').addClass('hidden')
        $('.sta-result-painting').addClass('hidden')
        // $('.launch-result-back').trigger('click')
        // $('.launch-result-painting-back').trigger('click')
    })
    $('#all_course_statistics tbody').delegate('.launch','click',function () {
        let courseId = $(this).parents('tr').children('td')[0].innerHTML;
        addCookie('courseId',courseId)
        $('#all_course_statistics').addClass('hidden');
        $('.launch-detail').removeClass('hidden')
    })
    $('#all_course_statistics tbody').delegate('.query','click',function () {
        let courseId = $(this).parents('tr').children('td')[0].innerHTML;
        $('#all_course_statistics').addClass('hidden');
        $.ajax({
            type:'post',
            url:domain + 'teacher/getStatistic',
            data:{
                "courseId" :courseId
            },
            success:function (msg) {
                if(msg.state === 'success'){
                    $('#sta_result tbody').empty()
                    if(msg.data.length === 0){
                        alert('暂无数据')
                        $('.launch-result-back').trigger('click')
                    }else{
                        for(let i=0;i<msg.data.length;i++){
                            let str = '<tr> <td>'+msg.data[i].expName+'</td> <td>'+formatDate(msg.data[i].expStartTime)+'</td> <td>'+formatDate(msg.data[i].expEndTime)+'</td> <td width="250" style="text-align: center;"> <button class="btn btn-info query-sta" type="submit" data-id="'+msg.data[i]._id+'">查看结果</button>  <button class="btn btn-danger delSta" type="submit" style="margin-right: 20px" data-id="'+msg.data[i]._id+'">删除统计</button></td> </tr>'
                            $('#sta_result tbody').append(str)
                        }
                        $('.sta-result').removeClass('hidden')
                    }
                }else if(msg.state === 'error'){
                    alert('数据库请求错误')
                }
            },
            error:function (err) {
                alert('请求错误')
                console.log(err);
            }
        })
    })
    $('#sta_result').delegate('.query-sta','click',function () {
        $('.sta-result').addClass('hidden')
        let staId = $(this).data('id')
        $.ajax({
            type:'post',
            url:domain + 'teacher/getStatisticByStaId',
            data:{
                "id":staId
            },
            success:function (msg) {
                if(msg.state === 'success'){
                    let title = msg.data.expName
                    let labels = []
                    let data = []
                    let NumChar = {
                        一:1,
                        二:2,
                        三:3,
                        四:4,
                        五:5,
                        六:6,
                        日:7
                    }
                    for(let i=0;i<msg.data.staResult.length;i++){
                        if(msg.data.staResult[i].time[3] === '上'){
                            msg.data.staResult[i].weekday = NumChar[msg.data.staResult[i].time[1]]
                            msg.data.staResult[i].classNum = 6
                        }else if(msg.data.staResult[i].time[3] === '下'){
                            msg.data.staResult[i].weekday = NumChar[msg.data.staResult[i].time[1]]
                            msg.data.staResult[i].classNum = 7
                        } else{
                            msg.data.staResult[i].weekday = NumChar[msg.data.staResult[i].time[1]]
                            msg.data.staResult[i].classNum = NumChar[msg.data.staResult[i].time[4]]
                        }
                    }

                    function multisort(array, ...compairers) {
                        return array.sort((a, b) => {
                            for (const c of compairers) {
                                const r = c(a, b);
                                if (r !== 0) {
                                    return r;
                                }
                            }
                        });
                    }
                    multisort(msg.data.staResult,
                        (a, b) => a.weekday - b.weekday,
                        (a, b) => a.classNum - b.classNum
                    );

                    for(let i=0;i<msg.data.staResult.length;i++){
                        labels.push(msg.data.staResult[i].time)
                        data.push(msg.data.staResult[i].num)
                    }
                    // 统计图绘制
                    $('#paint_block').empty()
                    $('#paint_block').append('<canvas id="result_bar"></canvas>')
                    let ctx = $('#result_bar')
                    new Chart(ctx, {
                        "type": "horizontalBar",
                        "data": {
                            "labels":labels,
                            "datasets": [{
                                "label": title,
                                "data": data,
                                "fill": false,
                                "backgroundColor": ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)"],
                                "borderColor": ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)"],
                                "borderWidth": 1
                            }]
                        },
                        "options": {"scales": {"xAxes": [{"ticks": {"beginAtZero": true}}]}}
                    });
                    $('.sta-result-painting').removeClass('hidden')
                }else if(msg.state ==='wrong'){
                    alert(msg.data)
                    $('.launch-result-painting-back').trigger('click')
                }else if(msg.state ==='error'){
                    alert('后台错误')
                    console.log(msg.data);
                    $('.launch-result-painting-back').trigger('click')
                }
            },
            error:function (err) {
                alert('请求错误')
                console.log(err);
                $('.launch-result-painting-back').trigger('click')
            }
        })
    })
    $('#sta_result').delegate('.delSta','click',function () {
        let button = $(this)
        let row = button.parents('tr')
        button.addClass("disabled")
        let staId = $(this).data('id')
        $.ajax({
            type:'post',
            url:domain + 'teacher/delStatistic',
            data:{
                "staId":staId
            },
            success:function (msg) {
                if(msg.state ==="success"){
                    alert(msg.data)
                    row.remove()
                }else if(msg.state === "wrong"){
                    alert(msg.data)
                    button.removeClass('disabled')
                }else{
                    alert(msg.data)
                }
            },
            error:function (err) {
                alert('请求错误')
                console.log(err);
            }
        })
    })
    $('.launch-result-painting-back').click(function () {
        $('.sta-result').removeClass('hidden')
        $('.sta-result-painting').addClass('hidden')
    })
    $('.launch-back').click(() => {
        $('#all_course_statistics').removeClass('hidden')
        $('.launch-detail').addClass('hidden')
    })
    $('.launch-result-back').click(() => {
        $('#all_course_statistics').removeClass('hidden');
        $('.sta-result').addClass('hidden')
    })
    $('.launch-sta').click(() => {
        let forms = $('.launch-detail form input')
        let expName = forms.eq(0).val()
        let expStartTime = forms.eq(1).val()
        let expEndTime = forms.eq(2).val()
        let mode = $("#vote_mode input:checked").val()
        let courseId = getCookie('courseId')
        let teacherId = getCookie('userId')
        let teacherName = getCookie('userName')
        if(expName === ''|| expStartTime === '' || expEndTime === ''){
            alert('请输入完整的信息')
        }else{
            $.ajax({
                type:'post',
                url: domain + 'teacher/setStatistic',
                data:{
                    "expName":expName,
                    "expStartTime" : expStartTime,
                    "expEndTime" : expEndTime,
                    "courseId" :courseId,
                    "teacherId" : teacherId,
                    "teacherName" : teacherName,
                    "mode":mode
                },
                success:function (msg) {
                    if(msg.state === 'success'){
                        alert(msg.data)
                    }else if(msg.state === 'error'){
                        alert(msg.data)
                    }
                },
                error:function (err) {
                    alert('请求错误')
                }
            })
        }
    })




    //统计结束




    //课堂设置开始
    $('#course_set button').click(() => {
        $('#course_set button').attr('disabled', 'disabled')
        let forms = $('#course_set input')
        let id1 = forms.eq(0).val().trim()
        let id2 = forms.eq(1).val().trim()
        let courseName = forms.eq(2).val().trim()
        let num = forms.eq(3).val().trim()
        if (id1 === '' || id2 === '' || courseName === '' || num === '') {
            alert('请输入完整的课堂信息')
            $('#course_set button').removeAttr('disabled')
        } else {
            $.ajax({
                type: "post",
                url: domain + 'teacher/setCourse',
                data: {
                    "courseId": id1 + '-' + id2,
                    "courseName": courseName,
                    "courseTeacher": getCookie('userName'),
                    "courseTeacherId": getCookie('userId'),
                    "coursePersonNum": num
                },
                success: function (msg) {
                    $('#course_set button').removeAttr('disabled')
                    if (msg.state === 'success') {
                        alert(msg.data)
                    } else if (msg.state === 'wrong') {
                        alert(msg.data)
                    } else {
                        alert(msg.data)
                    }
                },
                error: function (err) {
                    $('#course_set button').removeAttr('disabled')
                    alert('请求错误')
                }
            })
        }
    })
    //课堂设置结束

    //实验设置开始
    $('#experiment_set_title').click(function () {
        $.ajax({
            type: "post",
            url: domain + 'teacher/getCourseByTeacherId',
            data: {
                "courseTeacherId": getCookie('userId')
            },
            success: function (msg) {
                if (msg.state === 'success') {
                    $('.all_lesson').empty()
                    for (let i = 0; i < msg.data.length; i++) {
                        let string2 = '<div class="radio"> <label> <input type="radio" name="lesson" value="'+msg.data[i].courseId+'">'+msg.data[i].courseName+'</label> </div>'
                        $('.all_lesson').append(string2)
                    }
                }else{
                    alert(msg.data)
                }
            },
            error: function (err) {
                alert('请求错误')
            }
        })
    })
    $('#launch_exp').click(function () {
        $(this).attr('disabled','disabled')
        let courseId = $('#experiment_set .all_lesson input:radio:checked').val()
        let expTime = $('#exp_time').val()
        let expName = $('#experiment_manage_name').val()
        let experiment_manage_bg_date = $('#experiment_manage_bg_date').val()
        let experiment_manage_num = $('#experiment_manage_num').val()
        let teacherId = getCookie('userId')
        let teacherName = getCookie('userName')
        // console.log(courseId);
        // console.log(expTime);
        // console.log(expName);
        // console.log(experiment_manage_bg_date);
        // console.log(experiment_manage_num);
        if(courseId === ''||courseId === undefined || expTime === ''||expTime === undefined || expName === '' || experiment_manage_bg_date === '' || experiment_manage_num === ''){
            alert('请输入完整信息')
            $('#launch_exp').removeAttr('disabled')
        }else{
            $.ajax({
                type:'post',
                url:domain + 'teacher/setExp',
                data:{
                    "expName":expName,
                    "expStartTime" : experiment_manage_bg_date,
                    "expTime" : expTime,
                    "expPersonNum" : experiment_manage_num,
                    "courseId" :courseId,
                    "teacherId" : teacherId,
                    "teacherName" : teacherName
                },
                success:function (msg) {
                    $('#launch_exp').removeAttr('disabled')
                    if(msg.state === 'success'){
                        alert(msg.data)
                    }else if(msg.state === 'error'){
                        alert('数据库请求错误')
                        console.log(msg.data);
                    }
                },
                error:function (err) {
                    $('#launch_exp').removeAttr('disabled')
                    alert('请求错误')
                    console.log(err);
                }
            })
        }

    })
    //实验设置结束


})