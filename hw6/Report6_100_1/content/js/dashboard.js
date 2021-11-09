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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9335354397362753, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9344418960244648, 500, 1500, "Large calendar"], "isController": true}, {"data": [0.9348877708978328, 500, 1500, "Random Date"], "isController": true}, {"data": [0.933821450783061, 500, 1500, "Open Post"], "isController": true}, {"data": [0.934678127455058, 500, 1500, "Searh by name"], "isController": true}, {"data": [0.9227469834087482, 500, 1500, "-160"], "isController": false}, {"data": [0.9227469834087482, 500, 1500, "Post Comment"], "isController": true}, {"data": [0.9320605435156519, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.9344213101888186, 500, 1500, "Predefined Date"], "isController": true}, {"data": [0.9360087509400424, 500, 1500, "-111"], "isController": false}, {"data": [0.934678127455058, 500, 1500, "-124"], "isController": false}, {"data": [0.9345719911241679, 500, 1500, "-120"], "isController": false}, {"data": [0.9360087509400424, 500, 1500, "Home Page"], "isController": true}, {"data": [0.933821450783061, 500, 1500, "-148"], "isController": false}, {"data": [0.9320605435156519, 500, 1500, "-137"], "isController": false}, {"data": [0.9344418960244648, 500, 1500, "-128"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 145429, 0, 0.0, 179.80841510290213, 3, 19347, 488.0, 1252.0, 1562.9500000000007, 1775.0, 53.82893953705979, 1274.7867606289105, 33.837644395836975], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Large calendar", 10464, 0, 0.0, 170.51385703363948, 3, 3341, 23.0, 558.5, 903.0, 1717.0, 3.890775693657931, 82.81956815884953, 1.9338576440040631], "isController": true}, {"data": ["Random Date", 10336, 0, 0.0, 171.0168343653251, 3, 3366, 23.0, 562.0, 899.0, 1697.6299999999992, 3.8499416698079054, 97.25855277557757, 1.9024122191835189], "isController": true}, {"data": ["Open Post", 53061, 0, 0.0, 175.70343566838253, 3, 3360, 173.0, 910.0, 1223.9500000000007, 1765.0, 19.70002030853378, 521.6427497153742, 9.981378516680657], "isController": true}, {"data": ["Searh by name", 21639, 0, 0.0, 169.26096400018488, 3, 3304, 29.0, 592.9000000000015, 924.9500000000007, 1722.9100000000144, 8.047726263503066, 157.82660041373882, 3.9293533577193687], "isController": true}, {"data": ["-160", 10608, 0, 0.0, 253.55354449472054, 4, 19347, 63.0, 629.0, 979.5499999999993, 2427.369999999999, 3.964295924525904, 9.43939786801843, 9.163375723709164], "isController": false}, {"data": ["Post Comment", 10608, 0, 0.0, 253.55354449472054, 4, 19347, 63.0, 629.0, 979.5499999999993, 2427.369999999999, 3.9642944430368114, 9.439394340439952, 9.163372299282369], "isController": true}, {"data": ["Open Contacts", 2907, 0, 0.0, 173.53009975920207, 3, 3158, 22.0, 585.2000000000003, 951.1999999999998, 1732.6000000000022, 1.1022352587883073, 23.837997680120864, 0.532728453732092], "isController": true}, {"data": ["Predefined Date", 21661, 0, 0.0, 170.85069941369352, 3, 3362, 30.0, 588.0, 928.9500000000007, 1771.0, 8.027322766860026, 212.8222032437679, 3.9665976987504488], "isController": true}, {"data": ["-111", 14627, 0, 0.0, 170.6944007657076, 4, 3340, 24.0, 547.2000000000007, 879.0, 1769.0, 5.414122839551413, 172.31033196342366, 2.5723207521464757], "isController": false}, {"data": ["-124", 21639, 0, 0.0, 169.26091778732848, 3, 3304, 29.0, 592.9000000000015, 924.9500000000007, 1722.9100000000144, 8.047729256521324, 157.82665911080196, 3.929354819079504], "isController": false}, {"data": ["-120", 31997, 0, 0.0, 170.90430352845576, 3, 3366, 76.0, 744.9000000000015, 1126.9500000000007, 1822.9900000000016, 11.857728016768398, 309.5872202495063, 5.859356181040384], "isController": false}, {"data": ["Home Page", 14627, 0, 0.0, 170.69460586586487, 4, 3340, 24.0, 547.2000000000007, 879.0, 1769.7199999999993, 5.413966530901101, 172.30535727108253, 2.572246487857162], "isController": true}, {"data": ["-148", 53061, 0, 0.0, 175.70341682214894, 3, 3360, 173.0, 910.0, 1223.9500000000007, 1765.0, 19.70002030853378, 521.6427497153742, 9.981378516680657], "isController": false}, {"data": ["-137", 2907, 0, 0.0, 173.53009975920207, 3, 3158, 22.0, 585.2000000000003, 951.1999999999998, 1732.6000000000022, 1.1022352587883073, 23.837997680120864, 0.532728453732092], "isController": false}, {"data": ["-128", 10464, 0, 0.0, 170.51385703363948, 3, 3341, 23.0, 558.5, 903.0, 1717.0, 3.890775693657931, 82.81956815884953, 1.9338576440040631], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 145429, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
