define(["jquery"], function ($) {

    function useTestData(arg) {
        return arg.qHyperCubeDef.qDimensions.length < 1 || arg.qHyperCubeDef.qMeasures.length < 3
    }

    return {

        section1: function (title) {
            return {
                label: title,
                type: 'items',
                items: [
                    {
                        label: "This extension requires 1 dimension and "
                            + "3 to 4 measures to be rendered. Since this is not the "
                            + "case, sample data is shown.",
                        component: "text",
                        show: function (arg) { return useTestData(arg) }
                    }, {
                        label: "Dimension:",
                        component: "text",
                        show: function (arg) { return useTestData(arg) }
                    }, {
                        label: "1.) the target value (numeric)",
                        component: "text",
                        show: function (arg) { return useTestData(arg) }
                    }, {
                        label: "Measures:",
                        component: "text",
                        show: function (arg) { return useTestData(arg) }
                    }, {
                        label: "1.) the measured value",
                        component: "text",
                        show: function (arg) { return useTestData(arg) }
                    }, {
                        label: "2.) the lower limit",
                        component: "text",
                        show: function (arg) { return useTestData(arg) }
                    }, {
                        label: "3.) the upper limit",
                        component: "text",
                        show: function (arg) { return useTestData(arg) }
                    }, {
                        label: "4.) the trend value",
                        component: "text",
                        show: function (arg) { return useTestData(arg) }
                    }, {
                        label: "Label for Range",
                        type: 'string',
                        expression: 'optional',
                        ref: 'pLabelRange',
                        defaultValue: 'Range',
                        show: function (arg) { return !useTestData(arg) }
                    }, {
                        label: "Color for Range",
                        type: 'string',
                        expression: 'optional',
                        ref: 'pColorRange',
                        defaultValue: '#E6F2FE',
                        show: function (arg) { return !useTestData(arg) }
                    }, {
                        label: "Color for Value",
                        type: 'string',
                        expression: 'optional',
                        ref: 'pColorValue',
                        defaultValue: '#91B1CC',
                        show: function (arg) { return !useTestData(arg) }
                    }, {
                        label: "Color for Target",
                        type: 'string',
                        expression: 'optional',
                        ref: 'pColorTarget',
                        defaultValue: '#48B1F5',
                        show: function (arg) { return !useTestData(arg) }
                    }, {
                        label: "Label for Failed",
                        type: 'string',
                        expression: 'optional',
                        ref: 'pLabelFailed',
                        defaultValue: 'Failed',
                        show: function (arg) { return !useTestData(arg) }
                    }, {
                        label: "Color for Failed",
                        type: 'string',
                        expression: 'optional',
                        ref: 'pColorFailed',
                        defaultValue: '#FF0000',
                        show: function (arg) { return !useTestData(arg) }
                    }, {
                        label: "Color for Trend",
                        type: 'string',
                        expression: 'optional',
                        ref: 'pColorTrend',
                        defaultValue: '#19100c',
                        show: function (arg) { return !useTestData(arg) }
                    }, {
                        label: "Label for X Axis",
                        type: 'string',
                        expression: 'optional',
                        ref: 'pXAxisLabel',
                        defaultValue: 'Target Value',
                        show: function (arg) { return !useTestData(arg) }
                    }, {
                        label: "Label for Y Axis",
                        type: 'string',
                        expression: 'optional',
                        ref: 'pYAxisLabel',
                        defaultValue: 'Target Value',
                        show: function (arg) { return !useTestData(arg) }
                    }, {
                        type: "boolean",
                        defaultValue: false,
                        ref: "pConsoleLog",
                        label: "console.log debugging info"
                    }
                ]
            }
        },

        about: function (title, qext) {
            return {
                label: title,
                type: 'items',
                items: [
                    {
                        label: function (arg) { return 'Installed extension version ' + qext.version },
                        component: "link",
                        url: '../extensions/ext-echart-linearity/ext-echart-linearity.qext'
                    }, {
                        label: "This extension is free of charge by data/\\bridge, Qlik OEM partner and specialist for Mashup integrations.",
                        component: "text"
                    }, {
                        label: "Use as is. No support without a maintenance subscription.",
                        component: "text"
                    }, {
                        label: "",
                        component: "text"
                    }, {
                        label: "About Us",
                        component: "link",
                        url: 'https://www.databridge.ch'
                    }, {
                        label: "Open Documentation",
                        component: "button",
                        action: function (arg) {
                            window.open('https://github.com/ChristofSchwarz/qs-ext-echart-linearity/blob/main/README.md', '_blank');
                        }
                    }
                ]
            }
        }
    }
});