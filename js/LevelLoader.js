function loadXMLDoc() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		console.log("Ready state: " + this.readyState + " - Status: " + this.status);
		if(this.readyState == 4 && this.status == 200) {
			console.log("Fired");
			//Typical action to be performed when the document is ready:
			document.getElementById("demo").innerHTML = this.resposeText;
		}
	};
	xhttp.open("GET", "hello_world.txt", true);
	xhttp.send();
}
