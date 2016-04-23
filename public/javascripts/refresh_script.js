
//fetches the endpoint from'params' attribute from URL hash
function fetchEndPoint() {
    //fetches the current URL
    var q = window.location.href;
    var found = q.search(/#params=/) + 8;
    if (found !== 7) {
        var f2 = q.indexOf('&', found);
        if (f2 === -1) {
            f2 = q.length;
            console.log("End point :" + q.substring(found, f2));
            return (q.substring(found, f2));
        } else {
            console.log("End point :" + q.substring(found, f2));
            return (q.substring(found, f2));
        }
    }
    return 'not found';
}



//fetches the keyword attribute from URL hash
function fetchKeyword() {
    var q = window.location.href;
    var found = q.search(/&keyword=/) + 9;
    if (found !== 7) {
        var f2 = q.indexOf('&', found);
        if (f2 === -1) {
            f2 = q.length;
            return (q.substring(found, f2));
        } else {
            return (q.substring(found, f2));
        }
    }
    return 'not found';
}



//fetches page number from URL hash

function fetchPage() {
    var q = window.location.href;
    var f1 = q.search(/&page=/);
    if (f1) {
        f1 += 6;
        console.log("Page no :" + q.substring(f1, q.length));
        return parseInt((q.substring(f1, q.length)));
    }
    return -1;
}


//decides the endpoint from URL whenever the page is loaded
function decideEndPoint() {
    //automatic focus to search textbox
    document.getElementById('search_textbox').focus();
    //checks for the user logged in
    checkcookie();
    //fetches the endpoint from the URL
    var end_point = fetchEndPoint();
    //redirects to function depending on the endpoint
    switch (end_point) {
            case 'search':
                //search page
                //fetch the keyword for search
                text = fetchKeyword();
                if (text === 'not found') {
                    text = 'search engine';
                }
                //initiate search
                initiate();
                break;
            case 'profile':
                //if a user is logged in their profile is reqested
                if(typeof(user.id) != "undefined"){
                    viewProfile();
                } else {    //otherwise go to login page
                    login();
                    //change the URL hash value
                    window.location.hash = "";
                }
                break;
            case 'gallery':
                //if a user is logged in their gallery is reqested
                if(typeof(user.id) != "undefined"){
                    viewGallery();
                } else {   //otherwise go to gallery page 
                    login();
                    //change the URL hash value
                    window.location.hash = "";
                }
                break;
            case 'log':
                //if a user is logged in their profile is reqested
                if(typeof(user.id) != "undefined"){
                    viewLog();
                } else {    //otherwise go to activity log page
                    login();
                    //change the URL hash value
                    window.location.hash = "";
                }
                break;
            case 'not found':
                if ((window.location.href).search('/#') === -1) {
                    window.location.href += "#";
                }
                break;
    }
}



