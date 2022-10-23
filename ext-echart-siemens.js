define(["qlik", "jquery", "./props", "./functions", "./cdnjs/echarts.min", "text!./initialProps.json", "text!./testdata.json"
    // echarts.min.js from https://www.cdnpkg.com/echarts/file/echarts.min.js/?id=32956
], function (qlik, $, props, functions, echarts, initialProps, testdata) {

    'use strict';

    var vsettings = {};
    var qext;

    $.ajax({
        url: '../extensions/ext-echart-siemens/ext-echart-siemens.qext',
        dataType: 'json',
        async: false,  // wait for this call to finish.
        success: function (data) { qext = data; }
    });

    return {
        initialProperties: {
            showTitles: false,
            disableNavMenu: false,
            qHyperCubeDef: {
                qInitialDataFetch: [{
                    qWidth: 5,
                    qHeight: Math.floor(10000 / 5) // divide 10000 by qWidt
                }],
                qMeasures: JSON.parse(initialProps).qHyperCubeDef.qMeasures
            }
        },

        definition: {
            type: "items",
            component: "accordion",
            items: [
                {
                    uses: "settings"
                }, {
                    uses: "dimensions",
                    min: 0,
                    max: 1
                }, {
                    uses: "measures",
                    min: 0,
                    max: 4
                },
                props.section1('Extension settings'),
                props.about('About this extension', qext)
            ]
        },
        support: {
            snapshot: true,
            export: false
        },


        paint: function ($element, layout) {


            var self = this;
            const ownId = this.options.id;
            const mode = qlik.navigation.getMode();
            if (layout.pConsoleLog) console.log(ownId, 'paint', 'mode ' + mode, 'layout', layout);
            const app = qlik.currApp(this);
            const thisSheetId = qlik.navigation.getCurrentSheetId().sheetId;
            const enigma = app.model.enigmaModel;

            $element.html(
                '<div id="parent_' + ownId + '" style="height:100%;position:relative;">' +
                '</div>');

            var data = [];
            var titles = {};
            const useTestData = layout.qHyperCube.qDimensionInfo.length < 1 || layout.qHyperCube.qMeasureInfo.length < 3;
            const useTrend = useTestData || layout.qHyperCube.qMeasureInfo.length > 3;

            if (useTestData) {
                // Using test data
                data = JSON.parse(testdata);
                titles = {
                    target: 'Target',
                    value: 'Value',
                    lower: 'Lower',
                    upper: 'Upper',
                    trend: 'Trend'
                }

            } else {

                for (const row of layout.qHyperCube.qDataPages[0].qMatrix) {
                    data.push({
                        target: row[0].qNum,
                        value: row[1].qNum,
                        lower: row[2].qNum,
                        upper: row[3].qNum
                    })
                    if (useTrend) {
                        // add trend attribute if used 
                        data[data.length - 1].trend = row[4].qNum
                    }
                }
                titles = {
                    target: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle,
                    value: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
                    lower: layout.qHyperCube.qMeasureInfo[1].qFallbackTitle,
                    upper: layout.qHyperCube.qMeasureInfo[2].qFallbackTitle
                };
                if (useTrend) titles.trend = layout.qHyperCube.qMeasureInfo[3].qFallbackTitle;
            }

            // console.log('data', data);
            var chartDom = document.getElementById('parent_' + ownId);
            var myChart = echarts.init(chartDom);

            var option = {
                animation: false,
                xAxis: {
                    type: 'time',
                    axisLabel: {
                        formatter: (p) => { return p.toFixed() + '' }
                    },
                    min: 0
                },
                yAxis: {
                    type: 'value'
                },
                tooltip: {
                    formatter: (p, i) => {
                        return titles.value + ': ' + data[p.dataIndex].value + '<br>'
                            + titles.target + ': ' + data[p.dataIndex].target + '<br>'
                            + titles.upper + ': ' + data[p.dataIndex].upper + '<br>'
                            + titles.lower + ': ' + data[p.dataIndex].lower + '<br>'
                    },
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#ccc',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            color: '#222',
                            formatter: (p) => p.value.toFixed()
                        }
                    }
                },
                legend: {
                    data: [
                        layout.pLabelRange,
                        titles.value,
                        titles.target,
                        titles.trend,
                        layout.pLabelFailed
                    ],
                    //formatter: (d) => d.replace('Upper', 'Range'),
                    icon: 'rect'
                },
                series: [
                    {
                        //name: "Lower",
                        type: 'line',
                        data: data.map((i) => {
                            return [i.target, i.lower]
                        }),
                        stack: 'stack1',
                        areaStyle: { opacity: 0 },
                        lineStyle: { opacity: 0 },
                        showSymbol: false
                    },
                    {
                        name: layout.pLabelRange,
                        type: 'line',
                        color: layout.pColorRange,
                        data: data.map((i) => {
                            // console.log(i);
                            return [i.target, i.upper - i.lower]
                        }),
                        stack: 'stack1',
                        areaStyle: { color: layout.pColorRange },
                        lineStyle: { opacity: 0 },
                        showSymbol: false
                    },
                    {
                        name: titles.target,
                        type: 'line',
                        data: data.map(function (i) {
                            return [i.target, i.target];
                        }),
                        itemStyle: { color: layout.pColorTarget },
                        lineStyle: {
                            dashOffset: 2,
                            type: 'dashed'
                        },
                        symbol: 'circle',
                        showSymbol: false
                    },
                    {
                        name: titles.value,
                        type: 'line',
                        color: layout.pColorValue,
                        data: data.map(function (i) {
                            return [
                                i.target,
                                i.value >= i.lower && i.value <= i.upper ? i.value : null
                            ];
                        }),
                        lineStyle: { opacity: 0 },
                        symbol: 'circle',
                        showSymbol: true,
                        symbolSize: 15
                    },
                    {
                        name: layout.pLabelFailed,
                        type: 'line',
                        color: layout.pColorFailed,
                        data: data.map(function (i) {
                            return [
                                i.target,
                                i.value >= i.lower && i.value <= i.upper ? null : i.value
                            ];
                        }),
                        lineStyle: { opacity: 0 },
                        symbol: 'circle',
                        showSymbol: true,
                        symbolSize: 15
                    }
                ]
            };

            if (useTrend) {
                // Add trend if used
                option.series.push({
                    name: titles.trend,
                    type: 'line',
                    data: data.map(function (i) {
                        return [i.target, i.trend]
                    }),
                    itemStyle: {
                        color: layout.pColorTrend
                    },
                    lineStyle: { width: 1 },
                    showSymbol: false
                })
            }

            if (useTestData) {
                // Add a text that shows "Sample data" in bottom right of chart
                option.graphic = [
                    {
                        type: 'group',
                        rotation: Math.PI / 4,
                        bounding: 'raw',
                        right: 80,
                        bottom: 80,
                        z: 100,
                        children: [
                            {
                                type: 'rect',
                                left: 'center',
                                top: 'center',
                                z: 100,
                                shape: { width: 400, height: 40 },
                                style: { fill: 'rgba(220,0,0,0.3)' }
                            },
                            {
                                type: 'text',
                                left: 'center',
                                top: 'center',
                                z: 100,
                                style: {
                                    fill: '#fff',
                                    text: 'sample data',
                                    font: 'bold 26px sans-serif'
                                }
                            }
                        ]
                    }
                ];
            }
            myChart.setOption(option);

            return qlik.Promise.resolve();
        }
    };
});