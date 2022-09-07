
"use strict";

google.charts.load('current', {'packages':['table']});
google.charts.load('current', {'packages':['line']});

var chart_divs = window.document.getElementsByClassName("chart_div");
var table_divs = window.document.getElementsByClassName("table_div"); 

var width = window.screen.width;
initialize();

(window.document.getElementById("CB_SNR_KA")).addEventListener("click",calculateCB_SNR_KA);
(window.document.getElementById("CB_SNR_dB")).addEventListener("click",calculateCB_SNR_dB);
(window.document.getElementById("SNR_dB_SNR_KA")).addEventListener("click",calculateSNR_dB_SNR_KA);
(window.document.getElementById("deleteResults")).addEventListener("click",clearResults);
(window.document.getElementById("deleteFields")).addEventListener("click",clearFields);

var inputs = (window.document.querySelectorAll("input"));
for(var input of inputs)
    input.addEventListener("focusin",function(){ clearResults(); });

//"αρχικοποίηση" σελίδας, ενδεικτικές τιμές σε μονάδες μέτρησης και πεδία
function initialize()
{
    window.document.getElementById("cbinitial").value = 1;
    window.document.getElementById("cbfinal").value = 20; 
    window.document.getElementById("step").value = 1;
}

//συνάρτηση επιστροφής των δεδομένων των απαραίτητων για τους υπολογισμούς από τα πεδία στην html σαν array
function getData()
{
    var cbinitial = parseFloat((parseFloat(window.document.getElementById("cbinitial").value)).toFixed(2)); 
    var cbfinal = parseFloat((parseFloat(window.document.getElementById("cbfinal").value)).toFixed(2)); 
    var step = parseFloat((parseFloat(window.document.getElementById("step").value)).toFixed(2)); 
    
    var data = [cbinitial, cbfinal, step];
    
    return data;
}

//συνάρτηση υπολογισμού SNRΚΑ με δεδομένη C/B
function getSNRclearNumberHavingCapacityPerBandwidth(CapacityPerBandwidth)
{
    var SNRclearNumber;
    
    SNRclearNumber = Math.pow(2, CapacityPerBandwidth)-1;
        
    return SNRclearNumber;
}
    
//συνάρτηση υπολογισμού SNRdB με δεδομένη C/B
function getSNRtodBHavingCapacityPerBandwidth(CapacityPerBandwidth)
{
    var SNRtodB;
        
    SNRtodB = 10*Math.log10(Math.pow(2, CapacityPerBandwidth)-1);
        
    return SNRtodB;
}

//συνάρτηση υπολογισμού SNRdB για εύρος τιμών C/B
function calculateSNRdBForFrequencies(cbinitial,cbfinal,step)
{
    var resultsForManyCBs = [];
    for(var cb=cbinitial; cb<=cbfinal; cb+=step)
    {
        var SNRdB = getSNRtodBHavingCapacityPerBandwidth(cb);
        resultsForManyCBs.push(SNRdB);
    }
    return resultsForManyCBs;
}

//συνάρτηση υπολογισμού SNRKA για εύρος τιμών C/B
function calculateSNRKAForFrequencies(cbinitial,cbfinal,step)
{
    var resultsForManyCBs = [];
    for(var cb=cbinitial; cb<=cbfinal; cb+=step)
    {
        var SNRKA = getSNRclearNumberHavingCapacityPerBandwidth(cb);
        resultsForManyCBs.push(SNRKA);
    }
    return resultsForManyCBs;
}

//συνάρτηση υπολογισμού SNR_KA για διάστημα τιμών C/B με εκτύπωση αποτελεσμάτων σε πίνακα και διάγραμμα
function calculateCB_SNR_KA()
{
    clearResultsForOneCalculation(table_divs[0], chart_divs[0]);
    
    var data = getData();
    
    var cbinitial = data[0];
    var cbfinal = data[1];
    var step = data[2];
    
    var SNRKAs = calculateSNRKAForFrequencies(cbinitial,cbfinal,step);

    var widthOfGraph = 600;
    if(width<=500)
    {
        widthOfGraph = 300;
    }
    
        var dataTable = [];
        var cbs = [];
        
        for(var cb=cbinitial; cb<=cbfinal; cb+=step)
        {
            cbs.push(cb);
        }
        for(var i=0; i<cbs.length; i++)
        {
            var tempTable = [cbs[i],SNRKAs[i]];
            dataTable.push(tempTable);
        }
        
        drawTable(dataTable,table_divs[0],"C/B","number","SNR(KA)","number","no");
        
        drawChartWithOneLine(chart_divs[0],widthOfGraph,"brown","C/B - SNR(KA)","C/B:οριζόντιος άξονας, SNR(KA):κάθετος άξονας",
        cbs,"number","C/B",SNRKAs,"number","SNR(KA)"); 
    
}

//συνάρτηση υπολογισμού SNR_dB για διάστημα τιμών C/B με εκτύπωση αποτελεσμάτων σε πίνακα και διάγραμμα
function calculateCB_SNR_dB()
{
    clearResultsForOneCalculation(table_divs[1], chart_divs[1]);
    
    var data = getData();
    
    var cbinitial = data[0];
    var cbfinal = data[1];
    var step = data[2];
    
    var SNRdBs = calculateSNRdBForFrequencies(cbinitial,cbfinal,step);
    
    var widthOfGraph = 600;
    if(width<=500)
    {
        widthOfGraph = 300;
    }
    
        var dataTable = [];
        var cbs = [];
        
        for(var cb=cbinitial; cb<=cbfinal; cb+=step)
        {
            cbs.push(cb);
        }
        for(var i=0; i<cbs.length; i++)
        {
            var tempTable = [cbs[i],SNRdBs[i]];
            dataTable.push(tempTable);
        }
        
        drawTable(dataTable,table_divs[1],"C/B","number","SNR(dB)","number","no");
        
        drawChartWithOneLine(chart_divs[1],widthOfGraph,"green","C/B - SNR(dB)","C/B:οριζόντιος άξονας, SNR(dB):κάθετος άξονας",
        cbs,"number","C/B",SNRdBs,"number","SNR(dB)"); 
    
}

//συνάρτηση υπολογισμού SNR_dB,SNR_KA για διάστημα τιμών C/B με εκτύπωση αποτελεσμάτων σε πίνακα και διάγραμμα
function calculateSNR_dB_SNR_KA()
{
    clearResultsForOneCalculation(table_divs[2], chart_divs[2]);
    
    var data = getData();
    
    var cbinitial = data[0];
    var cbfinal = data[1];
    var step = data[2];
    
    var SNRdBs = calculateSNRdBForFrequencies(cbinitial,cbfinal,step);
    var SNRKAs = calculateSNRKAForFrequencies(cbinitial,cbfinal,step);

    var widthOfGraph = 600;
    if(width<=500)
    {
        widthOfGraph = 300;
    }
    
        var dataTable = [];

        for(var i=0; i<SNRdBs.length; i++)
        {
            var tempTable = [SNRdBs[i],SNRKAs[i]];
            dataTable.push(tempTable);
        }
        
        drawTable(dataTable,table_divs[2],"SNR(dB)","number","SNR(KA)","number","no");
                    
        drawChartWithOneLine(chart_divs[2],widthOfGraph,"blue","SNR(dB) - SNR(KA)","SNR(dB):οριζόντιος άξονας, SNR(KA):κάθετος άξονας",
        SNRdBs,"number","SNR(dB)",SNRKAs,"number","SNR(KA)"); 
    
}

//συνάρτηση απεικόνισης αποτελεσμάτων σε διάγραμμα με μία γραμμή
function drawChartWithOneLine(div,widthOfGraph,color,title,subtitle,x,xType,xName,line,lineType,lineName) 
{

    var data = new google.visualization.DataTable();
    data.addColumn(xType, xName);
    data.addColumn(lineType, lineName);
    
    var table = [];
    for(var i=0; i<x.length; i++)
    {
        var resultsForOneValue = [x[i],line[i]];
        table.push(resultsForOneValue);
    }	

    data.addRows(table);

    var options = {
        chart: {
        title: title,
        subtitle: subtitle
        },
        width: widthOfGraph,
        height: 500,
        series: {
        0: { color: color },
        }
    };

    var chart = new google.charts.Line(div);
    chart.draw(data, google.charts.Line.convertOptions(options));
}

//συνάρτηση απεικόνισης αποτελεσμάτων σε πίνακα με δύο στήλες
function drawTable(table, div, column1Name, column1Type, column2Name, column2Type, withpages) {
    var data = new google.visualization.DataTable();
    data.addColumn(column1Type, column1Name);
    data.addColumn(column2Type, column2Name);
    data.addRows(table);

    var table = new google.visualization.Table(div);
    
    var cssClassNames = {	headerRow: 'bigAndBoldClass', 
                            tableRow: 'row', 
                            oddTableRow: 'oddTableRow',
                            selectedTableRow : 'selectedTableRow',
                            hoverTableRow: 'highlightClass',
                            headerCell : 'headerCell',
                            tableCell : 'tableCell' 
                        };
                        
    if(withpages.localeCompare("yes")==0)
        table.draw(data, {cssClassNames, alternatingRowStyle:true, showRowNumber: false, page: 'enable', pageSize: 5, width: '400px', height: '300px'});
    else
        table.draw(data, {cssClassNames, sort:'disable', alternatingRowStyle:true, showRowNumber: false, page: 'disable', width: '400px', height: '500px'});
    
}

//συνάρτηση καθαρισμού αποτελέσματος
function clearResultsForOneCalculation(table_div, chart_div)
{
    table_div.innerHTML = "";
    chart_div.innerHTML = "";
}

//συνάρτηση καθαρισμού αποτελεσμάτων
function clearResults()
{
    for(var div of table_divs)
        div.innerHTML = "";
    
    for(var div of chart_divs)
        div.innerHTML = "";
}

//επαναφορά των πεδίων στις αρχικές τους τιμές
function clearFields()
{
    window.location.reload(); 
    clearResults();
}