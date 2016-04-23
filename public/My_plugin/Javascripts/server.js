//Function to construct a request to the server
function buildRequest(httpURL, data) {
    var xmlhttp1;
    if (window.XMLHttpRequest) { 
        xmlhttp1 = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp1.open("PUT",httpURL,true);
    xmlhttp1.onerror = errorReport;
    xmlhttp1.timeout = 20000;
    xmlhttp1.ontimeout = timeOut;
    xmlhttp1.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    try {
        xmlhttp1.send(JSON.stringify(data));
        return xmlhttp1;
    } catch(err) {
        console.log("n/w error");
        return xmlhttp1;
    }
}

function errorReport() {
    console.log("Server Error");
}

function timeOut() {
    console.log("Connection timed out");
    document.getElementById('full').innerHTML = "Slow Internet Connection";
}