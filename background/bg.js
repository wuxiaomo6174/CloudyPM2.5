/**
 * Created by wuyanc on 3/19/2015.
 */

//check location
//if no location create option page and send a request initially
//every 15 minutes to get a request
function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}
function formatCity(result){
    var res= JSON.parse(result);
    var city=res.result.addressComponent.city;
    if(city.indexOf('市')){
       city= city.slice(0,city.length-1);
    }
    return city;
}
function getCity(longitude,latitude){
//    var latitude ="121.608778 ";
//    var longitude="31.216795";
    //localStorage.setItem("longitude",position.coords.longitude);
    var url="http://api.map.baidu.com/geocoder/v2/?ak=71709218d45a706b9c7e3abc2f037b23&callback=?&" +
        "location="+longitude+","+latitude+"&output=json&pois=1";

    httpRequest(url,function(result){
        if(result){
            var city=formatCity(result);
            localStorage.setItem('city',city);
            console.log('city: '+city);
        }


    })
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {//chrome always support geo location
       console.log( "Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {

    localStorage.setItem("latitude",position.coords.latitude);
    localStorage.setItem("longitude",position.coords.longitude);
    var city = getCity(position.coords.latitude,position.coords.longitude);
    localStorage.setItem("city",city);
}
//result sample
var a=[{"aqi":38,"area":"上海","pm2_5":26,"pm2_5_24h":26,"quality":"优","primary_pollutant":"","time_point":"2015-02-02T15:00:00Z"}];
//send example
var token = "vcTxhhdD8xUup5TYeSqY";
var weatherUrl = "http://www.pm25.in/api/querys/pm2_5.json?";
var city="shanghai";
var query = weatherUrl+ "city="+city+"&"+"token="+token;



function main(){

    if(localStorage['city']=='undefined'||!localStorage['city']){
        //chrome.tabs.create({url:"options.html"});
        city='beijing';
    }
    else{
        city=localStorage['city'];
    }
    var url = weatherUrl+ "city="+city+"&"+"token="+token;
    httpRequest(url,function(res){
        var result= JSON.parse(res);
        var pm= void 0;
        if(result&&!result["error"]){
             pm =result[result.length-1]["pm2_5"];
        }
        if(pm){
            chrome.browserAction.setBadgeBackgroundColor({color:'#113340'});
            chrome.browserAction.setBadgeText({text:pm.toString()});
        }

    });

    setTimeout(main,60000);
}

getLocation();
//repeat running after 2 seconds
setTimeout(main,2000);
