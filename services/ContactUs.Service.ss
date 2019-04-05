function service(request, response)
{
	'use strict';
	try 
	{
		require('ContactUs.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('ContactUs.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}