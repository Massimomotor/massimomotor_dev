function service(request, response)
{
	'use strict';
	try 
	{
		require('Warranty.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Warranty.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}