var root = 'http://comp426.cs.unc.edu:3001/';
var dep_port_id;
var arr_port_id;


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
        flyer_info['dep_city'] = $('#dep-city').val();
        flyer_info['dep_state'] = $('#dep-state').val();
        flyer_info['arr_port'] = $('#arr-port').val();
        flyer_info['arr_port_code'] = $('#arr-port-code').val();
        flyer_info['arr_city'] = $('#arr-city').val();
        flyer_info['arr_state'] = $('#arr-state').val();

			
            
		
       // create airport (if it doesn't exist)
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
        createTicket(flyer_info);
		// grab the weather, map information from 3rd-party APIs

		// change the mode to "review" mode (weather, maps, itinerary formatted, etc.)

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
                 console.log(response);
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
				        console.log(response);
				    },
				    error: (j, s, response) => {
				        console.log(response);
				    }
                   });
        }

});









