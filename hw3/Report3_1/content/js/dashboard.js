/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = true;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.27337548769003, "KoPercent": 3.7266245123099693};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9083142741826987, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9009247027741083, 500, 1500, "Large calendar"], "isController": true}, {"data": [0.9193989071038251, 500, 1500, "Predefined Date"], "isController": true}, {"data": [0.9175977653631285, 500, 1500, "Random Date"], "isController": true}, {"data": [0.8894030541416011, 500, 1500, "Open Post"], "isController": true}, {"data": [0.9175977653631285, 500, 1500, "Open Random Date"], "isController": false}, {"data": [0.8958923512747875, 500, 1500, "Searh by name"], "isController": true}, {"data": [0.9005102040816326, 500, 1500, "Home Page"], "isController": true}, {"data": [0.9193989071038251, 500, 1500, "Open Predefined Date"], "isController": false}, {"data": [0.9611423220973783, 500, 1500, "Post Comment"], "isController": true}, {"data": [0.8889980353634578, 500, 1500, "Open Contacts"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7433, 277, 3.7266245123099693, 263.3380869097269, 2, 9391, 159.0, 492.0, 767.2999999999993, 2093.159999999996, 10.62104461467456, 1506.778214795463, 85.63140054175115], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Large calendar", 1514, 54, 3.5667107001321003, 267.1651254953772, 3, 3486, 141.0, 544.0, 827.0, 2324.0, 2.2008629010687413, 343.38060489114156, 19.299380430382083], "isController": true}, {"data": ["Predefined Date", 732, 20, 2.73224043715847, 246.9590163934426, 4, 3384, 138.0, 483.70000000000005, 800.35, 2096.5499999999975, 1.0658124635993012, 173.32367529894074, 9.351768960214036], "isController": true}, {"data": ["Random Date", 716, 18, 2.5139664804469275, 240.69972067039117, 60, 2763, 139.0, 526.2000000000003, 804.1499999999991, 1517.9900000000061, 1.058426315198174, 170.62758156562464, 9.37179722331243], "isController": true}, {"data": ["Open Post", 4322, 226, 5.2290606200832945, 257.58630263766764, 2, 4385, 144.0, 507.7000000000003, 813.0, 2180.0, 6.256396448821896, 1006.3976193177459, 56.41808659687933], "isController": true}, {"data": ["Open Random Date", 716, 18, 2.5139664804469275, 240.69972067039117, 60, 2763, 139.0, 526.2000000000003, 804.1499999999991, 1517.9900000000061, 1.058585930269348, 170.65331291147723, 9.37321052914142], "isController": false}, {"data": ["Searh by name", 1412, 52, 3.68271954674221, 272.0849858356937, 6, 4052, 140.0, 537.0, 869.8999999999987, 2597.0499999999874, 2.108183244720957, 322.5041976800653, 18.41044364417092], "isController": true}, {"data": ["Home Page", 1568, 60, 3.826530612244898, 266.8443877551019, 4, 3973, 153.5, 537.5000000000007, 797.9499999999996, 2152.0, 2.2408451187304923, 375.42575766967826, 19.25762559915454], "isController": true}, {"data": ["Open Predefined Date", 732, 20, 2.73224043715847, 246.9590163934426, 4, 3384, 138.0, 483.70000000000005, 800.35, 2096.5499999999975, 1.0658140154543032, 173.32392766342483, 9.351782576670905], "isController": false}, {"data": ["Post Comment", 2136, 40, 1.8726591760299625, 283.01779026217196, 2, 9391, 249.0, 379.0, 454.3499999999988, 724.0, 3.142983686207805, 14.532776153273426, 8.204292376204553], "isController": true}, {"data": ["Open Contacts", 1018, 46, 4.518664047151277, 278.6404715127699, 2, 4059, 149.0, 569.0, 816.4499999999996, 2724.119999999997, 1.5095346837094812, 326.28826952626855, 15.864192503670038], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 38, 13.71841155234657, 0.5112336876093099], "isController": false}, {"data": ["404/Not Found", 59, 21.299638989169676, 0.7937575676039285], "isController": false}, {"data": ["Assertion failed", 180, 64.98194945848375, 2.421633257096731], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7433, 277, "Assertion failed", 180, "404/Not Found", 59, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 38, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Large calendar", 757, 27, "Assertion failed", 24, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Post", 2161, 113, "Assertion failed", 58, "404/Not Found", 41, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 14, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 716, 18, "Assertion failed", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Searh by name", 706, 26, "Assertion failed", 21, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5, null, null, null, null, null, null], "isController": false}, {"data": ["Home Page", 784, 30, "Assertion failed", 24, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6, null, null, null, null, null, null], "isController": false}, {"data": ["Open Predefined Date", 732, 20, "Assertion failed", 15, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5, null, null, null, null, null, null], "isController": false}, {"data": ["Post Comment", 1068, 20, "404/Not Found", 18, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1, "Assertion failed", 1, null, null, null, null], "isController": false}, {"data": ["Open Contacts", 509, 23, "Assertion failed", 19, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
