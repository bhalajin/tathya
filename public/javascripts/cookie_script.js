//To create and delete cookies and getting the user information by google authentication

var i; //For incrementation purpose
var user = {}; //To store the information about the user
var userinfo = {}; //Json object to receive the user details
var acToken; //Google authentication token

var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
var SCOPE       =   'email';
var CLIENTID    =   '836327179429-ejun0va5rgf7s2dk86pruls9s032teqp.apps.googleusercontent.com';
var REDIRECT    =   'http://localhost:3000/';
var TYPE        =   'token';
var _url        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;


//To Construct token for authentication
function login() {
    var win         =   window.open(_url, "windowname1", 'width=800, height=600'); 
    var pollTimer   =   window.setInterval(function() { 
    try {
        if (win.document.URL.indexOf(REDIRECT) != -1) {
            window.clearInterval(pollTimer);
            var url =   win.document.URL;
            acToken =   gup(url, 'access_token');
            tokenType = gup(url, 'token_type');
            expiresIn = gup(url, 'expires_in');
            win.close();
            validateToken(acToken);
        }
    } catch(e) {
    }
    }, 100);
}


//Validating the access token
function validateToken(token) {
    $.ajax({
        url: VALIDURL + token,
        data: null,
        success: function(responseText){  
            getUserInfo();
        },  
        dataType: "jsonp"  
    });
}


//Add the new user to database
function addtodb(userinfo){
    var xmlhttp;
    if (window.XMLHttpRequest) { 
        xmlhttp = new XMLHttpRequest();
    } else { 
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
        }
    }
    xmlhttp.open("PUT",basic_URL+"/dbadd",true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xmlhttp.send(JSON.stringify(userinfo));
}

//Getting the details of the user
function getUserInfo() {
    $.ajax({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
        data: null,
        success: function(resp) {
            userinfo = resp; //Receiving the user information
            addtodb(userinfo); 
            
            //call for creating a cookie
            setCookie("username", userinfo.id + '&' + userinfo.name + '&' + userinfo.picture, 10000);
            checkcookie();

        },
        dataType: "jsonp"
    });
}



//To structure the url
function gup(url, name) {
    name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
    var regexS = "[\?&#]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    if( results == null )
        return "";
    else
        return results[1];
}

//Creating a cookie
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}


//Getting a cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//Getting the data from the cookie
function checkcookie() {
    var cookie = getCookie("username");
    if (cookie !== "") {
        var arr = [];
        arr = cookie.split('&');
        user.id = arr[0];
        user.name = arr[1];
        user.picture = arr[2];
        
        //Displaying the user information
        document.getElementById("dp").src = user.picture;
        document.getElementById("signout").style.display = "block";
        document.getElementById("dp").style.display = "block";
        document.getElementById("signin").style.display = "none";
    } else {
        arr = [];
        if (document.getElementById("profileDisplay").style.display === "block") {
            document.getElementById("profileDisplay").style.display = "none";
            document.getElementById("sliderPane").style.width = 0 + "%";
        }
        document.getElementById("signout").style.display = "none";
        document.getElementById("dp").style.display = "none";
        document.getElementById("signin").style.display = "block";
    }
}

//Deleting the cookie
function deletecookie(){
    //Setting expired date for the cookie
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    $.ajax({
            url: "https://accounts.google.com/o/oauth2/revoke?token="+acToken,
            data: null,
            success: function(responseText){  
                arr = [];
                checkcookie();
                var str = fetchEndPoint();
                if(str === "profile" || str === "gallery" || str === "log"){
                    initialState();
                    initialDiv();
                    window.location.hash = "";

                }
            },  
            dataType: "jsonp"  
        });
    
}
