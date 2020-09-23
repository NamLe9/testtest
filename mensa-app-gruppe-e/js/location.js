//Standort Mensa
async function getMensen(mymap, api_url) {
    const response = await fetch(api_url);
    const data = await response.json();
    var latitudes;
    var longitudes;
    for (var i = 0; i < data.length; i++) {
        if(data[i].city == getCookie("city")){
            mid = data[i].id;
            name = data[i].name;
            latitudes = data[i].coordinates[0];
            longitudes = data[i].coordinates[1];
            var marker = new L.marker([latitudes, longitudes]);
            marker.on('click', function (e) {
                setCookie('mensaID', data[i].id);
                window.open("/pages/speisekarte.html"); 
            });
            marker.addTo(mymap);
        }
    }
}

//saving names, coordinates and IDs of Mensas to create list
function getMensenNamen(latitudes, longitudes, mensaId, names) {
    var i = 0;
    var ul = document.getElementsByClassName("collection with-header")[0];
    for(i in names){
      var li = createElement(i, latitudes, longitudes, mensaId, names);
      ul.appendChild(li);
      document.getElementById('mensa' + i).textContent = names[i].replace(/^(.{20}[^\s]*).*/, "$1") + "\n";
    }
}

//getting data of cities and saving in array
function getCities(cities) {
    var cities_new = removeDups(cities);
    var i = 0;
    var ul = document.getElementsByClassName("collection with-header 2")[0];
    for(i in cities_new){
      var li = createCity(i, cities_new);
      ul.appendChild(li);
      document.getElementById('city' + i).textContent = cities_new[i];
    }
}

//getting meals to save them in speisekarte.html
async function getFood(mensaID, day, month, year) {
    api_url = 'https://openmensa.org/api/v2/canteens/' + mensaID + '/days/'
                + year + '-' + month + '-' + day + '/meals/';
    const response = await fetch(api_url);
    const data = await response.json();
    for (var i = 0; i < data.length; i++) {
        var prices = document.getElementsByClassName("prices");
        switch(data[i].category){
            case "Salate":
                    getFoodNamePrice("salate", data, i, prices);
                break;
            case "Vorspeisen":
                    getFoodNamePrice("vorspeisen", data, i, prices);
                break;
            case "Suppen":
                    getFoodNamePrice("suppen", data, i, prices);
                break;
            case "Aktionen":
                    getFoodNamePrice("aktionen", data, i, prices);    
                break;
            case "Essen":
                    getFoodNamePrice("essen", data, i, prices);
                break;
            case "Beilagen":
                    getFoodNamePrice("beilagen", data, i, prices);
                break;
            case "Desserts":
                    getFoodNamePrice("desserts", data, i, prices);
                break;
        }
    }
}

async function notify() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    api_url = 'https://openmensa.org/api/v2/canteens/' + getCookie("favMenID") + '/days/'
                + yyyy + '-' + mm + '-' + dd + '/meals/';
    const response = await fetch(api_url);
    const data = await response.json();
    
    if (getCookie("checkboxPush") == "checked") {
            if(getCookie('favMen') != null){
                for(var k = 0; k < data.length; k++){
                    for(var i = 0; i < 50; i++){
                        if(getCookie('fav' + i) == data[k].name){
                            var notification = new Notification('HEUTE!', {
                                body: "" + getCookie('fav' + i) + " in der " + getCookie('favMen'),
                                });
                        } 
                    }
                }
            }
    }
}

//ask for location 
function ermittlePosition() {
    navigator.geolocation.getCurrentPosition(zeigePosition, zeigeFehler); //Für Positionsabfrage
    navigator.geolocation.watchPosition(zeigePosition, zeigeFehler);  //Für Verfolgung
    
    function zeigeFehler(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "Benutzer lehnte Standortabfrage ab."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Standortdaten sind nicht verfügbar."
                break;
            case error.TIMEOUT:
                x.innerHTML = "Die Standortabfrage dauerte zu lange (Time-out)."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "unbekannter Fehler."
                break;
        }
    }
}

function zeigePosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    marker2.setLatLng([lat, lon]);
    mymap.setView([lat, lon], 10)
}
    

//deleting duplications in cities array
function removeDups(names) {
    let unique = {};
    names.forEach(function(i) {
      if(!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }

//functions for setting, getting and deleting cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  }

function createElement(i, latitudes, longitudes, id, names){
  var liTag = document.createElement("li");
  var divTag = document.createElement("div");
  var spanTag = document.createElement("span");
  var spanTag2 = document.createElement("span");
  var iTag = document.createElement("i");
  var aTag = document.createElement("a");
  var node = document.createTextNode("send");
  var node2;
  liTag.className += "collection-item crop";
  spanTag.id = "mensa" + i;
  aTag.href = "/pages/speisekarte.html";
  spanTag2.id = "favMen" + i;
  aTag.className += "secondary-content";
  iTag.className += "material-icons orange-text text-lighten-2";
  var divTag2 = document.createElement("div");
  var iTag2 = document.createElement("i");
  iTag2.className += "material-icons orange-text text-lighten-2";
    if(getCookie('favMen') != names[i]){
        node2 = document.createTextNode("star_border");
    }
    else{
        node2 = document.createTextNode("star");
    }
  
  liTag.appendChild(divTag);
  divTag.appendChild(spanTag);
  divTag.appendChild(aTag);
  divTag.appendChild(divTag2);
  divTag2.appendChild(iTag2);
  aTag.appendChild(iTag);
  aTag.addEventListener('click', 
  function(){
    setCookie("mensaID", id[i]);
    console.log();
    setCookie('latitude_location', latitudes[i]);
    setCookie('longitude_location', longitudes[i]);
  });
  iTag2.addEventListener('click', 
    function(){
        node2.nodeValue = "star";
        setCookie('favMen', names[i], 1000);  
        setCookie('favMenID', id[i], 1000);  
    });
  iTag.appendChild(node);
  iTag2.appendChild(node2);

  return liTag;
}

 function createFavMen(i){
    var liTag = document.createElement("li");
    var divTag = document.createElement("div");
    var spanTag = document.createElement("span");
    var iTag = document.createElement("i");
    var node = document.createTextNode("cancel");
    iTag.className += "material-icons orange-text text-lighten-2 right";
    liTag.className += "collection-item " + i;
    spanTag.id = 'favMen' + i;
    liTag.appendChild(divTag);
    divTag.appendChild(spanTag);
    divTag.appendChild(iTag);
    iTag.addEventListener('click', 
        function(){
            node.nodeValue = "cached";
            deleteCookie('favMen');  
            $(".collection-item " + i).remove();
        });
    iTag.appendChild(node);
    console.log(liTag);
    return liTag;
}

function createCity(i, cities){
    var liTag = document.createElement("li");
    var divTag = document.createElement("div");
    var spanTag = document.createElement("span");
    var iTag = document.createElement("i");
    var aTag = document.createElement("a");
    var node = document.createTextNode("send");
    liTag.className += "collection-item crop";
    spanTag.id = "city" + i;
    aTag.href = "/pages/mensen.html";
    aTag.className += "secondary-content";
    iTag.className += "material-icons orange-text text-lighten-2";
    
    liTag.appendChild(divTag);
    divTag.appendChild(spanTag);
    divTag.appendChild(aTag);
    aTag.appendChild(iTag);
    aTag.addEventListener('click', 
    function(){
  
      setCookie('city', cities[i]);
  
  
    });
    iTag.appendChild(node);
    return liTag;
  }

function getFoodNamePrice(speise, data, i, prices) {
    var ul = document.getElementsByClassName("collection with-header " + speise)[0];
    var li = createSpeise(data[i].id, data, i);
    ul.appendChild(li);
    if(data[i].prices['students'] != null){
        prices[i].innerText = data[i].prices['students'] + '€ ';
    }
    for(var k = 0; k < data[i].notes.length; k++){
        switch(data[i].notes[k]){
            case "vegan":
                prices[i].appendChild(getPic("/img/vegan.png", prices));
                break;
            case "vegetarisch":
                prices[i].appendChild(getPic("/img/vegetarisch.png", prices));
                break;
            case "bio":
                prices[i].appendChild(getPic("/img/bio.png", prices));
                break;
            case "Klimaessen":
                prices[i].appendChild(getPic("/img/klimaessen.png", prices));
                break;
            case "MSC":
                prices[i].appendChild(getPic("/img/MSC.png", prices));
                break;
            case "grün (Ampel)":
                prices[i].appendChild(getPic("/img/ampel_gruen.png", prices));
                break;
            case "gelb (Ampel)":
                prices[i].appendChild(getPic("/img/ampel_gelb.png", prices));
                break;
            case "rot (Ampel)":
                prices[i].appendChild(getPic("/img/ampel_rot.png", prices));
                break;
        }
    }


    document.getElementById(data[i].id).textContent = data[i].name;
}

function getPic(path){
    var img = document.createElement("img");
    img.src = path;
    return img;
}

function createSpeise(id, data, i){
    var liTag = document.createElement("li");
    var divTag = document.createElement("div");
    var divTag2 = document.createElement("div");
    var spanTag = document.createElement("span");
    var iTag = document.createElement("i");
    if(getCookie('fav' + i) == null){
        var node = document.createTextNode("star_border");
    }
    else{
        var node = document.createTextNode("star");
    }
    iTag.className += "material-icons orange-text text-lighten-2 right";
    liTag.className += "collection-item";
    divTag2.className += "prices";
    spanTag.id = id;
    
    
    liTag.appendChild(divTag);
    divTag.appendChild(spanTag);
    divTag.appendChild(iTag);
    divTag.appendChild(divTag2);

    iTag.addEventListener('click', 
    function(){
        node.nodeValue = "star";
        setCookie('fav' + i, data[i].name, 1000);  
    });
    iTag.appendChild(node);

    return liTag;
  }

  function createFavoriten(i){
    var liTag = document.createElement("li");
    var divTag = document.createElement("div");
    var spanTag = document.createElement("span");
    var iTag = document.createElement("i");
    var node = document.createTextNode("cancel");
    iTag.className += "material-icons orange-text text-lighten-2 right";
    liTag.className += "collection-item " + i;
    spanTag.id = 'fav' + i;
    liTag.appendChild(divTag);
    divTag.appendChild(spanTag);
    divTag.appendChild(iTag);
    iTag.addEventListener('click', 
        function(){
            node.nodeValue = "cached";
            deleteCookie('fav' + i);  
            $(".collection-item " + i).remove();
        });
    iTag.appendChild(node);
    return liTag;
  }

