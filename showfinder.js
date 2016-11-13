/*
 * ShowFinder
 * Sam Rizer
 * 12 November 2016
 */

class Show {

    constructor(_id, _title, _datetime, _venueName, _venueLat, _venueLng, _url) {
        this._id = _id;
        this._title = _title;
        this._datetime = _datetime;
        this._venueName = _venueName;
        this._venueLat = _venueLat;
        this._venueLng = _venueLng;
        this._url = _url;
    }

    toReadableDate() {
        var d = new Date();
    }

    toString() {
        return "<div id='content'>" +
            "<div id='siteNotice'>" +
            "</div>" +
            "<h3 id='firstHeading' class='firstHeading'>" + this._title + "</h1>" +
            "<p><b>" + this._venueName + "</b> on " + this._datetime + "</p>" +
            "<p>Link: <a href=" + this._url + ">" + this._url + "</a></p>";
    }

}

var philly = {
    lat: 39.9526,
    lon: -75.1652
};
var nyc = {
    lat: 40.7128,
    lon: -74.0059
};

function buildGETurl(lat, long) {
    //alert(lat.toFixed(4));
    //alert(long.toFixed(4));
    return "https://api.seatgeek.com/2/events?lat=" + lat.toFixed(4) + "&lon=" + long.toFixed(4) + "&range=15mi";
}

function JSONtoShow(x) {
    var y = [];
    for (var i in x.events) {
        console.log(x.events[i])
        var q = x.events[i];
        y.push(new Show(q.id, q.title, q.datetime_local, q.venue.name, q.venue.location.lat, q.venue.location.lon, q.url));
    }
    return y;
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function addInfoWindow(marker, message) {
    var infoWindow = new google.maps.InfoWindow({
        content: message
    });

    google.maps.event.addListener(marker, "click", function () {
        infoWindow.open(map, marker);
    })
}

function generateMarkers(lat, long, map) {
    var results = buildGETurl(lat, long);
    var mydump = httpGet(results);

    console.log(mydump);
    var toShows = JSONtoShow(JSON.parse(mydump));
    console.log(toShows);

    var infowindow = new google.maps.InfoWindow(function (contentString) {
        content: contentString
    });

    for (var i in toShows) {
        console.log(i.toString());
        var marker = new google.maps.Marker({
            map: map,
            title: toShows[i]._title,
            position: {
                lat: toShows[i]._venueLat,
                lng: toShows[i]._venueLng
            }
        });
        addInfoWindow(marker, toShows[i].toString());
    }
}

function getLocation(lat, long) {
    var me = new google.maps.LatLng(lat, long)

    var map = new google.maps.Map(document.getElementById("map"), {
        center: me,
        zoom: 13,
        scrollwheel: false
    });

    var myTitle = document.createElement("h1");
    myTitle.style.color = "blue"
    myTitle.innerHTML = "Showfinder";
    var myTextDiv = document.createElement('div');
    myTextDiv.appendChild(myTitle);

    map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(myTextDiv);
    generateMarkers(lat, long, map);
    
    var centerPhillyDiv = document.createElement('div');
    var centerPhilly = new CenterPhilly(centerPhillyDiv, map);

    centerPhillyDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerPhillyDiv);
    
    var centerNYCDiv = document.createElement("div");
    var centerNYC = new CenterNYC(centerNYCDiv, map);
    
    centerNYCDiv.index = 2;
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerNYCDiv);
    
    var centerHomeDiv = document.createElement("div");
    var centerHome = new CenterHome(centerHomeDiv, map);
    
    centerHomeDiv.index = 2;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerHomeDiv);
}

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            getLocation(position.coords.latitude, position.coords.longitude);
        });
    } else {
        getLocation(40, 90);
    }
}

function CenterPhilly(controlDiv, map) {
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to center on Philadelphia';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'To Philly';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {
        map.setCenter(philly);
        getLocation(philly.lat, philly.lon);
    });
}

function CenterNYC(controlDiv, map) {
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to center on New York City';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'To NYC';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {
        map.setCenter(nyc);
        getLocation(nyc.lat, nyc.lon);
    });
}

function CenterHome(controlDiv, map) {
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to center on your location.';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Home';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            getLocation(position.coords.latitude, position.coords.longitude);
        });
    });
}

