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

    var data = {"OkPercent": 99.99772004423114, "KoPercent": 0.002279955768858084};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9954742877988167, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9973368841544608, 500, 1500, "Log into Account-10"], "isController": false}, {"data": [0.9973368841544608, 500, 1500, "Log into Account-11"], "isController": false}, {"data": [0.9973368841544608, 500, 1500, "Log into Account-12"], "isController": false}, {"data": [0.9980026631158455, 500, 1500, "Log into Account-13"], "isController": false}, {"data": [0.9986684420772304, 500, 1500, "Log into Account-14"], "isController": false}, {"data": [0.9986684420772304, 500, 1500, "Log into Account-15"], "isController": false}, {"data": [0.9980026631158455, 500, 1500, "Log into Account-16"], "isController": false}, {"data": [0.9980026631158455, 500, 1500, "Log into Account-17"], "isController": false}, {"data": [0.9986684420772304, 500, 1500, "Log into Account-18"], "isController": false}, {"data": [0.9980026631158455, 500, 1500, "Log into Account-19"], "isController": false}, {"data": [0.9946666666666667, 500, 1500, "Open Predefined Date-1"], "isController": false}, {"data": [1.0, 500, 1500, "Open Predefined Date-2"], "isController": false}, {"data": [0.9886666666666667, 500, 1500, "Open Predefined Date-0"], "isController": false}, {"data": [0.996, 500, 1500, "Open Predefined Date-5"], "isController": false}, {"data": [0.9946666666666667, 500, 1500, "Open Predefined Date-6"], "isController": false}, {"data": [0.996, 500, 1500, "Open Predefined Date-3"], "isController": false}, {"data": [0.9953333333333333, 500, 1500, "Open Predefined Date-4"], "isController": false}, {"data": [0.996, 500, 1500, "Open Predefined Date-9"], "isController": false}, {"data": [0.9946666666666667, 500, 1500, "Open Predefined Date-7"], "isController": false}, {"data": [0.996, 500, 1500, "Open Predefined Date-8"], "isController": false}, {"data": [0.9597855227882037, 500, 1500, "Log out"], "isController": false}, {"data": [0.9946452476572959, 500, 1500, "Edit Post"], "isController": false}, {"data": [0.9986684420772304, 500, 1500, "Log into Account-20"], "isController": false}, {"data": [1.0, 500, 1500, "Log into Account-21"], "isController": false}, {"data": [1.0, 500, 1500, "Log into Account-22"], "isController": false}, {"data": [0.9986595174262735, 500, 1500, "Log out-18"], "isController": false}, {"data": [0.9993297587131368, 500, 1500, "Log out-19"], "isController": false}, {"data": [0.9973190348525469, 500, 1500, "Log out-16"], "isController": false}, {"data": [0.9979892761394102, 500, 1500, "Log out-17"], "isController": false}, {"data": [0.9993333333333333, 500, 1500, "Open Predefined Date-17"], "isController": false}, {"data": [0.9993333333333333, 500, 1500, "Open Predefined Date-16"], "isController": false}, {"data": [1.0, 500, 1500, "Open Predefined Date-19"], "isController": false}, {"data": [1.0, 500, 1500, "Open Predefined Date-18"], "isController": false}, {"data": [0.9993297587131368, 500, 1500, "Log out-21"], "isController": false}, {"data": [0.9993297587131368, 500, 1500, "Log out-20"], "isController": false}, {"data": [1.0, 500, 1500, "Open Predefined Date-20"], "isController": false}, {"data": [0.9993333333333333, 500, 1500, "Open Predefined Date-21"], "isController": false}, {"data": [0.9966799468791501, 500, 1500, "Open Home Page-16"], "isController": false}, {"data": [0.9966799468791501, 500, 1500, "Open Home Page-17"], "isController": false}, {"data": [0.9780876494023905, 500, 1500, "Open Home Page"], "isController": false}, {"data": [0.99800796812749, 500, 1500, "Open Home Page-18"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-19"], "isController": false}, {"data": [0.9973368841544608, 500, 1500, "Log into Account-6"], "isController": false}, {"data": [0.9973368841544608, 500, 1500, "Log into Account-7"], "isController": false}, {"data": [0.99734395750332, 500, 1500, "Open Home Page-10"], "isController": false}, {"data": [0.9973368841544608, 500, 1500, "Log into Account-4"], "isController": false}, {"data": [0.9966799468791501, 500, 1500, "Open Home Page-11"], "isController": false}, {"data": [0.9973368841544608, 500, 1500, "Log into Account-5"], "isController": false}, {"data": [0.99734395750332, 500, 1500, "Open Home Page-12"], "isController": false}, {"data": [0.9966799468791501, 500, 1500, "Open Home Page-13"], "isController": false}, {"data": [0.9953519256308101, 500, 1500, "Open Home Page-14"], "isController": false}, {"data": [0.9946737683089214, 500, 1500, "Log into Account-8"], "isController": false}, {"data": [0.9766666666666667, 500, 1500, "Open Predefined Date"], "isController": false}, {"data": [0.9960159362549801, 500, 1500, "Open Home Page-15"], "isController": false}, {"data": [0.9980026631158455, 500, 1500, "Log into Account-9"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Open Predefined Date-13"], "isController": false}, {"data": [0.9939678284182306, 500, 1500, "Log out-10"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Open Predefined Date-12"], "isController": false}, {"data": [0.9939678284182306, 500, 1500, "Log out-11"], "isController": false}, {"data": [0.9986666666666667, 500, 1500, "Open Predefined Date-15"], "isController": false}, {"data": [0.9986666666666667, 500, 1500, "Open Predefined Date-14"], "isController": false}, {"data": [0.9966711051930759, 500, 1500, "Log into Account-2"], "isController": false}, {"data": [0.9939678284182306, 500, 1500, "Log out-14"], "isController": false}, {"data": [1.0, 500, 1500, "Log into Account-3"], "isController": false}, {"data": [0.9953083109919572, 500, 1500, "Log out-15"], "isController": false}, {"data": [0.9880159786950732, 500, 1500, "Log into Account-0"], "isController": false}, {"data": [0.996, 500, 1500, "Open Predefined Date-11"], "isController": false}, {"data": [0.9946380697050938, 500, 1500, "Log out-12"], "isController": false}, {"data": [0.9933422103861518, 500, 1500, "Log into Account-1"], "isController": false}, {"data": [0.996, 500, 1500, "Open Predefined Date-10"], "isController": false}, {"data": [0.9939678284182306, 500, 1500, "Log out-13"], "isController": false}, {"data": [0.9707057256990679, 500, 1500, "Log into Account"], "isController": false}, {"data": [0.972630173564753, 500, 1500, "Open Post"], "isController": false}, {"data": [0.99933598937583, 500, 1500, "Open Home Page-20"], "isController": false}, {"data": [1.0, 500, 1500, "Open Post-2"], "isController": false}, {"data": [0.992656875834446, 500, 1500, "Open Post-1"], "isController": false}, {"data": [0.9906542056074766, 500, 1500, "Open Post-0"], "isController": false}, {"data": [0.992656875834446, 500, 1500, "Open Post-6"], "isController": false}, {"data": [0.9919893190921228, 500, 1500, "Open Post-5"], "isController": false}, {"data": [0.992656875834446, 500, 1500, "Open Post-4"], "isController": false}, {"data": [0.9919893190921228, 500, 1500, "Open Post-3"], "isController": false}, {"data": [0.9973297730307076, 500, 1500, "Open Post-17"], "isController": false}, {"data": [0.9973297730307076, 500, 1500, "Open Post-16"], "isController": false}, {"data": [1.0, 500, 1500, "Open Post-19"], "isController": false}, {"data": [0.9993324432576769, 500, 1500, "Open Post-18"], "isController": false}, {"data": [0.9959946595460614, 500, 1500, "Open Post-13"], "isController": false}, {"data": [0.9946595460614153, 500, 1500, "Open Post-12"], "isController": false}, {"data": [0.9966622162883845, 500, 1500, "Open Post-15"], "isController": false}, {"data": [0.9966622162883845, 500, 1500, "Open Post-14"], "isController": false}, {"data": [0.9940239043824701, 500, 1500, "Open Home Page-5"], "isController": false}, {"data": [0.9940239043824701, 500, 1500, "Open Home Page-6"], "isController": false}, {"data": [0.9946879150066401, 500, 1500, "Open Home Page-3"], "isController": false}, {"data": [0.9966622162883845, 500, 1500, "Open Post-11"], "isController": false}, {"data": [0.9946879150066401, 500, 1500, "Open Home Page-4"], "isController": false}, {"data": [0.9959946595460614, 500, 1500, "Open Post-10"], "isController": false}, {"data": [0.9960159362549801, 500, 1500, "Open Home Page-9"], "isController": false}, {"data": [0.9926958831341302, 500, 1500, "Open Home Page-7"], "isController": false}, {"data": [0.9966799468791501, 500, 1500, "Open Home Page-8"], "isController": false}, {"data": [0.9946879150066401, 500, 1500, "Open Home Page-1"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-2"], "isController": false}, {"data": [0.9926958831341302, 500, 1500, "Open Home Page-0"], "isController": false}, {"data": [0.9966622162883845, 500, 1500, "Open Post-9"], "isController": false}, {"data": [0.9966622162883845, 500, 1500, "Open Post-8"], "isController": false}, {"data": [0.9906542056074766, 500, 1500, "Open Post-7"], "isController": false}, {"data": [0.9979892761394102, 500, 1500, "Log out-2"], "isController": false}, {"data": [0.9953083109919572, 500, 1500, "Log out-1"], "isController": false}, {"data": [0.9845844504021448, 500, 1500, "Log out-0"], "isController": false}, {"data": [1.0, 500, 1500, "Open Post-20"], "isController": false}, {"data": [0.9993297587131368, 500, 1500, "Log out-6"], "isController": false}, {"data": [0.9979892761394102, 500, 1500, "Log out-5"], "isController": false}, {"data": [0.9986648865153538, 500, 1500, "Open Post-22"], "isController": false}, {"data": [0.9979892761394102, 500, 1500, "Log out-4"], "isController": false}, {"data": [0.9993324432576769, 500, 1500, "Open Post-21"], "isController": false}, {"data": [0.9993297587131368, 500, 1500, "Log out-3"], "isController": false}, {"data": [0.9953083109919572, 500, 1500, "Log out-9"], "isController": false}, {"data": [0.9959785522788204, 500, 1500, "Log out-8"], "isController": false}, {"data": [0.9993297587131368, 500, 1500, "Log out-7"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 87721, 2, 0.002279955768858084, 29.593472486633992, 0, 3480, 7.0, 87.0, 112.0, 323.9700000000048, 73.30192494743915, 964.3975225942752, 120.05021421918504], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Log into Account-10", 751, 0, 0.0, 16.026631158455366, 4, 1081, 9.0, 16.800000000000068, 24.399999999999977, 77.5600000000004, 0.6292965620799801, 1.5572631721783885, 0.754049689132945], "isController": false}, {"data": ["Log into Account-11", 751, 0, 0.0, 15.340878828229027, 2, 1081, 9.0, 14.0, 22.399999999999977, 75.84000000000015, 0.6292991986700085, 3.1004047434474535, 0.7565110484011527], "isController": false}, {"data": ["Log into Account-12", 751, 0, 0.0, 12.386151797603187, 1, 1023, 6.0, 12.800000000000068, 21.399999999999977, 70.24000000000024, 0.6292991986700085, 0.9660725979582551, 0.7515946484115432], "isController": false}, {"data": ["Log into Account-13", 751, 0, 0.0, 11.31025299600531, 1, 1026, 6.0, 12.0, 20.0, 61.960000000000036, 0.6292991986700085, 3.7530568420681063, 0.7466782484219338], "isController": false}, {"data": ["Log into Account-14", 751, 0, 0.0, 9.207723035952064, 0, 910, 6.0, 12.0, 20.0, 45.440000000000055, 0.6293002533122058, 2.295035497383921, 0.7472940508082445], "isController": false}, {"data": ["Log into Account-15", 751, 0, 0.0, 9.492676431424773, 1, 899, 6.0, 12.0, 18.0, 47.440000000000055, 0.6292991986700085, 5.3226175387509205, 0.761427448390762], "isController": false}, {"data": ["Log into Account-16", 751, 0, 0.0, 10.287616511318245, 1, 902, 6.0, 12.0, 19.0, 43.36000000000013, 0.6292986713502353, 8.353571132484129, 0.7608122608706946], "isController": false}, {"data": ["Log into Account-17", 751, 0, 0.0, 9.101198402130498, 0, 899, 5.0, 11.0, 18.0, 45.48000000000002, 0.6292986713502353, 1.6783346400952075, 0.7644995577731374], "isController": false}, {"data": ["Log into Account-18", 751, 0, 0.0, 8.508655126498004, 0, 898, 5.0, 10.800000000000068, 17.0, 44.48000000000002, 0.6292991986700085, 1.3163660972179276, 0.7589692483959574], "isController": false}, {"data": ["Log into Account-19", 751, 0, 0.0, 8.794940079893477, 0, 902, 4.0, 10.0, 17.0, 48.320000000000164, 0.6293034172600079, 14.344922232112406, 0.8019931245354592], "isController": false}, {"data": ["Open Predefined Date-1", 750, 0, 0.0, 17.685333333333308, 1, 1945, 7.0, 12.0, 20.449999999999932, 491.21000000000026, 0.6299032720535435, 1.093718767296094, 0.7492404153918124], "isController": false}, {"data": ["Open Predefined Date-2", 750, 0, 0.0, 59.830666666666644, 51, 333, 55.0, 64.0, 80.0, 148.45000000000005, 0.6298778792767658, 1.1976988448354633, 0.281107608231916], "isController": false}, {"data": ["Open Predefined Date-0", 750, 0, 0.0, 28.393333333333327, 3, 1693, 6.0, 12.0, 18.0, 677.3500000000001, 0.6299027430164782, 14.135903354022139, 0.7461640891396368], "isController": false}, {"data": ["Open Predefined Date-5", 750, 0, 0.0, 15.038666666666686, 1, 1010, 7.0, 13.0, 19.449999999999932, 449.01000000000045, 0.6299038010914974, 0.8993353097614933, 0.7615438532727282], "isController": false}, {"data": ["Open Predefined Date-6", 750, 0, 0.0, 17.413333333333345, 1, 1942, 7.0, 13.0, 20.449999999999932, 489.6600000000003, 0.6299022139803017, 1.7765210878663196, 0.7664630455268123], "isController": false}, {"data": ["Open Predefined Date-3", 750, 0, 0.0, 15.273333333333333, 1, 1014, 7.0, 13.0, 19.0, 449.50000000000045, 0.629904859170071, 3.689003359807535, 0.7578542836889917], "isController": false}, {"data": ["Open Predefined Date-4", 750, 0, 0.0, 16.397333333333343, 1, 1943, 7.0, 13.0, 22.0, 451.50000000000045, 0.6299027430164782, 2.417497832084726, 0.7560063194992692], "isController": false}, {"data": ["Open Predefined Date-9", 750, 0, 0.0, 17.118666666666652, 4, 991, 8.0, 15.0, 22.449999999999932, 83.37000000000012, 0.6299032720535435, 1.558764542366874, 0.7547766746188455], "isController": false}, {"data": ["Open Predefined Date-7", 750, 0, 0.0, 20.71466666666666, 4, 1938, 9.0, 15.0, 21.449999999999932, 439.6600000000003, 0.6299016849450138, 0.8741116155340474, 0.7430871439585709], "isController": false}, {"data": ["Open Predefined Date-8", 750, 0, 0.0, 17.742666666666665, 3, 992, 9.0, 15.0, 22.0, 75.47000000000003, 0.6299032720535435, 20.44109934603442, 0.7566220943611899], "isController": false}, {"data": ["Log out", 746, 1, 0.13404825737265416, 196.5415549597854, 69, 2829, 123.0, 248.10000000000048, 740.65, 1339.06, 0.6307686584074867, 96.93756723319585, 6.699069922735068], "isController": false}, {"data": ["Edit Post", 747, 0, 0.0, 28.12583668005358, 8, 1197, 11.0, 20.0, 41.60000000000002, 539.1199999999999, 0.6307283772887123, 0.11210211393217348, 1.0477236032891597], "isController": false}, {"data": ["Log into Account-20", 751, 0, 0.0, 7.675099866844213, 1, 892, 4.0, 9.800000000000068, 15.0, 35.840000000000146, 0.6293007806346301, 0.5162232966143451, 0.7546692955266854], "isController": false}, {"data": ["Log into Account-21", 751, 0, 0.0, 76.87483355525966, 43, 425, 89.0, 97.80000000000007, 105.0, 188.80000000000018, 0.6292759974359727, 0.9064278283379489, 0.2919004870918819], "isController": false}, {"data": ["Log into Account-22", 751, 0, 0.0, 79.43009320905466, 44, 473, 90.0, 97.0, 105.39999999999998, 150.64000000000033, 0.6292554341359762, 1.5639209764414643, 0.2918909484517468], "isController": false}, {"data": ["Log out-18", 746, 0, 0.0, 8.323056300268096, 0, 746, 4.0, 12.0, 19.0, 40.70999999999981, 0.6311219249726316, 14.386374973350751, 0.3272712325785815], "isController": false}, {"data": ["Log out-19", 746, 0, 0.0, 6.13538873994638, 0, 585, 3.0, 11.0, 17.649999999999977, 38.769999999999754, 0.6311229928427607, 0.5177180800663271, 0.27981429565489585], "isController": false}, {"data": ["Log out-16", 746, 0, 0.0, 10.808310991957104, 1, 786, 5.0, 12.300000000000068, 23.0, 51.58999999999992, 0.6311229928427607, 1.6832000912632612, 0.289675592418064], "isController": false}, {"data": ["Log out-17", 746, 0, 0.0, 8.970509383378014, 0, 782, 4.0, 12.0, 19.649999999999977, 55.059999999999945, 0.6311235267791803, 1.3201822210556684, 0.2841288533644552], "isController": false}, {"data": ["Open Predefined Date-17", 750, 0, 0.0, 7.565333333333336, 0, 891, 5.0, 12.899999999999977, 19.0, 36.98000000000002, 0.629909620567641, 1.3176429758358272, 0.7597054505869498], "isController": false}, {"data": ["Open Predefined Date-16", 750, 0, 0.0, 7.1306666666666665, 0, 890, 4.0, 12.0, 18.449999999999932, 37.49000000000001, 0.6299090915199119, 1.6799626259188276, 0.765241122901143], "isController": false}, {"data": ["Open Predefined Date-19", 750, 0, 0.0, 5.609333333333328, 1, 59, 4.0, 11.0, 17.449999999999932, 29.470000000000027, 0.629909620567641, 0.516722735621893, 0.7553994277901007], "isController": false}, {"data": ["Open Predefined Date-18", 750, 0, 0.0, 5.924000000000006, 1, 76, 4.0, 11.0, 17.449999999999932, 35.98000000000002, 0.629909620567641, 14.358740589150269, 0.8027656785554409], "isController": false}, {"data": ["Log out-21", 746, 0, 0.0, 86.11126005361925, 44, 548, 91.0, 98.0, 102.64999999999998, 178.76999999999975, 0.631106975170255, 1.5685227068440422, 0.29274981758385854], "isController": false}, {"data": ["Log out-20", 746, 0, 0.0, 85.74798927613946, 44, 549, 91.0, 98.0, 103.0, 176.35999999999967, 0.6310834840545675, 0.9090313857231319, 0.2927389208260933], "isController": false}, {"data": ["Open Predefined Date-20", 750, 0, 0.0, 75.92266666666667, 43, 383, 88.0, 98.0, 105.44999999999993, 158.94000000000005, 0.629876292296193, 0.9072925108758639, 0.29217894418036294], "isController": false}, {"data": ["Open Predefined Date-21", 750, 0, 0.0, 80.40000000000013, 44, 1094, 90.0, 97.0, 105.0, 195.3900000000001, 0.6298540754078096, 1.5654088104617923, 0.29216863849483354], "isController": false}, {"data": ["Open Home Page-16", 753, 0, 0.0, 11.887118193891105, 0, 983, 3.0, 11.0, 16.299999999999955, 83.74000000000251, 0.6295239194008738, 1.3168361673404996, 0.2834087176209012], "isController": false}, {"data": ["Open Home Page-17", 753, 0, 0.0, 12.144754316069054, 0, 993, 4.0, 11.0, 16.0, 80.74000000000251, 0.6295239194008738, 14.349948561186714, 0.3264425792986953], "isController": false}, {"data": ["Open Home Page", 753, 0, 0.0, 159.69455511288172, 67, 2876, 118.0, 156.0, 238.29999999999995, 1214.8200000000006, 0.6294023686592727, 96.57017844899751, 5.935067648216735], "isController": false}, {"data": ["Open Home Page-18", 753, 0, 0.0, 8.589641434262939, 0, 972, 3.0, 10.600000000000023, 15.299999999999955, 45.0, 0.6295244456966194, 0.5164067718605081, 0.2791055647912746], "isController": false}, {"data": ["Open Home Page-19", 753, 0, 0.0, 78.13280212483393, 43, 417, 90.0, 97.0, 102.0, 133.92000000000007, 0.6294797136995852, 0.9067212672918828, 0.2919949843821318], "isController": false}, {"data": ["Log into Account-6", 751, 0, 0.0, 13.511318242343537, 1, 1032, 7.0, 14.0, 21.0, 60.960000000000036, 0.6293002533122058, 0.8984736038500439, 0.760814173437999], "isController": false}, {"data": ["Log into Account-7", 751, 0, 0.0, 13.392809587217046, 1, 1002, 6.0, 14.0, 21.399999999999977, 68.36000000000013, 0.6292981440313459, 1.7748174218384052, 0.7657280151006416], "isController": false}, {"data": ["Open Home Page-10", 753, 0, 0.0, 13.515272244355916, 2, 1899, 7.0, 14.0, 20.0, 43.14000000000033, 0.6295160250702876, 3.105527319731022, 0.28094611665734515], "isController": false}, {"data": ["Log into Account-4", 751, 0, 0.0, 13.505992010652463, 1, 1031, 7.0, 13.0, 21.399999999999977, 61.48000000000002, 0.6292970893962183, 3.6854439893643764, 0.7571230606798253], "isController": false}, {"data": ["Open Home Page-11", 753, 0, 0.0, 13.38778220451528, 1, 1005, 6.0, 12.0, 16.299999999999955, 53.0, 0.6295165513528336, 0.9676292614633878, 0.2760282534740452], "isController": false}, {"data": ["Log into Account-5", 751, 0, 0.0, 13.272969374167786, 1, 1008, 7.0, 13.0, 21.399999999999977, 65.40000000000009, 0.6292976167133403, 2.415175423518972, 0.7552800497467727], "isController": false}, {"data": ["Open Home Page-12", 753, 0, 0.0, 13.03984063745019, 1, 1484, 5.0, 13.0, 17.299999999999955, 54.220000000000255, 0.6295181302057513, 3.769587109414515, 0.2711108353718128], "isController": false}, {"data": ["Open Home Page-13", 753, 0, 0.0, 14.443559096945567, 0, 1484, 5.0, 12.0, 17.0, 242.22000000000935, 0.6295186564918172, 5.342227585572318, 0.2858654055358349], "isController": false}, {"data": ["Open Home Page-14", 753, 0, 0.0, 15.920318725099602, 1, 1937, 5.0, 12.0, 18.0, 230.72000000001026, 0.6295186564918172, 8.381674599831376, 0.2852506412228546], "isController": false}, {"data": ["Log into Account-8", 751, 0, 0.0, 21.193075898801624, 1, 1948, 10.0, 16.0, 23.0, 343.00000000000955, 0.6292976167133403, 0.873273352880524, 0.7423745322165186], "isController": false}, {"data": ["Open Predefined Date", 750, 0, 0.0, 164.0506666666666, 68, 2678, 121.5, 156.0, 366.24999999999966, 1217.0500000000004, 0.6298345046855488, 92.22346404227575, 15.26733601103974], "isController": false}, {"data": ["Open Home Page-15", 753, 0, 0.0, 13.845949535192563, 1, 979, 5.0, 11.600000000000023, 16.299999999999955, 242.0600000000095, 0.6295197090665887, 1.6789241459578648, 0.28893971021611], "isController": false}, {"data": ["Log into Account-9", 751, 0, 0.0, 15.609853528628504, 4, 1085, 10.0, 16.0, 23.399999999999977, 66.92000000000007, 0.6292981440313459, 20.42146223257971, 0.7558952316001518], "isController": false}, {"data": ["Open Predefined Date-13", 750, 0, 0.0, 12.318666666666669, 1, 928, 5.0, 12.0, 18.449999999999932, 48.0, 0.6299085624730714, 2.2877245545286646, 0.7480164179367723], "isController": false}, {"data": ["Log out-10", 746, 0, 0.0, 21.382037533512065, 3, 1381, 8.0, 16.0, 27.0, 700.7799999999966, 0.6311032378303246, 1.561733988927776, 0.2791892253292354], "isController": false}, {"data": ["Open Predefined Date-12", 750, 0, 0.0, 12.840000000000005, 1, 1023, 6.0, 12.0, 20.0, 65.1700000000003, 0.6299038010914974, 3.756662610611108, 0.7473956233653997], "isController": false}, {"data": ["Log out-11", 746, 0, 0.0, 20.88203753351204, 2, 1380, 7.0, 16.0, 25.649999999999977, 690.239999999997, 0.6311032378303246, 3.1092928074745974, 0.2816544723520101], "isController": false}, {"data": ["Open Predefined Date-15", 750, 0, 0.0, 9.882666666666672, 1, 892, 7.0, 13.0, 20.449999999999932, 38.0, 0.629909620567641, 8.361681125367133, 0.7615508889284566], "isController": false}, {"data": ["Open Predefined Date-14", 750, 0, 0.0, 9.993333333333334, 0, 902, 6.0, 12.899999999999977, 19.449999999999932, 39.0, 0.6299090915199119, 5.3277760172401925, 0.7621653949152059], "isController": false}, {"data": ["Log into Account-2", 751, 0, 0.0, 14.812250332889475, 1, 1087, 6.0, 13.0, 22.0, 62.960000000000036, 0.6292991986700085, 1.092669897690698, 0.7485218984180373], "isController": false}, {"data": ["Log out-14", 746, 0, 0.0, 16.827077747989293, 0, 1333, 5.0, 13.0, 24.0, 590.2999999999997, 0.6311187213839267, 5.338007076080262, 0.2865919975034432], "isController": false}, {"data": ["Log into Account-3", 751, 0, 0.0, 59.07589880159781, 51, 255, 54.0, 62.0, 84.39999999999986, 151.0, 0.6292738883177104, 1.1958318303239628, 0.28083805367304066], "isController": false}, {"data": ["Log out-15", 746, 1, 0.13404825737265416, 13.621983914209125, 1, 832, 5.0, 13.0, 24.0, 418.77999999999656, 0.6311203231742137, 8.368171312207863, 0.2855930500623929], "isController": false}, {"data": ["Log into Account-0", 751, 0, 0.0, 31.754993342210376, 1, 1589, 3.0, 9.0, 108.59999999999854, 909.4400000000005, 0.6292923435818885, 0.7190156660066499, 0.6437337020824465], "isController": false}, {"data": ["Open Predefined Date-11", 750, 0, 0.0, 15.702666666666685, 3, 995, 7.0, 13.0, 21.449999999999932, 91.29000000000019, 0.6299064462945962, 0.9670048179444388, 0.7523199060725501], "isController": false}, {"data": ["Log out-12", 746, 0, 0.0, 17.839142091152812, 1, 1380, 6.0, 13.300000000000068, 25.0, 552.219999999998, 0.6311085769009186, 0.9688502762580506, 0.2767263193637816], "isController": false}, {"data": ["Log into Account-1", 751, 0, 0.0, 20.26631158455396, 4, 1988, 6.0, 13.0, 23.0, 741.3200000000033, 0.629293925512045, 23.373251013542387, 0.7343810947137634], "isController": false}, {"data": ["Open Predefined Date-10", 750, 0, 0.0, 16.4, 3, 995, 8.0, 15.0, 22.0, 90.7800000000002, 0.6299064462945962, 3.103396505426014, 0.7572410501842266], "isController": false}, {"data": ["Log out-13", 746, 0, 0.0, 17.72252010723861, 1, 1377, 5.0, 13.0, 23.0, 604.549999999999, 0.6311117803866363, 3.7638668386925667, 0.27179716323291664], "isController": false}, {"data": ["Log into Account", 751, 0, 0.0, 184.54460719041285, 71, 3480, 125.0, 163.80000000000007, 475.79999999999905, 1502.4000000000024, 0.6292274912926142, 102.11235811616537, 15.885228586156828], "isController": false}, {"data": ["Open Post", 749, 0, 0.0, 173.09212283044073, 69, 3138, 123.0, 163.0, 383.5, 1643.5, 0.6300592962347017, 96.83205900633592, 16.02405688656283], "isController": false}, {"data": ["Open Home Page-20", 753, 0, 0.0, 81.26693227091629, 44, 519, 90.0, 98.0, 104.0, 134.0, 0.6295312876213917, 1.564606569332463, 0.29201890783218853], "isController": false}, {"data": ["Open Post-2", 749, 0, 0.0, 61.8104138851802, 51, 461, 55.0, 66.0, 133.0, 208.5, 0.6301011695148809, 1.1958872885501615, 0.2812072602229498], "isController": false}, {"data": ["Open Post-1", 749, 0, 0.0, 22.05874499332446, 1, 1975, 6.0, 13.0, 21.0, 818.0, 0.6301255539888883, 1.0941047216721125, 0.7495048093344393], "isController": false}, {"data": ["Open Post-0", 749, 0, 0.0, 26.359145527369822, 4, 747, 6.0, 13.0, 71.0, 654.5, 0.6301250238715589, 16.975364853641054, 0.7408891882239812], "isController": false}, {"data": ["Open Post-6", 749, 0, 0.0, 21.78771695594125, 1, 1977, 6.0, 12.0, 21.0, 813.0, 0.6301234335249223, 1.7771449961132575, 0.7667322247773957], "isController": false}, {"data": ["Open Post-5", 749, 0, 0.0, 22.967957276368498, 1, 1999, 7.0, 13.0, 21.0, 969.0, 0.6301250238715589, 0.8996511571291201, 0.7618113081572166], "isController": false}, {"data": ["Open Post-4", 749, 0, 0.0, 21.833110814419232, 1, 1985, 6.0, 14.0, 20.0, 812.0, 0.6301276744671257, 2.4183610943904337, 0.7562762811719702], "isController": false}, {"data": ["Open Post-3", 749, 0, 0.0, 22.93724966622166, 1, 1987, 7.0, 13.0, 22.0, 959.5, 0.6301244937551214, 3.690289637743616, 0.7581185315491303], "isController": false}, {"data": ["Open Post-17", 749, 0, 0.0, 11.285714285714288, 1, 1018, 5.0, 12.0, 19.5, 74.0, 0.6301297949596347, 1.3181035359409545, 0.7599709929444812], "isController": false}, {"data": ["Open Post-16", 749, 0, 0.0, 10.885180240320421, 0, 1017, 5.0, 12.0, 20.0, 63.5, 0.6301292648351694, 1.6805498264305154, 0.7655085990771004], "isController": false}, {"data": ["Open Post-19", 749, 0, 0.0, 6.428571428571419, 0, 97, 4.0, 11.0, 18.0, 46.0, 0.6301303250849919, 1.7439349036043623, 0.7568948240766992], "isController": false}, {"data": ["Open Post-18", 749, 0, 0.0, 7.48731642189587, 0, 647, 4.0, 12.0, 19.0, 60.5, 0.6301292648351694, 14.363747363068873, 0.8030455962987267], "isController": false}, {"data": ["Open Post-13", 749, 0, 0.0, 14.691588785046713, 1, 1985, 5.0, 13.0, 19.0, 128.5, 0.630130855211241, 2.288531885283794, 0.7482803905633487], "isController": false}, {"data": ["Open Post-12", 749, 0, 0.0, 17.511348464619527, 1, 1981, 6.0, 13.0, 22.5, 409.5, 0.6301303250849919, 3.758013569623091, 0.747664399392837], "isController": false}, {"data": ["Open Post-15", 749, 0, 0.0, 13.726301735647526, 1, 1017, 7.0, 13.0, 20.0, 93.0, 0.6301292648351694, 8.364596774320761, 0.7618164354159568], "isController": false}, {"data": ["Open Post-14", 749, 0, 0.0, 13.923898531375162, 1, 1031, 6.0, 13.0, 22.0, 83.0, 0.6301282045889149, 5.329629277289642, 0.7624305131695954], "isController": false}, {"data": ["Open Home Page-5", 753, 0, 0.0, 17.69189907038514, 1, 1013, 6.0, 12.0, 17.0, 717.340000000001, 0.6295102360203583, 0.9027427846673712, 0.2852468256967249], "isController": false}, {"data": ["Open Home Page-6", 753, 0, 0.0, 17.71713147410361, 1, 1016, 6.0, 12.0, 15.0, 715.8000000000011, 0.6295097097483717, 1.7754141032747044, 0.29016463183714003], "isController": false}, {"data": ["Open Home Page-3", 753, 0, 0.0, 16.527224435590952, 1, 1012, 6.0, 12.0, 16.299999999999955, 637.5000000000045, 0.6295097097483717, 3.7027226347196756, 0.28155805377417403], "isController": false}, {"data": ["Open Post-11", 749, 0, 0.0, 14.926568758344448, 1, 1004, 7.0, 13.0, 19.0, 73.5, 0.6301287347115963, 0.9673460653970989, 0.7525853931174631], "isController": false}, {"data": ["Open Home Page-4", 753, 0, 0.0, 16.34130146082337, 1, 1011, 6.0, 11.0, 16.0, 636.2000000000044, 0.6295081309376912, 2.4159833540870377, 0.27971308552407176], "isController": false}, {"data": ["Open Post-10", 749, 0, 0.0, 16.71695594125502, 2, 1001, 8.0, 15.0, 23.0, 146.0, 0.6301276744671257, 3.1044864430533683, 0.7575069992861638], "isController": false}, {"data": ["Open Home Page-9", 753, 0, 0.0, 16.600265604249657, 2, 1934, 8.0, 15.0, 21.0, 57.68000000000029, 0.6295154987886216, 1.5578049550101243, 0.27848683686645076], "isController": false}, {"data": ["Open Home Page-7", 753, 0, 0.0, 21.844621513944205, 3, 1933, 8.0, 15.0, 21.0, 682.2200000000003, 0.6295123411171043, 0.8735713249291067, 0.26680503520002274], "isController": false}, {"data": ["Open Home Page-8", 753, 0, 0.0, 17.268260292164687, 2, 1933, 8.0, 16.0, 22.0, 47.14000000000033, 0.6295144462279294, 20.47722879229158, 0.2803306518358748], "isController": false}, {"data": ["Open Home Page-1", 753, 0, 0.0, 16.717131474103592, 1, 1015, 6.0, 12.0, 17.0, 635.5000000000045, 0.6295097097483717, 1.0959516250421135, 0.27295147571120804], "isController": false}, {"data": ["Open Home Page-2", 753, 0, 0.0, 61.466135458167344, 50, 310, 55.0, 68.0, 120.39999999999918, 162.46000000000004, 0.6294360403541225, 1.1920633982315607, 0.2809104203533535], "isController": false}, {"data": ["Open Home Page-0", 753, 0, 0.0, 20.261620185922965, 4, 949, 6.0, 11.0, 18.299999999999955, 602.2800000000007, 0.6294776088210461, 20.692737548381164, 0.2587988997203715], "isController": false}, {"data": ["Open Post-9", 749, 0, 0.0, 16.006675567423198, 4, 1002, 8.0, 15.0, 23.0, 127.5, 0.6301276744671257, 1.5593198506832975, 0.7550455630577766], "isController": false}, {"data": ["Open Post-8", 749, 0, 0.0, 16.716955941254998, 5, 1001, 9.0, 16.0, 22.0, 122.5, 0.6301276744671257, 20.448381467326747, 0.7568916402290671], "isController": false}, {"data": ["Open Post-7", 749, 0, 0.0, 28.178905206942634, 3, 1934, 9.0, 16.0, 25.0, 929.5, 0.6301292648351694, 0.8744274270808358, 0.743355617110239], "isController": false}, {"data": ["Log out-2", 746, 0, 0.0, 12.407506702412858, 1, 903, 7.0, 16.0, 25.0, 59.0, 0.6310888227909354, 1.0957772723850419, 0.2736361692570071], "isController": false}, {"data": ["Log out-1", 746, 0, 0.0, 17.694369973190366, 3, 1990, 5.0, 11.0, 26.649999999999977, 368.72999999999615, 0.6310599946875914, 20.744712784167334, 0.25944947047214456], "isController": false}, {"data": ["Log out-0", 746, 0, 0.0, 36.203753351206466, 0, 1649, 2.0, 10.0, 227.39999999999964, 810.5399999999995, 0.630856671224733, 0.3000265614125439, 0.751606580951342], "isController": false}, {"data": ["Open Post-20", 749, 0, 0.0, 6.2416555407209575, 1, 82, 4.0, 11.0, 17.5, 38.5, 0.6301303250849919, 0.5169037822962824, 0.7556641007855176], "isController": false}, {"data": ["Log out-6", 746, 0, 0.0, 9.78954423592492, 1, 627, 7.0, 16.0, 24.0, 59.52999999999997, 0.6310904244294595, 0.9010294926912793, 0.2859628485695989], "isController": false}, {"data": ["Log out-5", 746, 0, 0.0, 11.907506702412844, 1, 989, 6.0, 15.0, 25.649999999999977, 60.52999999999997, 0.6310904244294595, 2.422056023445094, 0.28041615538613684], "isController": false}, {"data": ["Open Post-22", 749, 0, 0.0, 80.16421895861139, 44, 596, 90.0, 98.0, 105.0, 201.5, 0.630081557285686, 1.5659741829024132, 0.29227415987373134], "isController": false}, {"data": ["Log out-4", 746, 0, 0.0, 12.1876675603217, 1, 904, 7.0, 16.0, 25.299999999999955, 59.0, 0.6310882889132339, 3.6959340513795538, 0.2822640979709581], "isController": false}, {"data": ["Open Post-21", 749, 0, 0.0, 75.72897196261681, 44, 596, 87.0, 96.0, 103.0, 261.0, 0.6300826173749698, 0.9075897076446099, 0.2922746516143659], "isController": false}, {"data": ["Log out-3", 746, 0, 0.0, 71.3042895442359, 51, 517, 56.0, 143.30000000000007, 155.0, 171.52999999999997, 0.6310071500046099, 1.197804557958768, 0.2816115894063542], "isController": false}, {"data": ["Log out-9", 746, 0, 0.0, 19.166219839142094, 4, 1381, 8.0, 16.0, 26.649999999999977, 376.43999999998505, 0.631102170027046, 20.480004990233144, 0.28103768509016896], "isController": false}, {"data": ["Log out-8", 746, 0, 0.0, 16.758713136729234, 3, 1000, 8.0, 16.0, 23.649999999999977, 80.58999999999992, 0.6311032378303246, 0.8757790048407141, 0.2674793019710555], "isController": false}, {"data": ["Log out-7", 746, 0, 0.0, 9.764075067024141, 1, 630, 7.0, 16.0, 27.649999999999977, 60.52999999999997, 0.6310920260761135, 1.7798767297927887, 0.29089398076945855], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 50.0, 0.001139977884429042], "isController": false}, {"data": ["Assertion failed", 1, 50.0, 0.001139977884429042], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 87721, 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Log out", 746, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Log out-15", 746, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
