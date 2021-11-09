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

    var data = {"OkPercent": 99.99894563704609, "KoPercent": 0.0010543629539032516};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7036485244238755, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.699895771292436, 500, 1500, "Large calendar"], "isController": true}, {"data": [0.712883707201889, 500, 1500, "Random Date"], "isController": true}, {"data": [0.7035579982643911, 500, 1500, "Open Post"], "isController": true}, {"data": [0.7071245733788396, 500, 1500, "Searh by name"], "isController": true}, {"data": [0.6904208998548621, 500, 1500, "-160"], "isController": false}, {"data": [0.6904208998548621, 500, 1500, "Post Comment"], "isController": true}, {"data": [0.7185821697099892, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.700049160755671, 500, 1500, "Predefined Date"], "isController": true}, {"data": [0.7069508609827804, 500, 1500, "-111"], "isController": false}, {"data": [0.7071245733788396, 500, 1500, "-124"], "isController": false}, {"data": [0.7041874851296693, 500, 1500, "-120"], "isController": false}, {"data": [0.7069508609827804, 500, 1500, "Home Page"], "isController": true}, {"data": [0.7035579982643911, 500, 1500, "-148"], "isController": false}, {"data": [0.7185821697099892, 500, 1500, "-137"], "isController": false}, {"data": [0.699895771292436, 500, 1500, "-128"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 94844, 1, 0.0010543629539032516, 1219.8034772890178, 4, 10328, 4607.0, 6327.0, 6835.0, 8059.980000000003, 35.063021311236625, 959.249586055264, 22.104532142342876], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Large calendar", 6716, 0, 0.0, 1214.7100952948192, 5, 9440, 18.0, 4707.900000000001, 5567.5999999999985, 6834.49, 2.494008215818607, 68.4823422356912, 1.238516656027397], "isController": true}, {"data": ["Random Date", 6776, 0, 0.0, 1172.5125442739097, 4, 10328, 16.0, 4648.6, 5548.5999999999985, 7149.299999999996, 2.5314705953775256, 86.41014595428427, 1.249581385392675], "isController": true}, {"data": ["Open Post", 34570, 1, 0.0028926815157651145, 1210.002863754701, 5, 9540, 1002.0, 5384.9000000000015, 6136.0, 7495.990000000002, 12.823413765602686, 355.5392928163891, 6.575493061093904], "isController": true}, {"data": ["Searh by name", 14064, 0, 0.0, 1188.7447383390254, 4, 9095, 15.0, 4691.0, 5552.0, 6978.700000000001, 5.20609109696974, 119.66562678665558, 2.5386266809716336], "isController": true}, {"data": ["-160", 6890, 0, 0.0, 1331.4396226415095, 5, 10304, 38.0, 5087.900000000001, 6043.9, 7494.250000000004, 2.5647859725191933, 6.057260225315889, 5.941707154021912], "isController": false}, {"data": ["Post Comment", 6890, 0, 0.0, 1331.4399129172714, 5, 10304, 38.0, 5087.900000000001, 6043.9, 7494.250000000004, 2.5647850177841227, 6.057257970516139, 5.941704942236499], "isController": true}, {"data": ["Open Contacts", 1862, 0, 0.0, 1138.332975295381, 4, 8711, 15.0, 4643.1, 5629.199999999997, 6847.349999999994, 0.6936783992197422, 15.805004983834351, 0.33474932078099545], "isController": true}, {"data": ["Predefined Date", 14239, 0, 0.0, 1221.014045930193, 4, 9465, 17.0, 4738.0, 5644.0, 7065.000000000002, 5.305327384789185, 189.07488152877747, 2.6182091860706], "isController": true}, {"data": ["-111", 9524, 0, 0.0, 1182.0131247375048, 5, 9580, 17.0, 4604.5, 5496.75, 6857.75, 3.521173625951094, 120.3374969787284, 1.6694323625673806], "isController": false}, {"data": ["-124", 14064, 0, 0.0, 1188.7443117178645, 4, 9095, 15.0, 4691.0, 5552.0, 6978.700000000001, 5.20609109696974, 119.66562678665558, 2.5386266809716336], "isController": false}, {"data": ["-120", 21015, 0, 0.0, 1205.3746847489883, 4, 10328, 19.0, 4759.0, 5683.750000000004, 7134.960000000006, 7.830008886305589, 275.2532890362876, 3.86443934712201], "isController": false}, {"data": ["Home Page", 9524, 0, 0.0, 1182.0131247375048, 5, 9580, 17.0, 4604.5, 5496.75, 6857.75, 3.5210577665683624, 120.33353743864305, 1.6693774321880281], "isController": true}, {"data": ["-148", 34570, 1, 0.0028926815157651145, 1210.002458779289, 5, 9540, 1002.0, 5384.9000000000015, 6136.0, 7495.990000000002, 12.823418522328216, 355.53942470036804, 6.5754955002116215], "isController": false}, {"data": ["-137", 1862, 0, 0.0, 1138.332438238453, 4, 8711, 15.0, 4643.1, 5629.199999999997, 6847.349999999994, 0.6936783992197422, 15.805004983834351, 0.33474932078099545], "isController": false}, {"data": ["-128", 6716, 0, 0.0, 1214.7099463966654, 5, 9440, 18.0, 4707.900000000001, 5567.5999999999985, 6834.49, 2.494008215818607, 68.4823422356912, 1.238516656027397], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 1, 100.0, 0.0010543629539032516], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 94844, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-148", 34570, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
