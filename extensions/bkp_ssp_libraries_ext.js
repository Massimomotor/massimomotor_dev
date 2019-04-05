try{
var session = nlapiGetWebContainer().getShoppingSession();
var domain;
if(_.isFunction(session.getEffectiveShoppingDomain)){
	domain = session.getEffectiveShoppingDomain();
}
else{
	var home = session.getSiteSettings(['touchpoints']).touchpoints.home;
	var home_match = home.match(/https?:\/\/([^#?\/]+)[#?\/]?/);
	if(!home_match){
		home_match = home.match(/\?btrgt=https?%3A%2F%2F([^#?\/]+)[#?\/]?/);
	}
	domain = home_match[1];
}
var deepExtend = function deepExtend(target, source)
                            {
                                if(_.isArray(target) || !_.isObject(target))
                                {
                                    return source;
                                }

                                _.each(source, function(value, key)
                                {
                                    if(key in target)
                                    {
                                        target[key] = deepExtend(target[key], value);
                                    }
                                    else
                                    {
                                        target[key] = value;
                                    }
                                });

                                return target;
                            };

// Start dev.massimomotor.com
if (domain === "dev.massimomotor.com") {
	deepExtend(ConfigurationManifestDefaults, {});
}
// End dev.massimomotor.com



var ie_css = {"1":{"shopping":5,"myaccount":6,"checkout":4}};

require('SCA');

var extensions = {};

var SiteSettings = require('SiteSettings.Model').get();
var website_id = SiteSettings.siteid;
var key_mapping = {
	'2': {
		'dev.massimomotor.com': '1'
	}
};

var key;
var ctx = nlapiGetContext();
var subsidiary = ctx.getSubsidiary();
var location = ctx.getLocation();
var subsidiary_key = domain + '-' + subsidiary;
var location_key = subsidiary_key + '-' + location;
if(website_id === 2 && key_mapping[website_id]){
	var mapping = key_mapping[website_id];
	if(mapping[location_key]){
		key = mapping[location_key];
	}
	else if(mapping[subsidiary_key]){
		key = mapping[subsidiary_key];
	}
	else if(mapping[domain]){
		key = mapping[domain];
	}
	else if(mapping['activation_id']){
		key = mapping['activation_id'];
	}
}

if(key === '1'){
}

var ie_css_map = {
    "1": {
        "checkout": 4,
        "myaccount": 6,
        "shopping": 5
    }
};
ie_css = _.extend(ie_css_map, ie_css);

var include_mapping = {
    "2": {
        "1": {
            "shopping": {
                "templates": [
                    "extensions/shopping-templates_1.js"
                ],
                "js": [
                    "javascript/shopping.js",
                    "extensions/shopping_1.js"
                ],
                "css": [
                    "extensions/shopping_1.css"
                ],
                "ie": []
            },
            "myaccount": {
                "templates": [
                    "extensions/myaccount-templates_1.js"
                ],
                "js": [
                    "javascript/myaccount.js",
                    "extensions/myaccount_1.js"
                ],
                "css": [
                    "extensions/myaccount_1.css"
                ],
                "ie": []
            },
            "checkout": {
                "templates": [
                    "extensions/checkout-templates_1.js"
                ],
                "js": [
                    "javascript/checkout.js",
                    "extensions/checkout_1.js"
                ],
                "css": [
                    "extensions/checkout_1.css"
                ],
                "ie": []
            }
        }
    }
};
var theme_assets_paths = {
    "1": "extensions/TavanoTeam/TavanoTeam_SCA_Massimo_Zenith_Theme/1.0.0/"
};
var Application = require('Application');

var app_includes;

var isExtended = false;

var themeAssetsPath = '';
if(include_mapping[website_id] && include_mapping[website_id][key]){
	app_includes = include_mapping[website_id][key];
	_.each(app_includes, function(app, app_name){
		if(ie_css[key] && ie_css[key][app_name]){
		    for(var i=0; i < ie_css[key][app_name]; i++){
			   app.ie.push('extensions/ie_' + app_name + '_' + i + '_' + key + '.css');
		    }
		}
	});

	isExtended = true;

	themeAssetsPath = theme_assets_paths[key];
}
else{
	app_includes = {
    "shopping": {
        "templates": [
            "shopping-templates.js"
        ],
        "js": [
            "javascript/shopping.js"
        ],
        "css": [
            "css/shopping.css"
        ],
        "ie": []
    },
    "myaccount": {
        "templates": [
            "myaccount-templates.js"
        ],
        "js": [
            "javascript/myaccount.js"
        ],
        "css": [
            "css/myaccount.css"
        ],
        "ie": []
    },
    "checkout": {
        "templates": [
            "checkout-templates.js"
        ],
        "js": [
            "javascript/checkout.js"
        ],
        "css": [
            "css/checkout.css"
        ],
        "ie": []
    }
};
	_.each(app_includes, function(app){
		app.templates = _.map(app.templates, function(file){
			return Application.getNonManageResourcesPathPrefix() + file;
		});
		app.css = _.map(app.css, function(file){
			return Application.getNonManageResourcesPathPrefix() + file;
		});
		if(SC.Configuration.unmanagedResourcesFolderName)
		{
			app.js.unshift('backward-compatibility-amd-unclean.js');
		}
	});
}
_.each(app_includes, function(app, app_name){
	app.js = app.templates.concat(app.js);
});

var embEndpointUrl = {
	url: 'https://system.na2.netsuite.com' + nlapiResolveURL('SUITELET', 'customscript_ext_mech_emb_endpoints', 'customdeploy_ext_mech_emb_endpoints') + '&callback=?'
,	method: 'GET'
,	dataType: 'jsonp'
,	data: {
		domain: domain
		}
};
}catch(error){ console.log('ERROR_SSP_LIBRARIES_EXT', error) }