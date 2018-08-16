$(function () {
    $('#all-course .getin-course').click(()=>{
        $('#all-course').addClass('hidden')
        $('.course-detail').removeClass('hidden')
    })
    $('#back').click(()=>{
        $('#all-course').removeClass('hidden')
        $('.course-detail').addClass('hidden')
    })
    $('#all_course_statistics .look').click(()=>{
        $('#all_course_statistics').addClass('hidden')
        $('#sta_detail').removeClass('hidden')
    });
    $('#sta_detail_back').click(()=>{
        $('#all_course_statistics').removeClass('hidden')
        $('#sta_detail').addClass('hidden')
    });
    $('.look-exp').click(()=>{
        $('#select_class_info').addClass('hidden')
        $('#select_exp_info').removeClass('hidden')
    })
    $('#exp_select_info_back').click(()=>{
        $('#select_class_info').removeClass('hidden')
        $('#select_exp_info').addClass('hidden')
    })

    $('#course_select_search').click(()=>{
        $('.search-class-result').removeClass('hidden')
    })
})
