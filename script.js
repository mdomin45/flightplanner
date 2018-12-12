var root = 'http://comp426.cs.unc.edu:3001/';
var google_key = 'AIzaSyDIxU9xHMPzFMlWoJq9sIvLYhlfv1KSH5g';
var iata_key ='7696a162-f86a-4dfe-898b-93b5320c6818'
var mode_one;
var mode_two;
var map;
var dep_port_id;
var arr_port_id;

function initMap() {
  // The location of center of US
  var start = {lat: 39.8333333, lng: -98.585522};
  // The map, centered on US
  map = new google.maps.Map(
      document.getElementById('map'), {
      	zoom: 4, 
      	center: start
      });
}


function creating_options(){
    //age dropdown
    for(var i = 1; i<=120; i++){
        var opt = document.createElement('option');
        opt.value=i;
        opt.innerHTML=i;
        document.getElementById('age').appendChild(opt);
    }
}

/*function findDepCoords() {
	let airport_code = $('#dep-port-code').val();
	let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+airport_code+'&key='+google_key
	console.log(url);
	$.ajax(url, {
		type: 'GET',
		datatype: 'json',
		success: (response) => {
			console.log(response.results);
			let place = {};
			place['lat'] = response.results[0]['geometry']['location']['lat'];
			place['lng'] = response.results[0]['geometry']['location']['lng'];
			var marker = new google.maps.Marker({position: place, map: map});
		}
	});
}
function findArrCoords() {
	let airport_code = $('#arr-port-code').val();
	let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+airport_code+'&key='+google_key
	console.log(url);
	$.ajax(url, {
		type: 'GET',
		datatype: 'json',
		success: (response) => {
			console.log(response.results);
			let place = {};
			place['lat'] = response.results[0]['geometry']['location']['lat'];
			place['lng'] = response.results[0]['geometry']['location']['lng'];
			var marker = new google.maps.Marker({position: place, map: map});
		}
	});
}*/

function findCoords(x){
    let airport_code = x;
	let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+airport_code+'&key='+google_key

	console.log(url);

	$.ajax(url, {
		type: 'GET',
		datatype: 'json',
		success: (response) => {
			console.log(response.results);
			let place = {};
			place['lat'] = response.results[0]['geometry']['location']['lat'];
			place['lng'] = response.results[0]['geometry']['location']['lng'];
			var marker = new google.maps.Marker({position: place, map: map});
           
		}
	});
}
//change border of input box
function codeinputBox(id, bool){
    if(bool){
        $('#'+id).css('border-color','initial');
    }else{
        alert('This is not a valid airport code');
        $('#'+id).css({'border-color':'red', 'border_style':'solid'});
    }
}
function validateCode(x){
    let airport_code=x.value;
    let url='https://cors-anywhere.herokuapp.com/'+'http://iatacodes.org/api/v6/airports?api_key=7696a162-f86a-4dfe-898b-93b5320c6818&lang=en&code='+airport_code;
    
    console.log(url);
    
    $.ajax(url,{
        type:'GET',
        datatype:'json',
        success:(data)=>{
            console.log(data);
            if(data['response'].length > 0){
                codeinputBox(x.getAttribute('id'), true);
                findCoords(x.value);
            } else{
                codeinputBox(x.getAttribute('id'), false);
            }
        }
    });
}

$(document).ready(function() {
	$.ajax(root + 'sessions', 
		{
		type: 'POST',
		xhrFields: {withCredentials: true},
		data: {
			'user': {
				'username': 'msdoming',
				'password': 'spencer'
			}
		},
		success: (response) => {
			console.log(response);
		},
		error: (jhqxr, some, error) => {
			console.log(error);
		}
	});

	creating_options();
    
    //Test code for autocomplete
    window.addEventListener('load', function(){ 
    document.getElementById('dep-port-code').addEventListener("keyup", function(event){hinter(event)});
    document.getElementById('arr-port-code').addEventListener("keyup", function(event){hinter(event)});
    
    window.hinterXHR = new XMLHttpRequest();
    
    
    });
    
    function hinter(event){
        var input=event.target;
        //datalist
        var huge_list = document.getElementById('huge_list');
        var min_characters = 1;
        
        if(input.value.length<=min_characters){return;
        } else{
            window.hinterXHR.abort();
            window.hinterXHR.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    var ex = JSON.parse(this.responseText);
                    console.log(ex);
                    if(ex['response']==undefined){
                        return;
                    }
                    var response = ex['response']['airports'];
                    
                    huge_list.innerHTML="";
                    
                    response.forEach(function(item){
                                     var option = document.createElement('option');
                                     option.value = item['code'];
                                     huge_list.appendChild(option);
                                     });
                }
            };
            
            window.hinterXHR.open("GET", 'https://cors-anywhere.herokuapp.com/'+'http://iatacodes.org/api/v6/autocomplete?api_key=7696a162-f86a-4dfe-898b-93b5320c6818&lang=en&query='+input.value, true);
            window.hinterXHR.send()
        }
    }
    
    //end test code for autocomplete
    
    //Holds html elements for form
    mode_one = $('.mode_one');
    mode_two = $('.mode_two');

	// user submits the flight info
	$('#submit-flight-info').click(function() {
		// collect the input data and assign variables
		let num_flights = $('#num-flights').val();
		let flyer_info = {}; // dictionary containing all information given in the form
        
        //passenger info
		flyer_info['flyer_first_name'] = $('#first-name').val();
		flyer_info['flyer_last_name'] = $('#last-name').val();
		flyer_info['flyer_email'] = $('#email').val();
        flyer_info['flyer_age'] = $('#age').val();
        flyer_info['flyer_gender'] = $('#gender').val();
        
        //flight info
        flyer_info['flight_number'] = $('#flight-num').val();
        flyer_info['dep_time'] = $('#dep-time').val();
        flyer_info['arr_time'] = $('#arr-time').val();
        flyer_info['seat'] = $('#seat').val();
        flyer_info['dep_port'] = $('#dep-port').val();
        flyer_info['dep_port_code'] = $('#dep-port-code').val();
        flyer_info['arr_port'] = $('#arr-port').val();
        flyer_info['arr_port_code'] = $('#arr-port-code').val();
		
       // create airport (if it doesn't exist)
        checkAirport(flyer_info);
        

		// debugging prints
		//str = JSON.stringify(flyer_info); // creates a loggable string from the dict
		//console.log(str); // logging the dict

        //createTicket(flyer_info);
		// grab the weather, map information from 3rd-party APIs

		// change the mode to "review" mode (weather, maps, itinerary formatted, etc.)
        mode_one.hide();
        mode_two.show();

		// allow the user to return to the "create itinerary" mode (likely button)


	});
    //c is the code, n is the name, 1 is departure 2 is arrival)
    //check if airport for departure exists, if not create one, then check if airport of arrival exists, if not create one, take airport ids and make flight
	function checkAirport(f) {
		$.ajax(root + 'airports?filter[code]='+f['dep_port_code'], {
			type: 'GET',
			datatype: 'json',
            cache: false,
			xhrFields: {withCredentials: true},
			success: function(data) {
                console.log(data);
				
				if (data.length == 0) {
					console.log('make a new one');
					$.ajax(root + 'airports', {
						type: 'POST',
						datatype: 'json',
						xhrFields: {withCredentials: true},
						data: {
							'airport': {
								'name': f['dep_port'],
								'code': f['dep_port_code']
							}
						},
						success: (response) => {
							console.log(response);
                            $.ajax(root+'airports?filter[code]='+f['arr_port_code'],{
                                type: 'GET',
                                datatype: 'json',
                                cache: false,
                                xhrFields: {withCredentials: true},
                                success:function(data2){
                                    console.log(data2);
                                    
                                    if(data2.length ==0){
                                        $.ajax(root+'airports', {
                                            type: 'POST',
                                            datatype: 'json',
                                            xhrFields: {withCredentials: true},
                                            data: {
                                                'airport': {
                                                    'name': f['arr_port'],
                                                    'code': f['arr_port_code']
                                                }
						                   },
                                            success: (response2)=>{
                                                console.log(response2);
                                                //create flights using response and response2
                                                createFlights(response, response2, f);
                                            },
                                            
                                            error: (j, s, error) => {
                                                console.log(error);
                                            }
                                        });
                                    } else{
                                        //create flights using response and data2
                                        createFlights(response, data2, f);
                                    }
                                },
                                error: (j, s, error) => {
                                    console.log(error);
                                }
                            });
						},
						error: (j, s, response) => {
							console.log(response);
						}
					});
				}
				else {
					$.ajax(root+'airports?filter[code]='+f['arr_port_code'],{
                                type: 'GET',
                                datatype: 'json',
                                cache: false,
                                xhrFields: {withCredentials: true},
                                success:function(data2){
                                    console.log(data2);
                                    
                                    if(data2.length ==0){
                                        $.ajax(root+'airports', {
                                            type: 'POST',
                                            datatype: 'json',
                                            xhrFields: {withCredentials: true},
                                            data: {
                                                'airport': {
                                                    'name': f['arr_port'],
                                                    'code': f['arr_port_code']
                                                }
						                   },
                                            success: (response2)=>{
                                                console.log(response2);
                                                //create flights using data and response 2
                                                createFlights(data, response2, f);
                                            },
                                            
                                            error: (j, s, error) => {
                                                console.log(error);
                                            }
                                        });
                                    } else{
                                        //create flights using data and data2
                                        createFlights(data, data2, f);
                                    }
                                },
                                error: (j, s, error) => {
                                    console.log(error);
                                }
                            });
				}
			},
			error: (j, s, error) => {
				console.log(error);
			}
		});
	}

	 function createFlights(dep_id, arr_id, f) {
         let dep_port_id, arr_port_id;
         //grab airport IDs
         if(dep_id[0]==undefined){
             dep_port_id = dep_id['id'];
         } else{
             dep_port_id = dep_id[0]['id'];
         }
         if(arr_id[0]==undefined){
             arr_port_id= arr_id['id'];
         } else{
             arr_port_id = arr_id[0]['id'];
         }

         console.log(dep_port_id, arr_port_id);
         $.ajax(root+'flights',{
             type:'POST',
             datatype:'json',
             xhrFields: {withCredentials:true},
             data:{
                'flight':{
                    'departs_at':f['dep_time'],
                    'arrives_at':f['arr_time'],
                    'number': f['flight_number'],
                    'departure_id':dep_port_id,
                    'arrival_id': arr_port_id
                }
            },
             success: (response)=>{
             	createTicket(f);
             }
         })

	 }

    function createTicket(f){
        $.ajax(root+'tickets',{
               type:'POST',
               xhrFields: {withCredentials:true},
                data:{
                    "ticket": {
                        'first_name': f['flyer_first_name'],
                        'last_name': f['flyer_last_name'],
                        'age': parseInt(f['flyer_age']),
                        'gender': f['flyer_gender']
                    }
                },
                success: (response) => {
			        createReviewMode(f);
			    },
			    error: (j, s, response) => {
			        console.log(response);
			    }
        });
    }

});

function createReviewMode(f) {
	// variables used in the function
	let dep_place = {};
	let arr_place = {};

	// grab the flight that the user input
	let flight_url = root + 'flights?filter[departs_at]' + f['dep_time'] + '&filter[arrives_at]=' + f['arr_time'] + '&filter=[number]=' + f['flight_number'];
	$.ajax(flight_url, {
		type: 'GET',
		datatype: 'json',
		xhrFields: {withCredentials: true},
		success: function(data) {
			mode_two.append('<h3>Flight ID: '+data[0]['id']+'</h3>');
			mode_two.append('<h3>Flight Number: '+data[0]['number']+'</h3>');
			let s = data[0]['departs_at'];
			match = s.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g);
			dep_time = match[0];
			s = data[0]['arrives_at'];
			match = s.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g);
			arr_time = match[0];
			mode_two.append('<h3>Flight Departs: '+dep_time+'</h3>');
			mode_two.append('<h3>Flight Arrives: '+arr_time+'</h3>');
		},
		error: (j, s, error) => {
			console.log(error);
		}
	});

	// grab the airports that the user will be flying to/form
	let arr_url = root + 'airports?filter[code]=' + f['arr_port_code'];
	let dep_url = root + 'airports?filter[code]=' + f['dep_port_code'];
	let google_arr_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + f['arr_port_code'] + '&key=' + google_key;
	let google_dep_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + f['dep_port_code'] + '&key=' + google_key;

	// arrival city, state
	$.ajax(google_arr_url, {
		type: 'GET',
		datatype: 'json',
		success: function(data) {
			let address = data.results[0]['formatted_address'];
			match = address.match(/\b(\w*)\b,\s[A-Z]{2}\s/g);
			let whole_arr = match[0].replace(/ /g, '');
			let arr = whole_arr.split(',');
			mode_two.append('<h3>Arrival City, State: ' + arr[0] + ', ' + arr[1] + '</h3>');
			arr_place['lat'] = data.results[0]['geometry']['location']['lat'];
			arr_place['lng'] = data.results[0]['geometry']['location']['lng'];
			
			// departure city, state
			$.ajax(google_dep_url, {
				type: 'GET',
				datatype: 'json',
				success: function(data) {
					let address = data.results[0]['formatted_address'];
					match = address.match(/\b(\w*)\b,\s[A-Z]{2}\s/g);
					let whole_dep = match[0].replace(/ /g, '');
					let dep = whole_dep.split(',');
					mode_two.append('<h3>Departing City, State: ' + dep[0] + ', ' + dep[1] + '</h3>');
					dep_place['lat'] = data.results[0]['geometry']['location']['lat'];
					dep_place['lng'] = data.results[0]['geometry']['location']['lng'];

					// creating the polyline between markers
					var flightPath = new google.maps.Polyline({
						path: [dep_place, arr_place],
						geodesic: true,
						strokeColor: '#FF0000',
						strokeOpacity: 0.5,
						strokeWeight: 8
					});

					flightPath.setMap(map);
				},
				error: (j, s, error) => {
					console.log(error);
				}
			});
		},
		error: (j, s, error) => {
			console.log(error);
		}
	});

	// arrival airport
	$.ajax(arr_url, {
		type: 'GET',
		datatype: 'json',
		xhrFields: {withCredentials: true},
		success: function(data) {
			let arrival_airport = data[0]['name'];
			mode_two.append('<h3>Arriving airport: ' + arrival_airport + '</h3>');
		},
		error: (j, s, error) => {
			console.log(error);
		}
	});

	// departure airport
	$.ajax(arr_url, {
		type: 'GET',
		datatype: 'json',
		xhrFields: {withCredentials: true},
		success: function(data) {
			let departure_airport = data[0]['name'];
			mode_two.append('<h3>Departing airport: ' + departure_airport + '</h3>');
		},
		error: (j, s, error) => {
			console.log(error);
		}
	});

	// grab the ticket information
	let ticket_url = root + 'tickets?filter[first_name]=' + f['flyer_first_name'] + '&filter[last_name]=' + f['flyer_last_name'] + '&filter[age]=' + f['flyer_age'];

	$.ajax(ticket_url, {
		type: 'GET',
		datatype: 'json',
		xhrFields: {withCredentials: true},
		success: function(data) {
			let passenger_name = data[0]['first_name'] + ' ' + data[0]['last_name'];
			let passenger_age = data[0]['age'];
			let passenger_gender = data[0]['gender'];

			mode_two.append('<h3>Passenger: ' + passenger_name + '</h3>');
			mode_two.append('<h3>Age: ' + passenger_age + '</h3>');
			mode_two.append('<h3>Gender: ' + passenger_gender + '</h3>');
		},
		error: (j, s, error) => {
			console.log(error);
		}
	});
}