function service(request, response)
{
	'use strict';
	try 
	{
		require('CMSOnSecure.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('CMSOnSecure.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}