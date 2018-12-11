var root = 'http://comp426.cs.unc.edu:3001/';
var dep_port_id;
var arr_port_id;

/*function selectNumFlights() {
	let num_flights = $('#num-flights').val();

	if (num_flights == 2) {
		$('#flight3').hide();
		$('#flight4').hide();
	}
	else if (num_flights == 3) {
		$('#flight3').show();
		$('#flight4').hide();
	}
	else if (num_flights == 4) {
		$('#flight3').show();
		$('#flight4').show();
	}
}*/

function creating_options(){
    //age dropdown
    for(var i = 0; i<=120; i++){
        var opt = document.createElement('option');
        opt.value=i;
        opt.innerHTML=i;
        document.getElementById('age').appendChild(opt);
    }
}

$(document).ready(function() {
    //creates age options, 0-100
    creating_options();
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

	// user submits the flight info
	$('#submit-flight-info').click(function() {
		// collect the input data and assign variables
		let num_flights = $('#num-flights').val();
		let flyer_info = {}; // dictionary containing all information given in the form
		flyer_info['flyer_first_name'] = $('#first-name').val();
		flyer_info['flyer_last_name'] = $('#last-name').val();
		flyer_info['flyer_email'] = $('#email').val();
        flyer_info['flyer_age'] = $('#age').val();
        flyer_info['flyer_gender'] = $('#gender').val();

		// loop through each entered flight
		for(let i = 1; i <= num_flights; i++) {
			flyer_info['flight_'+i+'_number'] = $('#flight-num'+i).val();
			flyer_info['dep_time_'+i] = $('#dep-time'+i).val();
			flyer_info['arr_time_'+i] = $('#arr-time'+i).val();
			flyer_info['seat_'+i] = $('#seat'+i).val();
			flyer_info['dep_port_'+i] = $('#dep-port'+i).val();
			flyer_info['dep_port_code_'+i] = $('#dep-port-code'+i).val();
			flyer_info['dep_city_'+i] = $('#dep-city'+i).val();
			flyer_info['dep_state_'+i] = $('#dep-state'+i).val();
			flyer_info['arr_port_'+i] = $('#arr-port'+i).val();
			flyer_info['arr_port_code_'+i] = $('#arr-port-code'+i).val();
			flyer_info['arr_city_'+i] = $('#arr-city'+i).val();
			flyer_info['arr_state_'+i] = $('#arr-state'+i).val();

			// create airport (if it doesn't exist)
            
		}
       
        checkAirport(flyer_info);
            

		// debugging prints
		str = JSON.stringify(flyer_info); // creates a loggable string from the dict
		console.log(str); // logging the dict

		// create airports (if they don't exist)
		// checkAirports(flyer_info, num_flights);
		// createAirports(flyer_info, num_flights);

		// create flight instances
		// createFlights(flyer_info, num_flights);

		// create flight itinerary
		// createItinerary(flyer_info, num_flights);
        //createTicket(flyer_info);
		// grab the weather, map information from 3rd-party APIs

		// change the mode to "review" mode (weather, maps, itinerary formatted, etc.)

		// allow the user to return to the "create itinerary" mode (likely button)


	});
    //c is the code, n is the name, 1 is departure 2 is arrival)
    //check if airport for departure exists, if not create one, then check if airport of arrival exists, if not create one, take airport ids and make flight
	function checkAirport(f) {
		$.ajax(root + 'airports?filter[code]='+f['dep_port_code_1'], {
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
								'name': f['dep_port_1'],
								'code': f['dep_port_code_1']
							}
						},
						success: (response) => {
							console.log(response);
                            $.ajax(root+'airports?filter[code]='+f['arr_port_code_1'],{
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
                                                    'name': f['arr_port_1'],
                                                    'code': f['arr_port_code_1']
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
					$.ajax(root+'airports?filter[code]='+f['arr_port_code_1'],{
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
                                                    'name': f['arr_port_1'],
                                                    'code': f['arr_port_code_1']
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
         //grab airport IDs
         let dep_port_id = dep_id[0]['id'];
         let arr_port_id = arr_id[0]['id'];

         console.log(dep_port_id, arr_port_id);
         $.ajax(root+'flights',{
             type:'POST',
             datatype:'json',
             xhrFields: {withCredentials:true},
             data:{
                'flight':{
                    'departs_at':f['dep_time_1'],
                    'arrives_at':f['arr_time_1'],
                    'number': f['flight_1_number'],
                    'departure_id':dep_port_id,
                    'arrival_id': arr_port_id
                }
            },
             success: (response)=>{
                 console.log(response);
             }
         })

	 }

    // c is the airport id
/*	 function getAirportID(c) {
	 	$.ajax(root + 'airports?filter[code]='+c, {
	 		type: 'GET',
	 		datatype: 'json',
	 		xhrFields: {withCredentials: true},
	 		success: (response) => {
	 			console.log(response);
	 			return response.data.id;
	 		},
	 		error: (j, s, response) => {
	 			console.log(response);
	 		}
	 	});
	 }*/

	// function createItinerary(f, n) {

	// }
    
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
				        console.log(response);
				    },
				    error: (j, s, response) => {
				        console.log(response);
				    }
                   });
        }

});









