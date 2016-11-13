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
               "<p>Link: <a href=" + this._url + ">"+this._url+"</a></p>";
    }

}

function buildGETurl(lat, long) {
    //alert(lat.toFixed(4));
    //alert(long.toFixed(4));
    return "https://api.seatgeek.com/2/events?lat=" + lat.toFixed(4) + "&lon=" + long.toFixed(4) + "&range=25mi";
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
    
    google.maps.event.addListener(marker, "click", function() {
        infoWindow.open(map, marker);
    })
}

function getLocation(lat, long) {
    var philadelphia = new google.maps.LatLng(lat, long)

    var map = new google.maps.Map(document.getElementById("map"), {
        center: philadelphia,
        zoom: 12,
        scrollwheel: false
    });

    var results = buildGETurl(lat, long);
    var mydump = httpGet(results);
    
    console.log(mydump);
    var toShows = JSONtoShow(JSON.parse(mydump));
    console.log(toShows);

    var infowindow = new google.maps.InfoWindow( function (contentString) {
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

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            getLocation(position.coords.latitude, position.coords.longitude);
        });
    } else {
        getLocation(40, 90);
    }
}