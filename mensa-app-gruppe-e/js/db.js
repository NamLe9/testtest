function configFire(){
    var firebaseConfig = {
        apiKey: "AIzaSyArny4N6PT9WUL1ZEhgBNoL3D3isBJ7FC4",
        authDomain: "mensabolt.firebaseapp.com",
        databaseURL: "https://mensabolt.firebaseio.com",
        projectId: "mensabolt",
        storageBucket: "mensabolt.appspot.com",
        messagingSenderId: "742652012941",
        appId: "1:742652012941:web:6280cc0839233b916b75c4",
        measurementId: "G-D2PLQBSF5J"
      };
    return firebaseConfig;
}

async function pushData(api_url2) {
        alert("hier");
        const response = await fetch(api_url2);
        const data = await response.json();
        alert(data.length);
        for(var i = 0; i < data.length; i++){
            db.collection('mensen').add(JSON.parse(JSON.stringify({
                id: data[i].id,
                name: data[i].name,
                city: data[i].city,
                address: data[i].address,
                coordinates: [{0:data[i].coordinates[0], 1:data[i].coordinates[1]}]
            })));
        }
        var expires = "";
        var date = new Date();
        date.setTime(date.getTime() + (2000*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
        document.cookie = "dataUpload" + "=" + ("true" || "")  + expires + "; path=/";
}
