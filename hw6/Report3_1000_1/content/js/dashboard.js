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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9232946613392384, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9235472510271963, 500, 1500, "Large calendar"], "isController": true}, {"data": [0.9244369814302648, 500, 1500, "Random Date"], "isController": true}, {"data": [0.9241164241164241, 500, 1500, "Open Post"], "isController": true}, {"data": [0.922587957031635, 500, 1500, "Searh by name"], "isController": true}, {"data": [0.9146381906214764, 500, 1500, "-160"], "isController": false}, {"data": [0.9146381906214764, 500, 1500, "Post Comment"], "isController": true}, {"data": [0.9242714159552546, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.926616305307564, 500, 1500, "Predefined Date"], "isController": true}, {"data": [0.9285779191276693, 500, 1500, "-111"], "isController": false}, {"data": [0.922587957031635, 500, 1500, "-124"], "isController": false}, {"data": [0.9255303440468573, 500, 1500, "-120"], "isController": false}, {"data": [0.9285779191276693, 500, 1500, "Home Page"], "isController": true}, {"data": [0.9241164241164241, 500, 1500, "-148"], "isController": false}, {"data": [0.9242714159552546, 500, 1500, "-137"], "isController": false}, {"data": [0.9235472510271963, 500, 1500, "-128"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 103963, 0, 0.0, 192.78135490511042, 4, 10802, 587.0, 1185.0, 1448.0, 1860.0, 38.481768511228644, 960.8095456697785, 19.652045712345604], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Large calendar", 10222, 0, 0.0, 185.48288006260984, 5, 2351, 27.0, 657.0, 902.8500000000004, 1450.3100000000013, 3.830985408750253, 103.16306680440087, 0.8000956469763062], "isController": true}, {"data": ["Random Date", 10124, 0, 0.0, 185.34383642828922, 5, 2307, 25.0, 657.0, 908.0, 1476.0, 3.7632861770231383, 126.9219350646113, 0.7748064056853351], "isController": true}, {"data": ["Open Post", 30303, 0, 0.0, 187.77493977493938, 5, 2349, 89.0, 803.0, 1031.0, 1530.9900000000016, 11.252464714204551, 302.2982172625844, 2.5253330178174234], "isController": true}, {"data": ["Searh by name", 10147, 0, 0.0, 186.9335764265303, 6, 2318, 27.0, 651.0, 917.0, 1478.0, 3.786305641099122, 103.28834597059951, 0.7579153715025555], "isController": true}, {"data": ["-160", 15077, 0, 0.0, 225.75140943158343, 5, 10802, 60.0, 709.2000000000007, 960.0, 1528.2199999999993, 5.64126817594381, 13.46217955439706, 12.915072002802674], "isController": false}, {"data": ["Post Comment", 15077, 0, 0.0, 225.75140943158343, 5, 10802, 60.0, 709.2000000000007, 960.0, 1528.2199999999993, 5.641266065186051, 13.462174517338184, 12.915067170451582], "isController": true}, {"data": ["Open Contacts", 6794, 0, 0.0, 183.68943185163374, 4, 2246, 25.0, 667.5, 912.25, 1388.0, 2.5700425490706387, 50.09106115350803, 0.5018971571126702], "isController": true}, {"data": ["Predefined Date", 10193, 0, 0.0, 183.3877170607281, 5, 2244, 27.0, 653.0, 882.2999999999993, 1415.0599999999995, 3.7818342099980966, 130.08321221375135, 0.7786574065356758], "isController": true}, {"data": ["-111", 11005, 0, 0.0, 180.1170377101313, 6, 2260, 27.0, 637.3999999999996, 885.6999999999989, 1408.8200000000015, 4.073824134437307, 135.71240974968748, 0.7614857466592236], "isController": false}, {"data": ["-124", 10147, 0, 0.0, 186.93347787523433, 6, 2318, 27.0, 651.0, 917.0, 1478.0, 3.7863070539419086, 103.2883845121776, 0.7579156543152408], "isController": false}, {"data": ["-120", 20317, 0, 0.0, 184.3622089875474, 5, 2307, 28.0, 661.0, 900.0, 1449.9700000000048, 7.538067854854442, 256.76729105706863, 1.552011797454636], "isController": false}, {"data": ["Home Page", 11005, 0, 0.0, 180.1170377101313, 6, 2260, 27.0, 637.3999999999996, 885.6999999999989, 1408.8200000000015, 4.073688414844735, 135.70788848604172, 0.761460377735118], "isController": true}, {"data": ["-148", 30303, 0, 0.0, 187.77480777480739, 5, 2349, 89.0, 803.0, 1031.0, 1530.9900000000016, 11.252464714204551, 302.2982172625844, 2.5253330178174234], "isController": false}, {"data": ["-137", 6794, 0, 0.0, 183.6892846629378, 4, 2246, 25.0, 667.5, 912.25, 1388.0, 2.5700425490706387, 50.09106115350803, 0.5018971571126702], "isController": false}, {"data": ["-128", 10222, 0, 0.0, 185.48278223439618, 5, 2351, 27.0, 657.0, 902.8500000000004, 1450.3100000000013, 3.8309868445215987, 103.16310546771057, 0.8000959468350322], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 103963, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
