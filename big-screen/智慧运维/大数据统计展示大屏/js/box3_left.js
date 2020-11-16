/*
 * @Author: your name
 * @Date: 2020-08-19 10:30:57
 * @LastEditTime: 2020-08-19 13:31:47
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \big-screen\智慧运维\大数据统计展示大屏\js\box3_left.js
 */
var dom = document.getElementById("box3_left");
var myChart = echarts.init(dom);
var app = {};
option = null;
app.title = '极坐标系下的堆叠柱状图';

option = {
    textStyle: { //图例文字的样式
        color: '#dbdbdb',
        fontSize: 10
    },
    angleAxis: {},
    radiusAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四'],
        z: 10
    },
    polar: {},
    series: [{
        type: 'bar',
        data: [1, 2, 3, 4],
        coordinateSystem: 'polar',
        name: 'A',
        stack: 'a'
    }, {
        type: 'bar',
        data: [2, 4, 6, 8],
        coordinateSystem: 'polar',
        name: 'B',
        stack: 'a'
    }, {
        type: 'bar',
        data: [1, 2, 3, 4],
        coordinateSystem: 'polar',
        name: 'C',
        stack: 'a'
    }],
    legend: {
        show: true,
        textStyle: { //图例文字的样式
            color: '#dbdbdb',
            fontSize: 10
        },
        data: ['A', 'B', 'C']
    }
};;
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}