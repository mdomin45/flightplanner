var root = 'http://comp426.cs.unc.edu:3001/'

function selectNumFlights() {
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

	// user submits the flight info
	$('#submit-flight-info').click(function() {
		// collect the input data and assign variables
		let num_flights = $('#num-flights').val();
		let flyer_info = {}; // dictionary containing all information given in the form
		flyer_info['flyer_first_name'] = $('#first-name').val();
		flyer_info['flyer_last_name'] = $('#last-name').val();
		flyer_info['flyer_email'] = $('#email').val();

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
		}

		// debugging prints
		str = JSON.stringify(flyer_info); // creates a loggable string from the dict
		console.log(str); // logging the dict

		// create airports (if they don't exist)
		createAirports(flyer_info, num_flights);

		// create flight instances
		createFlights(flyer_info, num_flights);

		// create flight itinerary
		createItinerary(flyer_info, num_flights);

		// grab the weather, map information from 3rd-party APIs

		// change the mode to "review" mode (weather, maps, itinerary formatted, etc.)

		// allow the user to return to the "create itinerary" mode (likely button)


	});

	function createAirports(f, n) {
		// loop through each entered flight
		for (let i = 1; i <= n; i++) {

			// create the departing airports
			$.ajax(root + 'airports', {
				type: 'POST',
				datatype: 'json',
				xhrFields: {withCredentials: true},
				data: {
					'airport': {
						'name': f['dep_port_'+i],
						'code': f['dep_port_code_'+i],
						'city': f['dep_city_'+i],
						'state': f['dep_state_'+i]
					}
				},
				success: (response) => {
					console.log(response);
				},
				error: (j, s, response) => {
					console.log(response);
				}
			});

			// create the arriving airports
			$.ajax(root + 'airports', {
				type: 'POST',
				datatype: 'json',
				xhrFields: {withCredentials: true},
				data: {
					'airport': {
						'name': f['arr_port_'+i],
						'code': f['arr_port_code_'+i],
						'city': f['arr_city_'+i],
						'state': f['arr_state_'+i]
					}
				},
				success: (response) => {
					console.log(response);
				},
				error: (j, s, error) => {
					console.log(error);
				}
			});
		}
	}

	function createFlights(f, n) {
		// loop through each entered flight
		// for(let i = 1; i <= n; i++) {
			// grab airport IDs
			// let dep_port_id = getAirportID(f['dep_port_code_'+i]);
			// let arr_port_id = getAirportID(f['arr_port_code_'+i]);

			// console.log(dep_port_id, arr_port_id);

			// create flight instances
		// }
	}

	// function getAirportID(c) {
	// 	$.ajax(root + 'airports?filter[code]='+c, {
	// 		type: 'GET',
	// 		datatype: 'json',
	// 		xhrFields: {withCredentials: true},
	// 		success: (response) => {
	// 			console.log(response);
	// 			return response.data.id;
	// 		},
	// 		error: (j, s, response) => {
	// 			console.log(response);
	// 		}
	// 	});
	// }

	function createItinerary(f, n) {

	}

});











