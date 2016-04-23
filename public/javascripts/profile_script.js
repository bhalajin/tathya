var count;
var urlgallery;
var userin;
var object3 = {};
//constructing an object with the required details for DB
var object1 = {};

//Displaying user profile
function viewProfile() {
    var xmlhttp;
    //requesting to profile route
    var t = basic_URL + "/profile";
    //sending user details for requesting profile details
    xmlhttp = buildPutRequest(t, user);
    //empty the search textbox
    document.getElementById("search_textbox").value = "";
    //make result page visible
    document.getElementById("results").style.width = 100 + '%';
    //make the working area(static page) invisible
    document.getElementById("workingArea").style.width = 0 + '%';
    //make the static page content to initial content
    initialState();
    //handling the profile data
    xmlhttp.onreadystatechange = function () {
        window.location.hash = "params=profile";
        if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 304)) {
            userin = JSON.parse(xmlhttp.responseText);
            console.log("user data : " + userin);
            //populate the profile details
            displayProfile();
        } else {
            //empty the result page
            document.getElementById('results').innerHTML = "";
            //error handling
            errorReport(xmlhttp.responseText, "Profile");
        }
    }
}


//Changing profile info into textbox for editing operation
function edit () {
    //hide linkedin image button and display the textbox with the link for editing
    document.getElementById("linkdin_img").style.display = 'none';
    document.getElementById("linkdin").style.display = "inline";
    //enable the location, job, department, contact for editing
    document.getElementById("location").disabled = false;
    document.getElementById("job").disabled = false;
    document.getElementById("dept").disabled = false;
    document.getElementById("contact").disabled = false;
    //hide edit button and dispaly save button
    document.getElementById("edit_btn").style.display = "none";
    document.getElementById("save").style.display = "block";
}



//update the edited user info 
function submituserinfo() {
    document.getElementById("error_stmt").innerHTML = "";
    //creating an object
    var object = {};
    //storing the static values from previous result
    object.id = userin.id;
    object.name = userin.name;
    object.email = userin.email;
    object.link = userin.google;
    object.gender = userin.gender;
    object.picture = userin.picture;
    //storing the edited values in the object
    object.linkedin = validateLinkdin();
    object.location = validateLocation();
    object.jobtitle = validateJob();
    object.department = validateDepartment();;
    object.phoneno = validateContact();
    if (document.getElementById("error_stmt").innerHTML === "") {
        //HTTP request for updating user details in DB
        var xmlhttp = buildPutRequest(basic_URL+"/updatedb", object);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 304)) {
                var response = xmlhttp.responseText;
                //the values in display are updatted by having another profile request
                //values are updated in profile page
                //ensures the user details updation
                viewProfile();
            } else {
                errorReport(xmlhttp.responseText, "Profile");
            }
        }
    }
}



function displayProfile() {
    //get the parent element to populate
    var main_container = document.getElementById("results");
    main_container.innerHTML = "";
    
    //the div within 'results'
    //contains the user details
    var container = document.createElement("div");
    container.id = "container";
    
    //contains the editable content
    var sub_container = document.createElement("div");
    sub_container.id = "sub_container";
    
    
    //name and profile pic
    var display = document.createElement('div');
    var img_link = document.createElement('a');
    img_link.href = userin.google;
    img_link.target = "_blank";
    display.id = "dp_with_name";
    //profile name
    var name = document.createElement('h1');
    name.id = "profile_name";
    name.innerHTML = userin.name;
    //profile pic and linked to user's google+ account
    var dp = document.createElement('img');
    dp.id = 'dp_in_profile';
    dp.src = userin.picture;
    dp.className = "circle";
    img_link.appendChild(dp);
    display.appendChild(name);
    display.appendChild(img_link);
    
    
    //email address of the user
    //element is disabled to prevent changes by user
    var email_case = document.createElement('div');
    email_case.className = 'input-field';
    email_case.style.paddingLeft = 5 + '%';
    email_case.style.marginTop = 2 + '%';
    email_case.id = "email_case";
    var e_label = document.createElement('label');  //email label
    e_label.for = "email";
    e_label.innerHTML = "Email id";
    var email_btn = document.createElement('a');
    email_btn.className = "btn";
    email_btn.id = "email_btn";
    var email_icon = document.createElement('i');
    email_icon.className = "medium mdi-communication-email";
    email_icon.id = "email_icon";
    email_btn.appendChild(email_icon);
    var email = document.createElement('input');    //email textbox
    email.type = 'text';
    email.id = "email";
    email.disabled = true;
    email.value = userin.email;
    email_case.appendChild(e_label);
    email_case.appendChild(email_btn);
    email_case.appendChild(email);
   
    
     //linkedIn account URL
    var linkdin_case = document.createElement('div');
    linkdin_case.className = 'input-field';
    linkdin_case.style.paddingLeft = 5 + '%';
    var linkdin_img = document.createElement('a');
    linkdin_img.id = "linkdin_img";
    linkdin_img.target = "_blank";
    //if no URL is specified it redirects to linkedin home page
    //otherwise it'll redirect to the specified URL
    if (userin.linkedin === null) {
        linkdin_img.href = "https://in.linkedin.com/";
    } else {
        linkdin_img.href = userin.linkedin;
    }
    linkdin_img.style.marginLeft = 14 + '%';
    var link_label = document.createElement("label");
    link_label.for = 'linkdin';
    link_label.innerHTML = "LinkedIn";
    link_label.id = "link_label";
    var linkdin_icon = document.createElement('img');
    linkdin_icon.src = "./images/linkedin.png";
    linkdin_icon.id = "linkdin_icon";
    linkdin_img.appendChild(linkdin_icon);
    linkdin_img.backgroundColor = "white";    
    //textbox for providing the linkedin account URL
    //displayed only on clicking 'edit' button
    var linkdin = document.createElement("input");   
    linkdin.type = "text";
    linkdin.id = "linkdin";
    linkdin.style.display = 'none';
    linkdin.style.width = 61 + '%';
    linkdin.value = userin.linkedin;
    linkdin_case.appendChild(link_label);
    linkdin_case.appendChild(linkdin_img);
    //linkdin_case.appendChild(linkdin_btn);
    linkdin_case.appendChild(linkdin);
    
    
    //location detail of the user
    var location_case = document.createElement('div');
    location_case.className = 'input-field';
    location_case.style.paddingLeft = 5 + '%';
    var loc_label = document.createElement("label");
    loc_label.for = 'location';
    loc_label.innerHTML = "Location";
    var loc_btn = document.createElement('a');
    loc_btn.className = "btn";
    loc_btn.id = "loc_btn";
    var loc_icon = document.createElement('i');
    loc_icon.className = "medium mdi-maps-my-location";
    loc_icon.id = "loc_icon";
    loc_btn.appendChild(loc_icon);
    var location = document.createElement('input');
    location.type = "text";
    location.id = "location";
    location.disabled = true;
    location.value = userin.location;
    location_case.appendChild(loc_label);
    location_case.appendChild(loc_btn);
    location_case.appendChild(location);
    
    
    //job designation of the user
    var job_case = document.createElement('div');
    job_case.className = 'input-field';
    job_case.style.paddingLeft = 5 + '%';
    var job_btn = document.createElement('a');
    job_btn.className = "btn";
    job_btn.id = "job_btn";
    var job_icon = document.createElement('i');
    job_icon.className = "medium mdi-action-perm-identity";
    job_icon.id = "job_icon";
    job_btn.appendChild(job_icon);
    var job = document.createElement('input');
    job.type = "text";
    job.id = 'job';
    job.disabled =true;
    job.value = userin.jobtitle;
    var job_label = document.createElement("label");
    job_label.for = 'job';
    job_label.innerHTML = "Job Title";
    job_case.appendChild(job_label);
    job_case.appendChild(job_btn);
    job_case.appendChild(job);
    
    
    //department in which the user is working
    var dept_case = document.createElement('div');
    dept_case.className = 'input-field ';
    dept_case.style.paddingLeft = 5 + '%';
    var dept_btn = document.createElement('a');
    dept_btn.className = "btn";
    dept_btn.id = "dept_btn";
    var dept_icon = document.createElement('i');
    dept_icon.className = "mdi-action-account-balance";
    dept_icon.id = "dept_icon";
    dept_btn.appendChild(dept_icon);
    var dept = document.createElement('input');
    dept.type = "text";
    dept.id = "dept";
    dept.disabled = true;
    dept.value = userin.department;
    var dept_label = document.createElement("label");
    dept_label.for = 'dept';
    dept_label.innerHTML = "Department";
    dept_case.appendChild(dept_label);
    dept_case.appendChild(dept_btn);
    dept_case.appendChild(dept);
    
    
    //contact details of the user
    var contact_case = document.createElement('div');
    contact_case.className = 'input-field';
    contact_case.style.paddingLeft = 5 + '%';
    var contact_btn = document.createElement('a');
    contact_btn.className = "btn";
    contact_btn.id = "contact_btn";
    var contact_icon = document.createElement('i');
    contact_icon.className = "medium mdi-communication-phone";
    contact_icon.id = "contact_icon";
    contact_btn.appendChild(contact_icon);
    var contact = document.createElement('input');
    contact.type = "text";
    contact.id = "contact";
    contact.disabled = true;
    contact.value = userin.phoneno;
    var contact_label = document.createElement("label");
    contact_label.for = 'contact';
    contact_label.innerHTML = "Contact";
    contact_case.appendChild(contact_label);
    contact_case.appendChild(contact_btn);
    contact_case.appendChild(contact);

    
    //edit button on the top write corner
    //initially displayed
    //this button  enables the user details to be edited
    var edit_btn = document.createElement("a");
    edit_btn.className = "btn";
    edit_btn.innerHTML = "Edit";
    edit_btn.id = "edit_btn";
    edit_btn.onclick = edit;
    edit_btn.style.margin = "2%";
    
    
    //replaces the edit button
    //initially the save button display is none
    //once the profile details are attempted to be edited this button is displayed(enabled)
    var save = document.createElement("a");
    save.innerHTML = "Save";
    save.className = "btn";
    save.id = "save";
    save.style.width = 15 + '%';
    save.style.margin = "2%";
    save.onclick = submituserinfo;
    save.style.display = "none";
    
    var error_stmt = document.createElement("label");
    error_stmt.id = "error_stmt";
    error_stmt.innerHTML = "";
    error_stmt.style.float = "left";
    error_stmt.style.color = "red";
    
    //adding all div tags to result page
    main_container.appendChild(container);
    
    container.appendChild(display);
    container.appendChild(document.createElement("br"));
    container.appendChild(sub_container);
    
    sub_container.appendChild(email_case);
    sub_container.appendChild(location_case);
    sub_container.appendChild(job_case);
    sub_container.appendChild(dept_case);
    sub_container.appendChild(contact_case);
    sub_container.appendChild(linkdin_case);
    sub_container.appendChild(error_stmt);
    sub_container.appendChild(edit_btn);
    sub_container.appendChild(save);
}


//removing URL from gallery
//Removing url from DB
function remove(){
    document.getElementById("results").innerHTML = "";
    var but = event.target;
    
    //find the URL to be deleted from the list
    for (i = 0; i < urlgallery.length; i++) {
        //clicking on both delete icon and button has to work
        if(urlgallery[i].url === but.id || urlgallery[i].url + 'del' === but.id) {
            break;
        }
    }
    //constructing an object to send to server
    object3.url = urlgallery[i].url;
    object3.user = user.id;
    
    //some times the URL may be undefined
    //handling 'undefined'
    if (typeof(object3.url) != "undefined") {
        var xmlhttp = buildPutRequest(basic_URL+"/deletedb", object3);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 304)) {
                var response = xmlhttp.responseText;
                //repopulating the gallery items
                viewGallery();
                //checking if the record is deleted
                //reporting deleted
                if(typeof(object3.url) != "undefined"){
                    //logging deletion activity
                    log("Deleted",object3.url);
                }
            } else {    //handling error in deleting
                document.getElementById('results').innerHTML = "";
                errorReport("URL can't be deleted", "Gallery");
            }
        }  
    } else {    //if the specified URL not present request gallery content
        viewGallery();
    }
}


//Updating keywords in solr
//while editing keywords fron gallery page
function updatesolr () {
    //constructing an object 
    var object2 = {};
    //store the URL since URL is the unique key in SOLR
    object2.id = object2.url = urlgallery[count].url;
    //fetch the textbox value from gallery page
    var keys = object1.keywords;
    var arr1 = keys.split(",");
    //making the keywords to uppercase
    for(i = 0; i < arr1.length; i++){
        arr1[i] = arr1[i].toUpperCase();
    }
    //storing the keywords in ibject to send to server
    object2.key = arr1;
    //title attribute is created
    object2.title = "";
    object2.user_info = JSON.stringify(user);
    
    var xmlhttp = buildPutRequest(basic_URL+"/solr", object2);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 304)) {
            var response = xmlhttp.responseText;
        } else if (xmlhttp.status === 500){
            document.getElementById('results').innerHTML = "";
            errorReport("Keywords can't be updated", "Gallery");
        }
    }
}

//Editing Keywords in DB
//in user account (url_details)
function editdb () {
    object1.url = urlgallery[count].url;
    object1.user_id = user.id;
    object1.keywords = document.getElementById(urlgallery[count].url+"keybox").value;
    var caps = object1.keywords;
    object1.keywords = caps.toUpperCase();
    
    var xmlhttp = buildPutRequest(basic_URL+"/editdb", object1);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 304)) {
            var response = xmlhttp.responseText;
            //updating the gallery page
            viewGallery();
            //updating the keywords in solr
            updatesolr();
            //logging 'edit' operation in user account
            log("Edited", urlgallery[count].url);
        } else if (xmlhttp.status === 500) {
            document.getElementById('results').innerHTML = "";
            errorReport("Keywords can't be updated", "Gallery");
        }
    }
}



//Function to edit keywords in UI
function editurl() {
    var i;  //temporary variable for array index
    //get the event originator
    var but = event.target;
    //fing the event target among the lsit of URLs available
    for (i = 0; i < urlgallery.length; i++) {
        //clicking on the button and icon both generates onclick event
        if(urlgallery[i].url+"edit" === but.id || urlgallery[i].url+"edit_icon" == but.id) {
            break;
        }
    }
    //storing the URL index
    count = i;
    var target = document.getElementById(urlgallery[i].url+"label");
    var text = document.createElement('input');
    text.id = urlgallery[i].url+"keybox";
    text.type = "text";
    //if there is no custom tags
    if (target.innerHTML === "Add Tags") {
        text.value = "";
    } else {    //populating the label content if any keyword is available
        text.value = target.innerHTML;
    }
    text.style.float = "left";
    text.style.color = "black";
    text.style.width = 50 + '%';
    text.style.borderBottom = "1px solid black";
    var t = document.getElementById(urlgallery[i].url+"key");
    //removing the label and appending textbox
    t.innerHTML = "";
    t.appendChild(text);
    t.appendChild(document.createElement('br'));
    //hiding edit and displaying save
    document.getElementById(urlgallery[i].url+"edit").style.display = 'none';
    document.getElementById(urlgallery[i].url+"save").style.display = 'initial';
}



//Displaying gallery of the user
function viewGallery () {
    //initializing the web page to initial state
    initialState();
    var xmlhttp = buildPutRequest(basic_URL+"/gallery", user);
    //empty the search textbox
    document.getElementById("search_textbox").value = "";
    document.getElementById("results").style.width = 100 + '%';
    document.getElementById("workingArea").style.width = 0 + '%';
    
    xmlhttp.onreadystatechange = function() {
        //changin g the URL hash value
        window.location.hash = "params=gallery";
        if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 304)) {
            urlgallery = JSON.parse(xmlhttp.responseText);
            //populating the gallery with received data
            populateGallery();
        } else {
            document.getElementById('results').innerHTML = "";
            errorReport(xmlhttp.responseText, "Gallery");
        }
    }
}


//populating the gallery data to results page
function populateGallery () {
    var container = document.getElementById("results");
    container.innerHTML = "";
    
    //handling empty set
    if (urlgallery.length === 0) {
        errorReport("No URLs added yet", "Gallery");
    } else {
        for(i = 0; i < urlgallery.length; i++) {
            var container2 = document.createElement('div');
            container2.id = urlgallery[i].url+"case";
            container2.className = "row";
            container2.style.marginLeft = 2 + "%";
            
            //third section of the div
            //contains the URl
            var link = document.createElement('a');
            link.href = urlgallery[i].url;
            var li = document.createElement("div");
            li.innerHTML = urlgallery[i].url;
            li.style.cursor = "pointer";
            li.style.width = "inherit";
            li.style.paddingTop = "3px";
            li.className = "indigo-text";
            li.style.width = "60%";
            li.style.fontSize = '1.1em';
            li.style.overflowX = "auto";
            
            //create keywords div and label
            var key = document.createElement('div');
            key.id = urlgallery[i].url+"key";
            key.style.width = "inherit";
            var label = document.createElement('label');
            label.id = urlgallery[i].url+"label";
            label.className = "col s8";
            label.style.float = "left";
            label.style.color = '';
            label.style.fontSize = '1em';
            if (urlgallery[i].keywords === "") {
                label.innerHTML = "Add keys";
            } else {
                label.innerHTML = urlgallery[i].keywords;
            }
            key.appendChild(label);

            
            //contains the save,edit and delete buttons
            var btn_container = document.createElement('div');
            btn_container.style.float = "left";
            btn_container.style.width = "10%";
            btn_container.className = "row";
            btn_container.style.paddingRight="2%";
            btn_container.style.width = "inherit";
            btn_container.style.position = "relative";
            
            //edit button
            var edit_icon = document.createElement('i');
            edit_icon.className = "mdi-editor-mode-edit";
            edit_icon.id = urlgallery[i].url + 'edit_icon';
            var edit = document.createElement("a");
            edit.className = "btn-floating btn-tiny waves-effect waves-light";
            edit.id = urlgallery[i].url+"edit";
            edit.style.cursor = "pointer";
            edit.style.backgroundColor = "#00bcd4";
            edit.style.float = "left";
            edit.onclick = editurl;
            edit.appendChild(edit_icon);
            
            //save button
            var save_icon = document.createElement('i');
            save_icon.className = "mdi-content-save";
            save_icon.id = urlgallery[i].url + 'edit_icon';
            var save = document.createElement("a");
            save.className = "btn-floating btn-tiny waves-effect waves-light";
            save.id = urlgallery[i].url+"save";
            save.style.float = 'left';;
            save.style.cursor = "pointer";
            save.style.backgroundColor = "#66bb6a";
            save.style.display = 'none';
            save.onclick = editdb;
            save.appendChild(save_icon);
            
            //delete button
            var del = document.createElement('i');
            del.className = "mdi-action-delete";
            del.id = urlgallery[i].url;
            //del.onclick = remove;
            var cross = document.createElement('a');
            cross.className = "btn-floating btn-tiny waves-effect waves-light";
            cross.id = urlgallery[i].url+'del';
            cross.onclick = remove;
            cross.style.backgroundColor = "rgb(218, 91, 91)";
            cross.appendChild(del);
            
            //a separator horizontal line between each entry
            var divider = document.createElement('div');
            divider.className = "divider";
            
            //appending the div tags
            container2.appendChild(btn_container);
            link.appendChild(li);
            container2.appendChild(link);
            container2.appendChild(key);
            btn_container.appendChild(edit);
            btn_container.appendChild(save);
            btn_container.appendChild(cross);
            container2.appendChild(document.createElement('br'));
            container2.appendChild(document.createElement('hr'));
            container.appendChild(container2);
        }
    }
    
}





//Log of the current user
function viewLog() {
    //initializing the web page to initial state
    initialDiv();
    initialState();
    var httpurl = basic_URL + "/log";
    //constructing an object
    var obj = {};
    //empty the search textbox
    document.getElementById("search_textbox").value = "";
    obj.id = user.id;
    //sending request
    var xmlHttp = buildPutRequest(httpurl,  obj);
    xmlHttp.onreadystatechange = function () {
        document.getElementById("workingArea").style.width = 0 + "%";
        document.getElementById("results").style.width = 100 + '%';
        if ((xmlHttp.status === 200 || xmlHttp.status === 304) && xmlHttp.readyState === 4) {
            var res = JSON.parse(xmlHttp.responseText);
            document.getElementById('results').innerHTML = "";
            if (res.length === 0) {
                errorReport("No entries as for now", 'Activity Log');
            } else {    //populate the log entries
                for (i = 0; i < res.length; i += 1) {
                    var container = document.createElement('div');
                    container.className = "row contain";
                    container.style.margin = 1 + '%';
                    container.style.marginLeft = 2 + '%';
                    
                    //first section containing the activity
                    var activity = document.createElement('div');
                    activity.className = "col s2";
                    activity.innerHTML = res[i].activity;
                    
                    //secong section 
                    //timestamp
                    var date = document.createElement('div');
                    date.className = "col s2";
                    var d = new Date(res[i].time_log);
                    date.innerHTML = d.getDate() + "/" + (d.getMonth() + 1) + '/' + d.getFullYear() + " "  + d.getHours() + ":" + d.getMinutes();
                    
                    //third section
                    //URL
                    var url = document.createElement('a');
                    url.href = res[i].url;
                    var url1 = document.createElement('div');
                    url1.className = "col s8 teal-text";
                    url1.innerHTML = res[i].url;
                    url.appendChild(url1);

                    var divide = document.createElement('div');
                    divide.className = "divider";

                    container.appendChild(activity);
                    container.appendChild(date);
                    container.appendChild(url);

                    document.getElementById('results').appendChild(container);
                    document.getElementById("results").appendChild(divide);
                }
            }
            
        } else {
            document.getElementById('results').innerHTML = "";
            errorReport(xmlHttp.responseText, "Activity log");
        }
        //changing the URL hash value
        window.location.hash = "params=log";
    };
}

//logging activities for a users
function log(msg, pass_url) {
    var t = basic_URL + "/logging";
    var data = {};
    data.id = user.id;
    data.url = pass_url;
    data.activity = msg;
    
    var xmlhttp = buildPutRequest(t, data);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 304)) {
            console.log('Activity logged');
        } else {
            console.log(xmlhttp.responseText);
        }
    };
}