//Function to construct a GET request to the server
function buildRequest(httpURL) {
    var xmlhttp1;
    if (window.XMLHttpRequest) { 
        xmlhttp1 = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp1.open("GET",httpURL,true);
    //setting timeout for response
    xmlhttp1.timeout = 10000;
    //handling HTTP timeout
    xmlhttp1.addEventListener("timeout", timeOut, false);
    //handling HTTP request error
    xmlhttp1.addEventListener("error", handleAjaxError, false);
    //settting header and sending HTTP request
    xmlhttp1.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    try {
        xmlhttp1.send();
        return xmlhttp1;
    } catch(err) {
        console.log("n/w error");
        return xmlhttp1;
    }
}

//Function to construct a HTTP PUT request to the server
function buildPutRequest(httpURL, data) {
    var xmlhttp;
    if (window.XMLHttpRequest) { 
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("PUT",httpURL,true);
    //handling HTTP timeout
    xmlhttp.timeout = 10000;
    xmlhttp.ontimeout = timeOut;
    //handling HTTP requst error
    xmlhttp.addEventListener("error", handleAjaxError, false);
    xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    //sends the stringified data
    xmlhttp.send(JSON.stringify(data));
    return xmlhttp;
}


//reporting error
function handleAjaxError(evt) {
    document.getElementById("results").style.width = 100 + '%';
    document.getElementById("workingArea").style.width = 0 + '%';
    //creatign error content
    var temp1 = document.createElement('div');
    temp1.innerHTML = "Connection timed out";
    document.getElementById("results").appendChild(temp1);
}

//handles HTTP error
function timeOut(evt) {
    var container = document.getElementById("results");
    //error content in result div tag
    container.style.width = 100 + '%';
    document.getElementById("workingArea").style.width = 0 + '%';
    container.innerHTML = "";   //emptying the content of results div tag
    //creating and appending error content
    var temp1 = document.createElement('div');
    temp1.innerHTML = "Connection timed out";
    document.getElementById("results").appendChild(temp1);
}