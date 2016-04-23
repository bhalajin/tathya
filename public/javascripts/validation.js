//validates the various textboxes' input

//validate contatc details of a user in profile
function validateContact () {
    var string = document.getElementById("contact").value;
    //pattern checks for non-number value in the string
    var pattern = /[^0-9]/g;
    var res = string.match(pattern);
    if (res === null) {
        console.log("only digits");
        if (string.length === 11) {
            res = string.match(/\b0/);
            if (res === null) {
                document.getElementById("contact").value = "";
                document.getElementById("contact").focus();
                document.getElementById("error_stmt").innerHTML += '<br>' + "Enter a valid contact number";
                return "";
            } else {
                return string;
            }
        } else if (string.length === 10) {
            console.log("length 10");
            return string;
        } else {
            document.getElementById("contact").value = "";
            document.getElementById("contact").focus();
            document.getElementById("error_stmt").innerHTML += '<br>' + "Enter a valid contact number";
            return "";
        }
    } else {
        //checks for 10/13 character in the number
        if (string.length === 13) {
            res = string.match(/\b+91/);
                if (res === null) {
                    document.getElementById("contact").value = "";
                    document.getElementById("contact").focus();
                    document.getElementById("error_stmt").innerHTML += '<br>' + "Enter a valid contact number";
                    return "";
                } else {
                    return string;
                }
        } else {
            document.getElementById("contact").value = "";
            document.getElementById("contact").focus();
            document.getElementById("error_stmt").innerHTML += '<br>' + "Enter a valid contact number";
            return "";
        }
    }
}

//validate deparment in profile page
function validateDepartment () {
    var string = document.getElementById("dept").value;
    console.log("deparment" + string);
    var pattern = /[^a-z]/g;
    var res = string.match(pattern);
    if (res === null) {
        console.log("no error in department");
        return string;
    } else {
        res = string.match(/\s/g);
        if (res !== null) {
            console.log("space in deparment name");
            return string;
        } else {
            document.getElementById("dept").value = "";
            document.getElementById("dept").focus();
            document.getElementById("error_stmt").innerHTML += '<br>' + "Enter a valid department";
            return "";
        }
    }
}

//validate job value
function validateJob () {
    var string = document.getElementById("job").value;
    var pattern = /[^a-z]/g;
    var res = string.match(pattern);
    if (res === null) {
        return string;
    } else {
        res = string.match(/\s/g);
        if (res !== null) {
            return string;
        } else {
            document.getElementById("job").value = "";
            document.getElementById("job").focus();
            document.getElementById("error_stmt").innerHTML += '<br>' + "Enter a valid department";
            return "";
        }
    }
}

//validate job location value
function validateLocation () {
    var string = document.getElementById("location").value;
    console.log("location" + string);
    var pattern = /[^a-z]/g;
    var res = string.match(pattern);
    var str = string.toUpperCase();
    if (res === null) {
        if (str === "BANGALORE" || str === "BENGALURU" || str === "COIMBATORE") {
            console.log("No error in location");
            return string;
        } else {
            document.getElementById("location").value = "";
            document.getElementById("location").focus();
            document.getElementById("error_stmt").innerHTML += '<br>' + "Enter a valid location";
            return "";
        }
    } else {
        document.getElementById("location").value = "";
        document.getElementById("location").focus();
        document.getElementById("error_stmt").innerHTML += '<br>' + "Enter a valid location";
        return "";
    }
}


//validate linkedin URL
function validateLinkdin() {
    var string = document.getElementById("linkdin").value;
    var pattern = /\bhttps:\/\/linkedin.com/;
    var res = string.search(pattern);
    if (res === 0) {
        return string;
    } else {
        if (string.search("https://in.linkedin.com") === 0) {
            return string;
        } else {
            document.getElementById("linkdin").focus();
            document.getElementById("error_stmt").innerHTML += '<br>' + "Enter a valid linkedin URL";
            return "";
        }
    }
}