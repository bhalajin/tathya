//handles the plugin, provide options like adding data to server, providing tags to the doc

var status_arr = []; //To store the selected keyword
var temp; //To store the suggestions
var obj = {};
var obj1 = {};
var window_timer;
var Access_token; //Google authentication access token
var server_config = "http:/localhost:3000/";
var doc_save = 0;
var user_profile; //To stor the user information
var user_arr=[]; //Tags given by the user
var contentelements = document.getElementById("contents");
var buttons = document.getElementById("buttons");
var textbox = document.getElementById("textbox");
var submit = document.getElementById("submit");
var clear = document.getElementById("clear");



//Google authentication config
var google = new OAuth2('google', {
    client_id: '347305977829-bvneqol2vciereq4uuuiqvno186f4mq4.apps.googleusercontent.com',
    client_secret: 'vqYQUWW5jF8FZQjxgdlzZoRD',
    api_scope: 'email'
  });

//Google authentication call
function authorize(providerName) {
    var provider = window[providerName];
    provider.authorize(checkAuthorized);
}

//Clear the current authentication token
function clearAuthorized() {
    ['google'].forEach(function(providerName) {
        var provider = window[providerName];
        provider.clearAccessToken();
    });
    checkAuthorized();
   // chrome.tabs.create({'url': 'https://www.google.com/accounts/Logout'});
    window.close();
}

//Check whether the user is authorized
function checkAuthorized() {
    ['google'].forEach(function(providerName) {
        var provider = window[providerName];
    });
}

//Getting userinfo
function servercall_auth(){
    google.authorize(function() {
        Access_token = google.getAccessToken();
        var xmlhttp;
        var http = 'https://www.googleapis.com/oauth2/v1/userinfo?oauth_token=' + Access_token;
        if (window.XMLHttpRequest) { 
            xmlhttp = new XMLHttpRequest();
        } else { 
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function () {
        if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 204)) {
            obj.user_info = xmlhttp.responseText;
            obj1.user_info = xmlhttp.responseText;
            console.log("obj.userinfo"+obj.user_info);
            servercall();
        } else {
            console.log("error in authentication");
        }
        }
        xmlhttp.open("GET",http,true);
        xmlhttp.setRequestHeader('Content-Type', 'application/jsonp; charset=UTF-8');
        xmlhttp.send();
    });   
}

//Storing all keywords to Database
function Addkeystodb(){
     var xmlhttp;
    if (window.XMLHttpRequest) { 
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            setTimeout(function () { 
            window.close();} ,100);
        } else {
            console.log("Keywords not added to DB");   
        }
    }
    xmlhttp.open("PUT",server_config+"Addkeys",true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xmlhttp.send(JSON.stringify(obj1));
}

//saving document
function saveDoc1() {
    var count = 0;
    for(i=0;i<user_arr.length;i++){
        for(j=0;j<status_arr.length;j++){
            if(status_arr[j] === user_arr[i]){
                count = 1;
            }
        }
        if(count !=1){
       status_arr.push(user_arr[i]);
        }
        count = 0;
    }
    obj1.key = status_arr;
    var temp1 = server_config+"solr";
    var xmlhttp1;
    xmlhttp1 = buildRequest(temp1, obj1);
    xmlhttp1.onreadystatechange = function () {
        if (xmlhttp1.readyState === 4 && xmlhttp1.status === 200) {
            doc_save = 1;
            var response = xmlhttp1.responseText;          
            Addkeystodb();
        }
        else if(xmlhttp1.status === 500){
            doc_save = 0;
             Addkeystodb(); 
            clearTagTimeout(window_timer);
            setTagTimeout();
        }
    }   
}


function log() {
    var t = server_config + "logging";
    var data = {};
    var d = JSON.parse(obj.user_info);
    data.id = d.id;
    data.url = obj.url;
    data.activity = "Added";
    console.log("ID : " + data.id + "\nurl : " + data.url);
    var xmlhttp = buildRequest(t, data);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            console.log('Activity logged');
            clearTagTimeout(window_timer);
            setTagTimeout();
        } else if (xmlhttp.status !== 200) {
            console.log(xmlhttp.responseText);
            document.getElementById('full').innerHTML = xmlhttp.responseText;
        }
    };
}

//sending request to add doc to server
function saveDoc() {
    var temp1 = server_config+"solr";
    var xmlhttp1;
    xmlhttp1 = buildRequest(temp1, obj);
    xmlhttp1.onreadystatechange = function () {
        if (xmlhttp1.readyState === 4 && xmlhttp1.status === 200) {
            doc_save = 1;
            var response = xmlhttp1.responseText;
            constructPage(doc_save);
            Addtotags();
            log();      
        }
        else if(xmlhttp1.status === 500){
            doc_save = 0;
            constructPage(doc_save);
            clearTagTimeout(window_timer);
            setTagTimeout();     
        }
    }   
}


function keyword(){
    var xmlhttp;
    xmlhttp = buildRequest(server_config+"keyword", obj);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 204)) {
            var response = xmlhttp.responseText;
            var json = JSON.parse(response);
            temp = json;
            obj.title = temp.title;
            obj1.title = temp.title;
            obj.key = temp.key;
            obj1.key = status_arr;
            saveDoc();
        } else if(xmlhttp.status === 500) {
            console.log("Keywords cannot be extracted");
            document.getElementById('full').innerHTML = 'Internet Problem';
        }
    }
}
//Triggers when plugin is clicked
function servercall() {
    //call to fetch URL
    getCurrentTabUrl(function(url) {
        user_profile = JSON.parse(obj.user_info);
        obj.id = obj.url = url;
        obj1.id = obj1.url = url;
        keyword();
    });
}

//get the current tab URL
function getCurrentTabUrl(callback) {
    //tab config
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    //querying chrome tabs
    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        callback(url);
    });
}

//Function to submit the selected tags to server
function submitTags() {
    textbox = document.getElementById("textboxcontent");
    var keywords = textbox.value;
    if(keywords != "") {
        var array = keywords.split(/,| +/);
        for(i = 0; i < array.length; i++) {
            if(array[i].length === 0) {
               array.splice(i,1);
            }
            array[i] = array[i].toUpperCase();
            status_arr.push(array[i]);
        }
        for(i = 0; i < user_arr.length; i++) {
            if(user_arr[i].length === 0) {
               user_arr.splice(i,1);
            }
            user_arr[i] = user_arr[i].toUpperCase();
            status_arr.push(user_arr[i]);
        }
    }
    saveDoc1();
    clearTagTimeout(window_timer);
}

//populates the generated keywords in plugin
function populate() {
    var key = document.getElementById("key");
    var status = document.getElementById("status");
    key.innerHTML = " ";
    status.innerHTML= " ";
    
    //populates the keywords not chosen
    for (i = 0; i < temp.key.length; i++) { 
        var button = document.createElement("button");
        button.className = "inbuttons";
        button.id = temp.key[i];
        button.innerHTML = temp.key[i];
        button.style.color = "black";
        button.onclick = remove;
        key.appendChild(button);
    }
     
    //populates the chosen keywords
    for (i = 0; i < status_arr.length; i++) {
        var span = document.createElement('span');
        span.className = "spanclass";
        var button = document.createElement("label");
        button.className = "inbuttons";
        button.id = status_arr[i];
        button.innerHTML = status_arr[i];
        button.style.color = "black";
        button.onclick =add;
        button.style.marginRight = "4px";
        span.appendChild(button);
        var span1 = document.createElement('span');
        span1.className = "spanclass";
        var icon = document.createElement('i');
        icon.id = status_arr[i]+"x";
        icon.onclick = addall;
        icon.style.size = "10px";
        icon.className = "tiny mdi-navigation-cancel";
        span1.appendChild(icon);

        var but = document.createElement("button");
        but.appendChild(span);
        but.appendChild(span1);
        status.appendChild(but);
    }
    clearTagTimeout(window_timer);   
}

//adds the chosen keyword to selection
function remove()
{   
    var flag = 0;
    var but = event.target;
    for (i = 0; i < temp.key.length; i++) {
        if(temp.key[i] == but.innerHTML) {
            break;
        }
    }
    for(j=0;j<status_arr.length;j++){
        if(status_arr[j] === temp.key[i]){
            flag = 1;
        }     
    }
    if(flag === 0){
        status_arr.push(temp.key[i]);
    }
    Addtotags();
}
//removes already chosen keyword
function add()
{
    var but1 = event.target;
    for(i=0;i<status_arr.length;i++) {
        if(status_arr[i] == but1.innerHTML) {
            break;
        }
    }
    status_arr.splice(i,1);
    Addtotags();
}

//Removes the keyword from the selected list
function addall()
{
    var but1 = event.target;
    for(i=0;i<status_arr.length;i++) {
        if(status_arr[i]+"x" == but1.id) {
            break;
        }
    }
    status_arr.splice(i,1);
    Addtotags();
}

//Storing all keys when timeout occurs
function storeallkeys(){
    if(typeof(temp) != "undefined"){
        obj.key = temp.key;
        var temp1 = server_config+"solr";
        var xmlhttp1;
        xmlhttp1 = buildRequest(temp1, obj);
        xmlhttp1.onreadystatechange = function () {
            if (xmlhttp1.readyState === 4 && xmlhttp1.status === 200) {
                doc_save = 1;
                var response = xmlhttp1.responseText;
                setTimeout(function () { 
                    window.close();
                } ,100);     
            }
            else if(xmlhttp1.status === 500){
                doc_save = 0;
                document.getElementById('savepage').innerHTML = 'Mysql Error';
            }
        } 
    } else {
        setTimeout(function () { 
            storeallkeys();
        } ,2000);
    }
}

//Function to terminate script after 6 secs
function setTagTimeout() {
        window_timer = setTimeout(function () { 
            storeallkeys();} ,3000); 
}

//Function to freeze timeout
function clearTagTimeout() {
    clearTimeout(window_timer);    
}

//Removing user provide keyword
function addtobox(){
    var but1 = event.target;
    for(i=0;i<user_arr.length;i++) {
        if(user_arr[i] == but1.innerHTML) {
            break;
        }
    }
    document.getElementById("textboxcontent").value = user_arr[i];
    user_arr.splice(i,1);
    Addtotags();
}
function removefrombox(){
    var but1 = event.target;
    for(i=0;i<user_arr.length;i++) {
        if(user_arr[i]+"x" == but1.id) {
            break;
        }
    }
    user_arr.splice(i,1);
    Addtotags();
}

//Adding tags to the selected list
function Addtotags(){
    var flag = 0;
    populate();
    for (i = 0; i < user_arr.length; i++) {
        for(j=0; j < status_arr.length; j++){
            if(status_arr[j] === user_arr[i]){
                flag = 1;
            }
        }
        if(flag === 0 ){
            var span = document.createElement('span');
            span.className = "spanclass";
            var button = document.createElement("label");
            button.className = "inbuttons";
            button.id = user_arr[i];
            button.style.marginRight = "4px";
            button.innerHTML = user_arr[i];
            button.onclick =addtobox;
            button.style.color = "black";
            span.appendChild(button);

            var span1 = document.createElement('span');
            span1.className = "spanclass";
            var icon = document.createElement('i');
            icon.id = user_arr[i]+ "x";
            icon.onclick = removefrombox;
            icon.style.size = "10px";
            icon.className = "tiny mdi-navigation-cancel";
            span1.appendChild(icon);

            var but = document.createElement("button");
            but.appendChild(span);
            but.appendChild(span1);
            document.getElementById("status").appendChild(but);
        }
    }
}

//Displaying keyword list
function generate(){
     var str = ",";
    var result = "";
     var usertext = document.getElementById("textboxcontent").value;
     var usertext = usertext.toUpperCase();
       if(usertext !== ""){
            var count = usertext.search(str);
           if(count >= 0){
               var result = usertext.split(","); 
               console.log(result);
               user_arr.push(result[0]);
               Addtotags();
               document.getElementById("textboxcontent").value = "";
           }
       }
}

//Loading the content dynamically
function contentload(){
    
    var lab2 = document.createElement("label");
    lab2.id = "selectedtags";
    lab2.innerHTML = "Selected Tags ";
    
    var lab3 = document.createElement("label");
    lab3.id = "suggestedtags";
    lab3.innerHTML = "Suggestions";
    
    var txt = document.createElement('input');
    txt.setAttribute("type", "text");
    txt.setAttribute("id", "textboxcontent");
    txt.placeholder = " Add Tags";
    txt.onfocus = clearTagTimeout;
    txt.onblur = setTagTimeout;
    contentelements.appendChild(txt);
    
    var button1 = document.createElement("button");
    button1.id = "submit";
    button1.innerHTML = "SAVE";
    button1.onclick = submitTags;
        document.getElementById("textboxcontent").addEventListener("keyup", function(e) {
    if (!e) { var e = window.event; }
    //e.preventDefault(); // sometimes useful

    // Enter is pressed
    if (e.keyCode == 13 || e.keyCode == 188) {  
                var usertext = document.getElementById("textboxcontent").value;
                var usertext = usertext.toUpperCase();
                var result = usertext.split(","); 
                console.log(result);
                user_arr.push(result[0]);
               Addtotags(); 
                document.getElementById("textboxcontent").value = "";
    }
    }, false);
    
    var hr = document.createElement("hr");
    document.getElementById("line").appendChild(hr);
    document.getElementById("suggestion").appendChild(lab3);
    document.getElementById("contents").appendChild(button1);
}

function profile(){
    chrome.tabs.create({ url: server_config+"#params=profile"});
}

//Making the preloader invincible
function constructPage(save_doc) {
    var conten = document.getElementById('plugin_content');
    conten.innerHTML = "";
    var save_page = document.createElement('label');
    save_page.id = "savepage";
    console.log("in page construct" + save_doc);
    if (save_doc === 1) {
        save_page.innerHTML = '';
        save_page.innerHTML = 'Page saved';
        contentload();
    } else {
        save_page.innerHTML = 'Solr Error';
        document.getElementById("page").innerHTML = "";
        document.getElementById("sign").innerHTML = "";
        document.getElementById("logo").innerHTML = "";
    }
    var image = document.createElement("img");
    image.src = "Icons/tathya.png";
    image.height = "40";
    image.width = "100";

    var img = document.createElement("img");
    img.className = "circle responsive-img";
    img.src = "Icons/log1.png";
    img.title = "Log Out";
    img.style.size = "5px";
    img.style.cursor = "pointer";
    img.onclick = clearAuthorized;
    document.getElementById("sign").appendChild(img);
    document.getElementById("logo").appendChild(image);
    //contentelements.appendChild(lab);
    
    
    var head = document.getElementById("header");
    head.style.height = "30px";
    document.getElementById("page").appendChild(save_page);
    
    var name = document.createElement('label');
    name.id = "username";
    name.title = "View Profile";
    name.style.color = "black";
    name.style.cursor = "pointer";
    name.innerHTML = user_profile.given_name;
    
    var link = document.createElement('a');
    link.onclick = profile;
    link.appendChild(name);
    
    document.getElementById("user").innerHTML = "";
    document.getElementById("user").appendChild(link);
    document.getElementById("logo").appendChild(document.createElement('br'));
}

//clearing timeout when mouse over occurs
document.addEventListener('DOMContentLoaded', servercall_auth());
document.getElementById('full').addEventListener('mouseover',function(){
    clearTimeout(window_timer);
});
//Closing plugin when mouse went out
document.getElementById('full').addEventListener('mouseout',function(){
    window_timer = setTimeout(function () { 
    storeallkeys();} ,2000);
});


    

