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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9480371027469845, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9542822677925211, 500, 1500, "Large calendar"], "isController": true}, {"data": [0.9566694987255735, 500, 1500, "Random Date"], "isController": true}, {"data": [0.9500632369140386, 500, 1500, "Open Post"], "isController": true}, {"data": [0.949477140077821, 500, 1500, "Searh by name"], "isController": true}, {"data": [0.9252882897515023, 500, 1500, "-160"], "isController": false}, {"data": [0.9252882897515023, 500, 1500, "Post Comment"], "isController": true}, {"data": [0.9510424422933731, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.952028175856206, 500, 1500, "Predefined Date"], "isController": true}, {"data": [0.9533469712467326, 500, 1500, "-111"], "isController": false}, {"data": [0.949477140077821, 500, 1500, "-124"], "isController": false}, {"data": [0.9543495416742548, 500, 1500, "-120"], "isController": false}, {"data": [0.9533469712467326, 500, 1500, "Home Page"], "isController": true}, {"data": [0.9510424422933731, 500, 1500, "-137"], "isController": false}, {"data": [0.9500632369140386, 500, 1500, "-148"], "isController": false}, {"data": [0.9542822677925211, 500, 1500, "-128"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 84033, 0, 0.0, 167.0860971285099, 3, 10197, 210.0, 1123.0, 1648.9500000000007, 3375.970000000005, 31.112305749406598, 663.1832677298501, 15.984540893167681], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Large calendar", 8290, 0, 0.0, 145.3302774427022, 3, 5446, 16.0, 330.0, 717.8999999999996, 2215.4500000000007, 3.0788028693402856, 65.49371377230415, 0.6433049094185742], "isController": true}, {"data": ["Random Date", 8239, 0, 0.0, 138.7903871829107, 3, 5445, 15.0, 322.0, 681.0, 2050.0000000000036, 3.0689186224395724, 80.08237440490579, 0.6322453917797382], "isController": true}, {"data": ["Open Post", 24511, 0, 0.0, 158.42356493003138, 3, 5472, 34.0, 459.0, 934.9500000000007, 2665.9600000000064, 9.135352371311765, 244.80831108735796, 2.0507261815002313], "isController": true}, {"data": ["Searh by name", 8224, 0, 0.0, 154.21230544747078, 3, 5245, 14.0, 362.0, 750.5, 2374.5, 3.062705012051208, 57.32103667574356, 0.6126318502374862], "isController": true}, {"data": ["-160", 12314, 0, 0.0, 254.0799090466137, 4, 10197, 60.0, 581.5, 972.0, 3372.80000000001, 4.594289261884189, 10.79828944316162, 10.516980342614811], "isController": false}, {"data": ["Post Comment", 12314, 0, 0.0, 254.0799090466137, 4, 10197, 60.0, 581.5, 972.0, 3372.80000000001, 4.594287547779434, 10.798285414377576, 10.51697641878569], "isController": true}, {"data": ["Open Contacts", 5372, 0, 0.0, 149.95271779597923, 3, 5225, 15.0, 351.0, 739.0499999999984, 2307.0, 1.9912477027629119, 38.43623444615736, 0.38841385717690596], "isController": true}, {"data": ["Predefined Date", 8234, 0, 0.0, 151.56072382803018, 3, 5192, 15.0, 347.0, 749.25, 2443.7999999999956, 3.0639895272138387, 65.1367070487481, 0.6307214615739841], "isController": true}, {"data": ["-111", 8799, 0, 0.0, 148.20979656779218, 4, 5253, 16.0, 338.0, 742.0, 2243.0, 3.2579959566637293, 103.78310522069879, 0.6088833234132127], "isController": false}, {"data": ["-124", 8224, 0, 0.0, 154.21230544747078, 3, 5245, 14.0, 362.0, 750.5, 2374.5, 3.062705012051208, 57.32103667574356, 0.6126318502374862], "isController": false}, {"data": ["-120", 16473, 0, 0.0, 145.1734353184002, 3, 5445, 15.0, 335.0, 723.0, 2288.300000000001, 6.129700488240151, 145.13571495799667, 1.26230603631121], "isController": false}, {"data": ["Home Page", 8799, 0, 0.0, 148.20979656779218, 4, 5253, 16.0, 338.0, 742.0, 2243.0, 3.2578849776661416, 103.77956999685652, 0.6088625826689702], "isController": true}, {"data": ["-137", 5372, 0, 0.0, 149.95271779597923, 3, 5225, 15.0, 351.0, 739.0499999999984, 2307.0, 1.9912484408621083, 38.43624869338222, 0.3884140011509357], "isController": false}, {"data": ["-148", 24511, 0, 0.0, 158.42356493003138, 3, 5472, 34.0, 459.0, 934.9500000000007, 2665.9600000000064, 9.135352371311765, 244.80831108735796, 2.0507261815002313], "isController": false}, {"data": ["-128", 8290, 0, 0.0, 145.33015681544046, 3, 5446, 16.0, 330.0, 717.8999999999996, 2215.4500000000007, 3.0788028693402856, 65.49371377230415, 0.6433049094185742], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 84033, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
