$(function () {
    let userName = getCookie('userName')
    let role = getCookie('role')
    if (role === 'student') {
        $('#nav_name').html(userName)
    } else {
        window.location.href = domain
    }
    $('#quit').click(() => {
        delCookie('userId')
        delCookie('userName')
        delCookie('role')
        delCookie('courseId')
        delCookie('sta_courseId')
        delCookie('_id')
        delCookie('expId')
        window.location.href = domain
    })

    //我的课堂开始
    $('#my_course_title').click(function () {
        $('#all-course tbody').empty()
        let userId = getCookie('userId')
        $.ajax({
            type: 'post',
            url: domain + 'student/getCourse',
            data: {
                userId: userId
            },
            success: function (msg) {
                if (msg.state === 'success') {
                    if (msg.data.selectCourse.length === 0) {
                        $('#all-course tbody').append('<tr><td>暂无数据</td></tr>')
                    } else {
                        for (let i = 0; i < msg.data.selectCourse.length; i++) {
                            let string = '<tr> <td>' + msg.data.selectCourse[i].courseId + '</td><td>' + msg.data.selectCourse[i].courseName + '</td> <td>' + msg.data.selectCourse[i].courseTeacher + '</td> <td width="250" style="text-align: center;"> <button class="btn btn-info getin-course" style="margin-right: 20px">进入课堂</button> <button class="btn btn-danger quit-course" >退出课堂</button> </td></tr>'
                            $('#all-course tbody').append(string)
                        }
                    }
                } else if (msg.state === 'wrong') {
                    alert(msg.data)
                } else if (msg.state === 'error') {
                    alert('后台错误')
                    console.log(msg.data);
                }
            },
            error: function (err) {
                alert('请求错误')
                console.log(err);
            }
        })
        $('#back').trigger('click')
    })
    $('#my_course_title').trigger('click')

    $('#my_course').delegate('.getin-course', 'click', function () {
        $('#all-course').addClass('hidden')
        $('#experiment_now tbody').empty()
        let courseId = $(this).parents('tr').find('td')[0].innerHTML
        let courseName = $(this).parents('tr').find('td')[1].innerHTML
        let userId = getCookie('userId')
        $.ajax({
            type: 'post',
            url: domain + 'student/getExpByUserIdAndCourseId',
            data: {
                "courseId": courseId,
                "userId": userId
            },
            success: function (msg) {
                if (msg.state === 'success') {
                    $('#course_id_title').html('课堂ID:' + courseId + ' 课堂名称：' + courseName)
                    for (let i = 0; i < msg.data.length; i++) {
                        let date = new Date(msg.data[i].expStartTime)
                        let year = date.getFullYear()
                        let month = date.getMonth() + 1
                        let day = date.getDate()
                        let time = year + '-' + month + '-' + day
                        let string = '<tr> <td>' + msg.data[i].expId + '</td> <td>' + msg.data[i].expName + '</td> <td>' + time + '  ' + msg.data[i].expTime + '</td> <td width="250" style="text-align: center;"> <button class="btn btn-danger del-experiment" type="submit">删除实验</button> </td> </tr>'
                        $('#experiment_now tbody').append(string)
                    }
                    $('.course-detail').removeClass('hidden')
                } else if (msg.state === 'wrong') {
                    $('#course_id_title').html('课堂ID:' + courseId + ' 课堂名称：' + courseName)
                    alert(msg.data)
                    $('.course-detail').removeClass('hidden')
                } else if (msg.state === 'error') {
                    $('#course_id_title').html('课堂ID:' + courseId + ' 课堂名称：' + courseName)
                    alert('后台错误')
                    console.log(msg.data);
                    $('.course-detail').removeClass('hidden')
                }
            },
            error: function (err) {
                alert('请求错误')
                console.log(err);
            }
        })
    })

    $('#all-course').delegate('.quit-course', 'click', function () {
        let courseId = $(this).parents('tr').children().eq(0).html()
        $(this).attr('disabled', 'disabled')
        let button = $(this)
        let row = $(this).parents('tr')
        $.ajax({
            type: 'post',
            url: domain + 'student/quitCourse',
            data: {
                "userId": getCookie('userId'),
                "courseId": courseId
            },
            success: function (msg) {
                button.removeAttr('disabled')
                if (msg.state === 'success') {
                    alert(msg.data)
                    row.remove()
                } else if (msg.state === 'wrong') {
                    alert(msg.data)
                } else if (msg.state === 'error') {
                    alert('请求错误')
                    console.log(msg.data);
                }
            },
            error: function (err) {
                alert('请求错误')
                console.log(err);
                button.removeAttr('disabled')
            }
        })
    })
    //我的课堂结束

    //参与统计开始
    $('#join_sta_title').click(function () {
        $('#all_course_statistics tbody').empty()
        let userId = getCookie('userId')
        $.ajax({
            type: 'post',
            url: domain + 'student/getCourse',
            data: {
                userId: userId
            },
            success: function (msg) {
                if (msg.state === 'success') {
                    if (msg.data.selectCourse.length === 0) {
                        $('#all_course_statistics tbody').append('<tr><td>暂无数据</td></tr>')
                    } else {
                        for (let i = 0; i < msg.data.selectCourse.length; i++) {
                            let str = '<tr> <td>' + msg.data.selectCourse[i].courseId + '</td> <td>' + msg.data.selectCourse[i].courseName + '</td> <td>' + msg.data.selectCourse[i].courseTeacher + '</td> <td width="250" style="text-align: center;"> <button class="btn btn-success look" type="submit">查看统计</button> </td> </tr>'
                            $('#all_course_statistics tbody').append(str)
                        }
                    }
                } else if (msg.state === 'wrong') {
                    alert(msg.data)
                } else if (msg.state === 'error') {
                    alert('后台错误')
                    console.log(msg.data);
                }
            },
            error: function (err) {
                alert('请求错误')
                console.log(err);
            }
        })
        $('#sta_detail_back').trigger('click')
    })
    $('#all_course_statistics').delegate('.look', 'click', function () {
        $('#all_course_statistics').addClass('hidden')
        $('#statistics_info tbody').empty()
        let courseId = $(this).parents('tr').children().eq(0).html()
        addCookie('sta_courseId', courseId)
        $.ajax({
            type: 'post',
            url: domain + 'teacher/getStatistic',
            data: {
                "courseId": courseId
            },
            success: function (msg) {
                if (msg.state === 'error') {
                    alert('后台错误')
                    console.log(msg.data);
                    $('#sta_detail_back').trigger('click')
                } else if (msg.state === 'success') {
                    if (msg.data.length === 0) {
                        alert('暂无统计')
                        $('#sta_detail_back').trigger('click')
                    } else {
                        let allSta = msg.data
                        $.ajax({
                            type:"post",
                            url: domain + 'student/getStuSta',
                            data: {
                                "userId":getCookie("userId"),
                                "courseId":courseId
                            },
                            success:function (msg) {
                                if(msg.state === 'success'){
                                    let selectedSta = msg.data
                                    for(let i=0;i<selectedSta.length;i++){
                                        for(let j=0;j<allSta.length;j++){
                                            if(allSta[j]._id === selectedSta[i].staId){
                                                allSta[j].isSelected = true
                                            }
                                        }
                                    }
                                    for (let i = 0; i < allSta.length; i++) {
                                        let begin = formatDate(allSta[i].expStartTime)
                                        let end = formatDate(allSta[i].expEndTime)
                                        if(allSta[i].isSelected){
                                            let str = '<tr> <td>' + allSta[i].expName + '</td> <td>' + begin + ' 至 ' + end + '</td> <td width="250" style="text-align: center;"><button type="button" class="btn btn-success vote disabled">已投票 </button> </td> </tr>'
                                            $('#statistics_info tbody').append(str)
                                        }else{
                                            let str = '<tr> <td>' + allSta[i].expName + '</td> <td>' + begin + ' 至 ' + end + '</td> <td width="250" style="text-align: center;"><button type="button" class="btn btn-success vote" data-toggle="modal" data-target="#myModal" data-id="' + allSta[i]._id + '">投票 </button> </td> </tr>'
                                            $('#statistics_info tbody').append(str)
                                        }
                                    }
                                    $('#sta_detail').removeClass('hidden')

                                }else{
                                    alert('后台错误')
                                    console.log(msg.data);
                                    $('#sta_detail_back').trigger('click')
                                }
                            },
                            error:function (err) {
                                alert('请求错误')
                                console.log(err);
                                $('#sta_detail_back').trigger('click')
                            }
                        })
                    }
                }
            },
            error: function (err) {
                alert('请求错误')
                console.log(err);
                $('#sta_detail_back').trigger('click')
            }
        })
    })

    $('#statistics_info').delegate('.vote', 'click', function () {
        let _id = $(this).data('id')
        window.voteButton = $(this)
        $('.student-modal-body').empty()
        let $node = $(` <form class="form-inline select-modal" style="margin-bottom: 10px;">
                    <select class="form-control">
                        <option>周一</option>
                        <option>周二</option>
                        <option>周三</option>
                        <option>周四</option>
                        <option>周五</option>
                        <option>周六</option>
                        <option>周日</option>
                    </select>-
                    <select class="form-control">
                        <option>第一大节</option>
                        <option>第二大节</option>
                        <option>第三大节</option>
                        <option>第四大节</option>
                        <option>第五大节</option>
                        <option>上午</option>
                        <option>下午</option>
                    </select>
                    <button class="btn btn-danger modal-del">删除</button>
                </form>`)
        $('.student-modal-body').append($node)
        addCookie('_id', _id)
    })
    $('.modal-dialog').delegate('.modal-del','click',function () {
        $(this).parents('form').remove()
        return false
    })

    $('#model_submit').click(function () {
        // console.log($('.select-modal option:selected').eq(1).val());
        let sets = []
        for (let i = 0; i < $('.select-modal').length; i++) {
            let time = $('.select-modal').eq(i).find('option:selected').eq(0).val() + ' ' + $('.select-modal').eq(i).find('option:selected').eq(1).val()
            sets.push(time)
        }
        let times = Array.from(new Set(sets))
        let button = $(this)
        button.attr('disabled', 'disabled')
        $.ajax({
            type: 'post',
            url: domain + 'student/vote',
            data: {
                "userId": getCookie('userId'),
                "staId": getCookie('_id'),
                "courseId": getCookie('sta_courseId'),
                "times": times
            },
            success: function (msg) {
                if (msg.state === 'error') {
                    alert('后台错误')
                    console.log(msg.data);
                } else {
                    alert(msg.data)
                    $('#myModal').modal('hide')
                    voteButton.html('已投票')
                    voteButton.attr('disabled','disabled')
                    window.voteButton = null
                }
                $('#model_submit').removeAttr('disabled')
            },
            error: function (err) {
                alert('请求错误')
                console.log(err);
                $('#model_submit').removeAttr('disabled')
            }
        })


        // let $day = $('.which-day').find('input:checkbox[name="modal_day"]:checked')
        // let days=[]
        // for(let i = 0;i<$day.length;i++){
        //     days.push($day.eq(i).val())
        // }
        // let $time = $('.which-class').find('input:checkbox[name="modal_time"]:checked')
        // let times=[]
        // for(let i = 0;i<$time.length;i++){
        //     times.push($time.eq(i).val())
        // }
        // if(days.length === 0|| times.length ===0){
        //     alert('请选择完整信息')
        //     $('#model_submit').removeAttr('disabled')
        // }else{
        //     $.ajax({
        //         type:'post',
        //         url:domain + 'student/vote',
        //         data:{
        //             "userId":getCookie('userId'),
        //             "staId":getCookie('_id'),
        //             "courseId":getCookie('sta_courseId'),
        //             "days":days,
        //             "times":times
        //         },
        //         success:function (msg) {
        //             if(msg.state === 'error'){
        //                 alert('后台错误')
        //                 console.log(msg.data);
        //             }else{
        //                 alert(msg.data)
        //             }
        //             $('#model_submit').removeAttr('disabled')
        //         },
        //         error:function (err) {
        //             alert('请求错误')
        //             console.log(err);
        //             $('#model_submit').removeAttr('disabled')
        //         }
        //     })
        // }
    })
    $('.add-row').click(function () {
        let form = '<form class="form-inline select-modal" style="margin-bottom: 10px;"><select class="form-control"> <option>周一</option> <option>周二</option> <option>周三</option> <option>周四</option> <option>周五</option> <option>周六</option> <option>周日</option> </select>- <select class="form-control"> <option>第一大节</option> <option>第二大节</option> <option>第三大节</option> <option>第四大节</option> <option>第五大节</option> <option>上午</option> <option>下午</option></select>    <button class="btn btn-danger modal-del">删除</button></form>'
        $('.student-modal-body').append(form)
    })
    //参与统计结束


    //选择课堂开始
    $('#course_select_search').click(function () {
        $(this).attr('disabled', 'disabled')
        let class_id = $('#class_id').val()
        let class_id2 = $('#class_id2').val()
        let courseId = class_id + '-' + class_id2
        if (class_id === '' || class_id2 === '') {
            alert('请输入完整信息')
            $('#course_select_search').removeAttr('disabled')
        } else {
            $.ajax({
                type: 'post',
                url: domain + 'student/getCourseByCourseId',
                data: {
                    "courseId": courseId
                },
                success: function (msg) {
                    if (msg.state === 'success') {
                        $('#search_class_result_name').html(msg.data.courseName)
                        $('#search_class_result_teacher').html(msg.data.courseTeacher)
                        $('.search-class-result').removeClass('hidden')
                        $('#course_select_search').removeAttr('disabled')
                    } else if (msg.state === 'wrong') {
                        // alert(msg.data)
                        $('#search_class_result_name').html(msg.data)
                        $('#search_class_result_teacher').html('')
                        $('.search-class-result').removeClass('hidden')

                        $('#course_select_search').removeAttr('disabled')
                    } else if (msg.state === 'error') {
                        alert('后台错误')
                        console.log(msg.data);
                        $('#course_select_search').removeAttr('disabled')
                    }
                },
                error: function (err) {
                    alert('请求错误')
                    console.log(err);
                    $('#course_select_search').removeAttr('disabled')
                }
            })
        }
    })

    $('#course_select_chose').click(function () {
        $(this).attr('disabled', 'disabled')
        let courseName = $('#search_class_result_name').html()
        let courseTeacher = $('#search_class_result_teacher').html()
        if (courseName && courseTeacher) {
            let class_id = $('#class_id').val()
            let class_id2 = $('#class_id2').val()
            let courseId = class_id + '-' + class_id2
            $.ajax({
                type: 'post',
                url: domain + 'student/getInCourse',
                data: {
                    "userId": getCookie('userId'),
                    "courseId": courseId
                },
                success: function (msg) {
                    if (msg.state === 'error') {
                        $('#course_select_chose').removeAttr('disabled')
                        alert('后台错误')
                    } else {
                        alert(msg.data)
                        $('#course_select_chose').removeAttr('disabled')
                    }
                },
                error: function (err) {
                    alert('请求错误')
                    console.log(err);
                    $('#course_select_chose').removeAttr('disabled')
                }
            })
        } else {
            alert('err')
        }
    })
    //选择课堂结束

    $('#back').click(() => {
        $('#all-course').removeClass('hidden')
        $('.course-detail').addClass('hidden')
    })
    $('#sta_detail_back').click(() => {
        $('#all_course_statistics').removeClass('hidden')
        $('#sta_detail').addClass('hidden')
    });


    //选择实验开始
    $('#experiment_select_title').click(function () {
        $('#select_class_info tbody').empty()
        let userId = getCookie('userId')
        $.ajax({
            type: 'post',
            url: domain + 'student/getCourse',
            data: {
                userId: userId
            },
            success: function (msg) {
                if (msg.state === 'success') {
                    if (msg.data.selectCourse.length === 0) {
                        $('#select_class_info tbody').append('<tr><td>暂无数据</td></tr>')
                    } else {
                        for (let i = 0; i < msg.data.selectCourse.length; i++) {
                            let str = '<tr> <td>' + msg.data.selectCourse[i].courseId + '</td> <td>' + msg.data.selectCourse[i].courseName + '</td> <td>' + msg.data.selectCourse[i].courseTeacher + '</td> <td width="250" style="text-align: center;"> <button class="btn btn-info look-exp">查看实验</button> </td> </tr>'
                            $('#select_class_info tbody').append(str)
                        }
                    }
                } else if (msg.state === 'wrong') {
                    alert(msg.data)
                } else if (msg.state === 'error') {
                    alert('后台错误')
                    console.log(msg.data);
                }
            },
            error: function (err) {
                alert('请求错误')
                console.log(err);
            }
        })
        $('#exp_select_info_back').trigger('click')
    })

    $('#select_class_info').delegate('.look-exp', 'click', function () {
        $(this).attr('disabled', 'disabled')
        $('#select_class_info').addClass('hidden')
        let courseId = $(this).parents('tr').find('td')[0].innerHTML
        addCookie('courseId', courseId)
        $.ajax({
            type: 'post',
            url: domain + 'teacher/getExp',
            data: {
                "courseId": courseId
            },
            success: function (msg) {
                $('.look-exp').removeAttr('disabled')
                $('#select_exp_info tbody').empty()
                if (msg.data.length === 0) {
                    alert('暂无实验')
                    $('#select_exp_info').removeClass('hidden')
                } else {
                    for (let i = 0; i < msg.data.length; i++) {
                        let date = new Date(msg.data[i].expStartTime)
                        let year = date.getFullYear()
                        let month = date.getMonth() + 1
                        let day = date.getDate()
                        let time = year + '-' + month + '-' + day
                        let str = '<tr> <td>' + msg.data[i].expId + '</td> <td>' + msg.data[i].expName + '</td> <td>' + time + '    ' + msg.data[i].expTime + '</td> <td>' + (msg.data[i].expPersonNum - msg.data[i].expPerson.length) + '</td> <td width="250" style="text-align: center;"> <button class="btn btn-success choose" type="submit">选择</button> </td> </tr>'
                        $('#select_exp_info tbody').append(str)
                    }
                    $('#select_exp_info').removeClass('hidden')
                }
            },
            error: function (err) {
                alert('请求错误')
                console.log(err);
                $('.look-exp').removeAttr('disabled')
            }
        })
    })


    $('#select_exp_info').delegate('.choose', 'click', function () {
        let expId = $(this).parents('tr').children().eq(0).html()
        let courseId = getCookie('courseId')
        $.ajax({
            type: 'post',
            url: domain + 'student/choseExp',
            data: {
                "expId": expId,
                "courseId": courseId,
                "userId": getCookie('userId'),
                "userName": getCookie('userName'),
                "belongClass": getCookie('belongClass')
            },
            success: function (msg) {
                if (msg.state === 'error') {
                    alert('后台错误')
                    console.log(msg.data);
                } else {
                    alert(msg.data)
                    $('#exp_select_info_back').trigger('click')
                }
            },
            error: function (err) {
                alert('请求错误')
                console.log(err);
            }
        })
    })

    $('#exp_select_info_back').click(() => {
        $('#select_class_info').removeClass('hidden')
        $('#select_exp_info').addClass('hidden')
    })

    $('#experiment_now').delegate('.del-experiment', 'click', function () {
        let expId = $(this).parents('tr').children().eq(0).html()
        $(this).attr('disabled', 'disabled')
        let toRemove = $(this).parents('tr')
        $.ajax({
            type: 'post',
            url: domain + 'student/delExp',
            data: {
                "userId": getCookie('userId'),
                "expId": expId
            },
            success: function (msg) {
                if (msg.state === 'success') {
                    alert(msg.data)
                    toRemove.remove()
                    $('.del-experiment').removeAttr('disabled')
                } else if (msg.state === 'error') {
                    alert('后台错误')
                    console.log(msg.data);
                    $('.del-experiment').removeAttr('disabled')
                } else if (msg.state === 'wrong') {
                    alert(msg.data)
                    console.log(msg.data);
                    $('.del-experiment').removeAttr('disabled')
                }
            },
            error: function (err) {
                alert('请求错误')
                console.log(err);
                $('.del-experiment').removeAttr('disabled')
            }
        })
    })
    //选择实验结束

})
