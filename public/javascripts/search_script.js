var basic_URL = "http://localhost:3000";    //basic URL for HTTP request
var text;   //stores the search text
var page = 1; //stores the current page number
var pages;  //no of pages available for navigation
var tathya_length;  //number of tathya results 
var google_length;  //number of google results
var results = [];   //stores both tathya and google results
var tathya_url = [];





//call back for search button click event
function searchPageText() {
    
    //initialize page number
    page = 1; 
    
    //get the search text from text box
    text = document.getElementById("search_textbox").value;
    document.getElementById("results").innerHTML = "";
    if (text !== "") {
        var res = text.match(/\b[a-z]/g);
        if (res === null) {
            document.getElementById('preloader').style.display = "none";
            document.getElementById('search_textbox').value = "";
        } else {
            //initiate search
            initiate();
        }
    } else {
        document.getElementById('preloader').style.display = "none";
        window.location.hash = "#";
        location.reload();
    }
}


//listening for message from content script
//handles omnibox search
window.addEventListener("message", function(event) {
  //only message from window
  if (event.source != window) {
      return;
  }
    //check for data
  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    text = event.data.text;
    console.log("in web page" + text);
    initiate();
  }
}, false);





//initiates the search request
//manipulates the response
function initiate() {
    var i;
    results = [];
    //building URl and sending request
    var xmlhttp = buildRequest(basic_URL + '/search?keyword=' + text);
    document.getElementById("results").style.width = 100 + '%';
    document.getElementById("workingArea").style.width = 0 + '%';
    initialState();
    xmlhttp.onreadystatechange = function() {
        document.getElementById("workingArea").style.width = 0 + '%';
        document.getElementById("results").style.width = 100 + '%';
        if (document.getElementById("title") !== null) {
            document.getElementById("title").style.display = "none";
            document.getElementById("subtitle").style.display = "none";
        }
        //on successful response
        if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 304)) {
            var response = xmlhttp.responseText;
            json = JSON.parse(response);
            console.log("Response : " + json.tathya);
            console.log("Google results : " + json.google);
            tathya_length = json.tathya.length;
            google_length = json.google.length;
            
            //empties the content for result <div> display tag
            document.getElementById("results").innerHTML = "";
            document.getElementById('preloader').style.display = "none";
            
            //finding total number of pages for navigation
            pages = (tathya_length + google_length)/10;
            if ((pages % 1) !== 0) {
                pages = parseInt(pages) + 1;
            }
            
            console.log("No. of pages : " + pages);
            
            /*for (i = 0; i < json.tathya.length; i+= 1) {
                if (json.google.indexOf(json.tathya[i]) >= 0) {
                    j = json.google.indexOf(json.tathya[i]);
                    json.google.splice(j, 1);
                }
            }*/
            //combining tathya and google results
            results = (json.tathya).concat(json.google);
            
            //both results are empty
            //check for error or no content
            if (results.length === 0) {
                checkForError();
            } else {
                //check for error or no content
                //display results with navigation bar
                checkForError();
                insertResults(); 
                constructNavBar(pages);
            }
        } else if(xmlhttp.status === 500) {
            //Error reporting
            document.getElementById("results").innerHTML = "";
            document.getElementById('preloader').style.display = "none";
            errorReport("Web page cant be retrieved", 'Tathya');
        }   
        //appending the URL with to handle refresh and maintain state
        window.location.hash = "params=search&keyword=" + text + "&page=" + page;
        
    }
    
}


//listening for page navigation
function moreResults() {
    //update the page number and populate the results with navigation bar
    page = parseInt(event.target.id);
    document.getElementById('results').innerHTML = "";
    insertResults();
    constructNavBar(pages);
    //window.location.href = "#google";
    //change the page number in URL
    window.location.hash = "params=search&keyword=" + text + "&page=" + page;
}


//check for error or no content in response
function checkForError() { 
    //no results for tathya
    if (tathya_length === 0) {
        //error
        if(json.Tathya_error === "Server error") {
            errorReport('Internal server error', 'Tathya');
        } else {    //no content available
            errorReport('No content available', 'Tathya');
        }
    } 
    //no results for google
    if(google_length === 0) {
        //error
       if(json.google_error === "Google error") {
            errorReport('Internal server error', 'Google');
        } else {    //no content available
            errorReport('No content available', 'Tathya');
        }
    }
}


//populating the results
function insertResults() {
    document.getElementById("search_textbox").value = text;
    var flag = 0;
    //parent tag
    var container = document.getElementById("results");
    
    //div tag for all results
    var section = document.createElement('div');
    container.appendChild(section);
    
    //start index of results for that particular page
    //each page hosts 10 results
    var start = (page - 1) * 10;
    
    //display Tathya heading
    //checks tathya_length with the page's start and end index
    if (tathya_length > start && tathya_length < start + 10){
        var head = document.createElement('h4');
        head.className = "header brown-text";
        head.innerHTML = "Tathya";
        head.style.marginLeft = "5%";
        section.appendChild(head);
    } else {    //if no tathya results remaining then display google heading
        var head = document.createElement('h4');
        head.className = "header brown-text";
        head.innerHTML = "Google";
        head.id = "google";
        head.style.marginLeft = "5%";
        section.appendChild(head);
        flag = 1;
    }
    //start displaying results
    for(i = start; i < (start + 10) && results[i] !== undefined; i += 1) {
            if ((i) === tathya_length && flag !== 1) {  //if tathya results end in the middle
                var head = document.createElement('h4');
                head.className = "header brown-text";
                head.innerHTML = "Google";
                head.style.marginLeft = "5%";
                section.appendChild(head);
            } 
            if (tathya_url.indexOf){
                
            }
            var outer = document.createElement('div');
            outer.className = "row";
            outer.style.marginLeft = 7 + "%";

            var set_column = document.createElement('div');
            set_column.className = "col s12 m10";
            outer.appendChild(set_column);

            var card = document.createElement('div');
            card.className = "card-panel";
            card.style.boxShadow = "none";
            card.style.boxSizing = "content-box";
            set_column.appendChild(card);

            var card_content = document.createElement('div');
            card_content.className = "card-content";
            var card_title = document.createElement('a');
            card_title.style.fontSize = "1.3em";
            card_title.style.textDecoration = "underline";
            card_title.className = "card-title indigo-text text-accent-4";
            var content = document.createElement('div');
            content.className = "blue-grey-text text-darken-1";
            content.style.fontSize = "0.9em";
            content.style.width = 50 + '%';
            content.style.overflowY = "hidden";
            var link = document.createElement('a');
            link.className = "green-text";
            link.style.overflowX = 'hidden';
            card_content.appendChild(card_title);
            card_content.appendChild(document.createElement('br'));
            card_content.appendChild(link);
            card_content.appendChild(document.createElement('br'));
            card_content.appendChild(content);
            card.appendChild(card_content);        
            section.appendChild(outer);
            if(typeof(results[i].description) === "undefined"){
                content.innerHTML = "";
            } else {
            content.innerHTML = results[i].description;
            }
            //to handle change in variable between tathya and google results
            if (i >= tathya_length) {
                if (tathya_url.indexOf(results[i].link) >= 0) {
                    i += 1;
                }
                link.innerHTML = card_title.href = results[i].link;
            } else {
                link.innerHTML = card_title.href = results[i].id;
                tathya_url[i] = results[i].id;
                console.log("tathya array : " + tathya_url);
            }  
            card_title.innerHTML = results[i].title;
            if (results[i].description === undefined) {
                content.innerHTML = "";
            } else {
                content.innerHTML = results[i].description;
            }
            
    }
    //scroll to window top
     window.scrollTo(0, 0);
}


//constructing navigation bar with specified number of buttonss

function constructNavBar(no_of_pages) {
    if (no_of_pages > 1) {
        var more_results = document.createElement('div');
        more_results.id = 'page_nav';
        for (i = 1; i <= no_of_pages; i += 1) {
            var pages = document.createElement('button');
            pages.className = "teal white-text center waves-effect waves-light btn";
            pages.height = "30px";
            pages.id = pages.innerHTML = i;
            pages.onclick = moreResults;
            more_results.appendChild(pages);
        }
        document.getElementById('results').appendChild(more_results);
    }
}


//displaying error 
//creates a div tag to report error
//receives the error message and header for the error
function errorReport(msg, topic) {
    var container = document.getElementById("results");
    var outer = document.createElement('div');
    outer.className = "row";
    
    var head = document.createElement('h4');
    head.className = "header brown-text";
    head.innerHTML = topic;
    head.id = topic;
    head.style.marginLeft = 5 + "%";
    
    var error_msg = document.createElement('p');
    error_msg.style.marginLeft = 7 + "%";
    error_msg.style.marginBottom = "0px";
    error_msg.style.fontSize = '1.3rem';
    error_msg.innerHTML = msg;
    
    outer.appendChild(head);
    outer.appendChild(error_msg);
    container.appendChild(outer);
}

