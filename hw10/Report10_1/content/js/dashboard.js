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

    var data = {"OkPercent": 99.85696593347171, "KoPercent": 0.14303406652828413};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9963087151043126, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9705882352941176, 500, 1500, "Add User"], "isController": true}, {"data": [0.9984302262639385, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.9937007067499743, 500, 1500, "Open Post"], "isController": true}, {"data": [0.998176973776469, 500, 1500, "Open Login Page"], "isController": true}, {"data": [0.9940647137660349, 500, 1500, "Delete User"], "isController": true}, {"data": [0.9995759117896522, 500, 1500, "Edit Post"], "isController": true}, {"data": [0.99884437596302, 500, 1500, "Searh by name"], "isController": false}, {"data": [0.9956423952769188, 500, 1500, "Open Users' Tab "], "isController": true}, {"data": [0.9963320871834662, 500, 1500, "Log out"], "isController": true}, {"data": [0.9996422609110422, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.9851024208566108, 500, 1500, "Post Comment"], "isController": false}, {"data": [0.9953703703703703, 500, 1500, "Open Contacts"], "isController": false}, {"data": [1.0, 500, 1500, "Open Large calendar"], "isController": false}, {"data": [0.9988425925925926, 500, 1500, "Open Random Date"], "isController": false}, {"data": [0.9947964278180156, 500, 1500, "Log into Account"], "isController": true}, {"data": [0.9974722651313018, 500, 1500, "Open Admin Page"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 57329, 82, 0.14303406652828413, 44.34024664654927, 0, 16423, 23.0, 72.0, 103.0, 240.0, 15.931586080558596, 418.6190700558595, 18.972208147871484], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add User", 1887, 50, 2.649708532061473, 51.21091679915207, 0, 3666, 18.0, 111.0, 160.79999999999973, 471.9599999999991, 0.5288751243711375, 0.2500215678821172, 0.7732655043512382], "isController": true}, {"data": ["Open Home Page", 18474, 0, 0.0, 40.65519107935495, 0, 8589, 23.0, 70.0, 103.0, 235.0, 5.131933242087853, 170.52853520186326, 2.2195817120396253], "isController": true}, {"data": ["Open Post", 9763, 46, 0.47116664959541127, 47.73676124142167, 0, 1589, 33.0, 85.0, 120.0, 284.72000000000116, 2.7469381473262584, 121.24223774731377, 2.7907325423084184], "isController": true}, {"data": ["Open Login Page", 7131, 0, 0.0, 26.25606506801294, 0, 6788, 9.0, 52.0, 85.0, 224.0, 1.9873141857056067, 8.826636203898268, 0.894418534331403], "isController": true}, {"data": ["Delete User", 5223, 0, 0.0, 66.57553130384856, 0, 16423, 12.0, 76.0, 125.0, 409.4000000000033, 1.468921055969464, 0.2610277796370924, 2.52785499646199], "isController": true}, {"data": ["Edit Post", 7074, 0, 0.0, 21.993214588634448, 1, 1024, 9.0, 49.0, 74.0, 207.5, 1.9924947673775035, 0.354134812170611, 3.721992997186453], "isController": true}, {"data": ["Searh by name", 1298, 0, 0.0, 37.197226502311224, 8, 1112, 25.0, 64.0, 91.04999999999995, 236.0999999999999, 0.3665855829063797, 10.638141778951153, 0.16254846120900376], "isController": false}, {"data": ["Open Users' Tab ", 7114, 8, 0.11245431543435479, 34.073095305032226, 0, 2609, 13.0, 68.0, 105.0, 298.0, 1.991706728043561, 18.354240721653525, 2.467295958198796], "isController": true}, {"data": ["Log out", 14177, 0, 0.0, 54.917542498412715, 0, 1513, 32.0, 108.0, 161.0, 420.0, 3.9780281079940494, 134.16010915130255, 6.5167986114150915], "isController": true}, {"data": ["Open Predefined Date", 8386, 0, 0.0, 36.50787025995693, 0, 1325, 24.0, 72.0, 100.0, 222.7799999999952, 2.358025017672534, 87.49421932300416, 2.553080715855736], "isController": true}, {"data": ["Post Comment", 537, 7, 1.303538175046555, 53.88081936685285, 8, 1542, 36.0, 99.59999999999997, 144.09999999999997, 327.96000000000026, 0.15185891430208384, 0.36242049190764486, 0.3392050957326231], "isController": false}, {"data": ["Open Contacts", 216, 0, 0.0, 38.24999999999998, 6, 1564, 21.0, 60.30000000000001, 106.24999999999966, 264.8799999999994, 0.06112286091210024, 1.317523959595525, 0.02688384512881926], "isController": false}, {"data": ["Open Large calendar", 433, 0, 0.0, 33.193995381062344, 7, 361, 22.0, 64.60000000000002, 91.29999999999995, 218.71999999999866, 0.12215981946302155, 2.5599878572822066, 0.05519993249470947], "isController": false}, {"data": ["Open Random Date", 432, 0, 0.0, 33.12037037037036, 7, 1117, 22.0, 61.69999999999999, 82.0, 205.15000000000072, 0.1223731554088085, 3.4376574810789005, 0.055128889632161025], "isController": false}, {"data": ["Log into Account", 14221, 0, 0.0, 66.40123760635659, 0, 8836, 40.0, 116.0, 176.0, 484.78000000000065, 3.964740269226523, 177.63433396576764, 9.11378815114607], "isController": true}, {"data": ["Open Admin Page", 7121, 0, 0.0, 38.17300940879083, 0, 10481, 8.0, 51.0, 82.0, 246.0, 1.9866466988354083, 17.536801005884616, 2.357239105456597], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 29, 35.36585365853659, 0.05058521865024682], "isController": false}, {"data": ["404/Not Found", 53, 64.63414634146342, 0.0924488478780373], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 57329, 82, "404/Not Found", 53, "500/Internal Server Error", 29, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Add User", 945, 25, "500/Internal Server Error", 25, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Post", 6226, 46, "404/Not Found", 46, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Users' Tab ", 3558, 4, "500/Internal Server Error", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Comment", 537, 7, "404/Not Found", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
