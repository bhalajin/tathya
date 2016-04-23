//handles the web page display
//handles the div tags slidding



//toggle slider
//handles the menu and profile slidder in the right side of the page
var toggleSlider = function(event){
    console.log("event firing");
    //fetch the slidder width
    var sliderVisible = document.getElementById("sliderPane").offsetWidth;
    var wrkngarea = document.getElementById("workingArea").offsetWidth;
    //decide whether the displayed page is results or workingArea page
    if (wrkngarea === 0) {
       var main = "results";
    } else {
        var main = "workingArea";
    }
    //the slidder is invisible
    if (sliderVisible === 0) {
        //change the width of the main(results or workingArea) page
        document.getElementById(main).style.width = 75 + '%';
        //depending on the event target display the corresponding slidder
        if(event.id === "dp") {
            document.getElementById("profileDisplay").style.display = "block";
            document.getElementById("menuDisplay").style.display = "none";
        } else {
            document.getElementById("menuDisplay").style.display = "block";
            document.getElementById("profileDisplay").style.display = "none";
        }
        //display the slidder
        document.getElementById("sliderPane").style.width = 25+'%';
    } else {    //the slidder is visible
        if (event.id === "dp" && document.getElementById('profileDisplay').style.display === "block") {     //the displaying slidder(profile) is again requested
            //close the slidder
            document.getElementById("sliderPane").style.width = 0+'%';
            document.getElementById("profileDisplay").style.display = "none";
            document.getElementById(main).style.width = 100 + '%';
        } else if (event.id === "menu" && document.getElementById('menuDisplay').style.display === "block") {   //the displaying slidder(menu) is again requested
            //close the slidder
            document.getElementById("sliderPane").style.width = 0+'%';
            document.getElementById("menuDisplay").style.display = "none";
            document.getElementById(main).style.width = 100 + '%';
        } else {
            //depending on the event target one slidder is closed abd other is displayed
            document.getElementById(main).style.width = 75 + '%';
            document.getElementById("sliderPane").style.width = 25+'%';
            if (event.id === "dp") {
                document.getElementById('profileDisplay').style.display = "block";
                document.getElementById("menuDisplay").style.display = "none";
            } else {
                document.getElementById('profileDisplay').style.display = "none";
                document.getElementById("menuDisplay").style.display = "block";
            }    
        }
    }
};



var enablePage = function (event) {
    window.location.hash = "";
    initialDiv();
    initialState();
    switch(event.id) {
        case "Features":
            document.getElementById("search_textbox").value = "";
            document.getElementById("FeaturesArea").style.display = "block";
            break;
        case "Download":
            document.getElementById("search_textbox").value = "";
            document.getElementById("DownloadArea").style.display = "block";
            break;
        case "use":
            document.getElementById("search_textbox").value = "";
            document.getElementById("Usage_instruction").style.display = "block";
            break;
        case "Support":
            document.getElementById("search_textbox").value = "";
            document.getElementById("SupportArea").style.display = "block";
            break;
        case "Feedback":
            document.getElementById("search_textbox").value = "";
            document.getElementById("FeedbackArea").style.display = "block";
            break;
        default:
            document.getElementById("search_textbox").value = "";
            document.getElementById("menulist").style.display = "none";
            break;
    }
};



function keyEvent(event) {
    //var e = event.target;
    console.log("event fired" + event.keyCode);
    if ($('#search_textbox').is(":focus")) {
        initialState();
        if (event.keyCode === 13){
            document.getElementById('preloader').style.display = "initial";
            searchPageText();
       } else {
           console.log("out of focus");
       }
    }
}
 


function feedback(){
    if(document.getElementById("user_name").value != "" && document.getElementById("feedback").value != ""){
        var feedback ={};
        feedback.name = document.getElementById("user_name").value;
        feedback.msg = document.getElementById("feedback").value;
        var xmlhttp = buildPutRequest(basic_URL+'/feedback', feedback);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 304)) {
                var http = xmlhttp.responseText;
                document.getElementById("user_name").value = "";
                document.getElementById("feedback").value = "";
                document.getElementById("sent").innerHTML = "Feedback Sent Successfully.....!";
                document.getElementById("sent").style.display = "initial";
                setTimeout(function () { 
                 document.getElementById("sent").style.display = "none";
                } ,2000); 
            } else {
                errorReport(xmlhttp.statusText, "Profile");
            }
        }
        } else {
            document.getElementById("sent").innerHTML = "Kindly fill up Your Name and Feedback.....!";
            document.getElementById("sent").style.display = "initial";
            setTimeout(function () { 
             document.getElementById("sent").style.display = "none";
            } ,3000); 
        }
}



function initialDiv() {
    document.getElementById("workingArea").style.width = 100 + "%";
    document.getElementById("results").style.width = 0 + "%";
    document.getElementById("search_textbox").value = "";
}



function initialState() {
    document.getElementById("title").style.display = "none";
    document.getElementById("subtitle").style.display = "none";
    document.getElementById("sliderPane").style.width = 0+'%';
    document.getElementById("profileDisplay").style.display = "none";
    document.getElementById("menuDisplay").style.display = "none";
    document.getElementById("FeaturesArea").style.display = "none";
    document.getElementById("DownloadArea").style.display = "none";
    document.getElementById("Usage_instruction").style.display = "none";
    document.getElementById("SupportArea").style.display = "none";
    document.getElementById("FeedbackArea").style.display = "none";
}

