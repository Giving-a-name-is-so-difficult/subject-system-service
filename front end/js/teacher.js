$(function () {
    $('.manage-course').click(function () {
        // console.log($(this).parents('tr').children()[0]);
        $(this).parents('table').addClass('hidden');
        $('.course-detail').removeClass('hidden')
    })
    $('#back').click(() => {
        $('#all-course').removeClass('hidden');
        $('.course-detail').addClass('hidden')
    });
    $('.manage-experiment').click(() => {
        $('.teacher-tab a').eq(3).tab('show')
        $('.exp-con').removeClass('hidden')
    })
    $('.launch').click(() => {
        $('#all_course_statistics').addClass('hidden');
        $('.launch-detail').removeClass('hidden')
    })
    $('.launch-back').click(() => {
        $('#all_course_statistics').removeClass('hidden')
        $('.launch-detail').addClass('hidden')
    })
    $('.query').click(() => {
        $('#all_course_statistics').addClass('hidden');
        $('.sta-result').removeClass('hidden')
    })
    $('.launch-result-back').click(() => {
        $('#all_course_statistics').removeClass('hidden');
        $('.sta-result').addClass('hidden')
    })
    $('.launch-sta').click(() => {

    })
    $('#search_student').click(()=>{
        $('.search-result').removeClass('hidden')
    })

    // 统计图绘制
    let ctx = $('#result_bar')
    new Chart(ctx, {
        "type": "horizontalBar",
        "data": {
            "labels": ["2018-7-20 第一大节", "2018-7-20 第二大节", "2018-7-20 第三大节", "2018-7-20 第四大节", "2018-7-21 第一大节", "2018-7-21 第二大节", "2018-7-21 第三大节"],
            "datasets": [{
                "label": "电机学（一）",
                "data": [15, 2, 30, 16, 7, 3, 9],
                "fill": false,
                "backgroundColor": ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)"],
                "borderColor": ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)"],
                "borderWidth": 1
            }]
        },
        "options": {"scales": {"xAxes": [{"ticks": {"beginAtZero": true}}]}}
    });
})