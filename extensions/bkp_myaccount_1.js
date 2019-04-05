var extensions = {};

extensions['TavanoTeam.SmartMerchand.1.0.0'] = function(){

function getExtensionAssetsPath(asset){
return 'extensions/TavanoTeam/SmartMerchand/1.0.0/' + asset;
};


define(
	'CMS.Merchandising.View'
,	[	'cms_merchandizing.tpl'
	,	'merchandising_zone_cell_template.tpl'
	,	'merchandising_zone_row_template.tpl'

	,	'SC.Configuration'
	,	'Item.Collection'
	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'CMS.Merchandizing.Cell.View'
	,	'underscore'
	,	'CustomContentType.Base.View'
	,	'Utils'
	,	'jQuery.bxSlider'

	]
,	function (
        cms_merchandizing_tpl
	,	merchandising_zone_cell_template_tpl
	,	merchandising_zone_row_template_tpl

	,	Configuration
	,	ItemCollection
	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	CMSMerchandizingCellView
	,	_
	,	CustomContentTypeBaseView

	)
{
	'use strict';

	// @class Merchandising.View Responsible for rendering the list of item requested by a merchandizing
	// rule @extend Backbone.View
	return CustomContentTypeBaseView.extend({

		template: cms_merchandizing_tpl


        // As an example of the 'install' method, we are going to emulate a fetch to a service with the setTimeout
        // Until the promise is resolved, you won't be able to edit the settings of this CCT
        // The same could happen with the 'update' method
	,	install: function (settings, context_data)
        {
            this._install(settings, context_data);

            // call some ajax here

            var promise = jQuery.Deferred();
            return promise.resolve();
        }

        // The list of contexts that you may need to run the CCT
        // These are all the context data you have available by default depending on where you dropped the cct
	,	contextDataRequest: ['item']

        // By default when you drop a CCT in the SMT admin, it will run the 'validateContextDataRequest' method to check that you have
        // all the requested contexts and it will fail if some context is missing.
        // We will override the 'validateContextDataRequest' method to return always true
        // since I want to run the CCT even if I don't have an 'item' or the rest of the context data
	,	validateContextDataRequest: function validateContextDataRequest()
        {
            return true;
        }

	,	fetchItems : function () {

			if (this.isFetched || _.isEmpty(this.settings))
				return

            var self = this;


			this.filters = this.settings && this.settings.custrecord_tt_filters.split(",") || [];

            BackboneCompositeView.add(this);
            this.on('afterCompositeViewRender', _.bind(this.initSlider, self));

            Backbone.View.prototype.initialize.apply(this, arguments);

            // Data used to fetch items
            // Here we add the boolean filters defined on the cms merchand template
            var data = {
                fieldset : "search"
            };

            _.each(self.filters,function(filterElement){
                data[filterElement] = true
            })

            this.collection = new ItemCollection();
            this.collection.fetch({
                async : false,
                data : data
            }).done(function(){
				self.isFetched = true;
                self.render();
			});

        }

        ,	fetchItemsWithSS : function () {

			if (this.isFetched || _.isEmpty(this.settings))
                return

            var itemIds = "";
            var self = this;


            jQuery.ajax({
				url: "/app/site/hosting/scriptlet.nl?script=358&deploy=1&ssid=" +  this.settings.custrecord_tt_saved_search,
				async : false,
				success: function(result){
                    itemIds = JSON.parse(result);
				}});


            BackboneCompositeView.add(this);
            this.on('afterCompositeViewRender', _.bind(this.initSlider, self));

            Backbone.View.prototype.initialize.apply(this, arguments);

            // Data used to fetch items
            // Here we add the boolean filters defined on the cms merchand template
            var data = {
                fieldset : "search",
				id  : itemIds.toString()

            };


            this.collection = new ItemCollection();
            this.collection.fetch({
                async : false,
                data : data
            }).done(function(){
                self.isFetched = true;
                self.render();
            });

        }

		// @method initialize Creates a new instance of the current view
		// @param {MerchandisingRule.Model} options.model
		// @param {Merchandising.ItemCollection} options.items
	,	initialize: function (options)
		{
			var self = this;
			this.isFetched = false;
			this.model = new Backbone.Model({
                title: "",
                description : ""
            });


		}

	,	childViews: {
			'Zone.Items': function()
			{
				var self = this;
				var itemsCollectionView = new BackboneCollectionView({
					childView: CMSMerchandizingCellView
				,	viewsPerRow: Infinity
				,	cellTemplate: merchandising_zone_cell_template_tpl
				,	rowTemplate: merchandising_zone_row_template_tpl
				,	collection: self.collection
				,	childViewOptions: {
						showPrice : self.settings.custrecord_tt_show_price && self.settings.custrecord_tt_show_price == "T"
					,	showReviews : self.settings.custrecord_tt_show_reviews && self.settings.custrecord_tt_show_reviews == "T"

					}
				});

				return itemsCollectionView;
			}
		}

		// @method initSlider
	,	initSlider: function ()
		{

			var pauseTime = this.settings.custrecord_tt_pause_time || 5000;

			var self = this;
			var element = this.$el.find('[data-type="carousel-items"]');
			this.$slider = _.initBxSlider(element, {
				nextText: '<a class="home-gallery-next-icon"></a>',
				prevText: '<a class="home-gallery-prev-icon"></a>',
				auto: this.settings.custrecord_tt_auto_slide && this.settings.custrecord_tt_auto_slide == "T",
				infiniteLoop: true,
				forceStart: false,
				pause: parseInt(pauseTime),
				minSlides:2,
				maxSlides:4,
				slideWidth:255,
				slideMargin:30,
				pagerType:'full'
			});
		}

		// @method getContext @returns {Content.LandingPages.View.Context}
	,	getContext: function ()
		{
			// this.fetchItems();
			this.fetchItemsWithSS();

			// @class Content.LandingPages.View.Context
			return {
				// @property {String} zoneTitle
				zoneTitle: this.model.get('title')
				// @property {Boolean} isZoneDescription
			,	isZoneDescription: !!this.model.get('description')
				// @property {Stirng} zoneDescription
			,	zoneDescription: this.model.get('description')

			};
		}

	});
});


/*
 © 2017 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

//@module ItemViews
define(
    'CMS.Merchandizing.Cell.View'
    ,	[
        'ProductViews.Price.View'
        ,	'GlobalViews.StarRating.View'
        ,	'Backbone.CompositeView'

        ,	'cms_merchandizing_cell.tpl'

        ,	'Backbone'
    ]
    ,	function (
        ProductViewsPriceView
        ,	GlobalViewsStarRatingView
        ,	BackboneCompositeView

        ,	cms_merchandizing_cel_tpl

        ,	Backbone
    )
    {
        'use strict';

        // @class ItemViews.RelatedItem.View Responsible for rendering an item details. The idea is that the item rendered is related to another one in the same page
        // @extend Backbone.View
        return Backbone.View.extend({

            //@property {Function} template
            template: cms_merchandizing_cel_tpl

            //@method initialize Override default method to make this view composite
            //@param {ItemViews.RelatedItem.View.Initialize.Options} options
            //@return {Void}
            ,	initialize: function (options)
            {

                this.showPrice = options.showPrice;
                this.showRating = options.showReviews;
                Backbone.View.prototype.initialize.apply(this, arguments);
                BackboneCompositeView.add(this);
            }

            ,	childViews: {
                'Item.Price': function ()
                {
                    return new ProductViewsPriceView({
                        model: this.model
                        ,	origin: 'RELATEDITEM'
                    });
                }
                ,	'Global.StarRating': function ()
                {
                    return new GlobalViewsStarRatingView({
                        model: this.model
                        ,	showRatingCount: false
                    });
                }
            }

            //@method getContext
            //@returns {ItemViews.RelatedItem.View.Context}
            ,	getContext: function ()
            {
                //@class ItemViews.RelatedItem.View.Context
                return {
                    //@property {String} itemURL
                    itemURL: this.model.getFullLink()
                    //@property {String} itemName
                    ,	itemName: this.model.get('_name') || this.model.Name
                    // @property {ImageContainer} thumbnail
                    ,	thumbnail: this.model.getThumbnail()
                    //@property {String} sku
                    ,	sku: this.model.get('_sku')
                    // @property {String} itemId
                    ,	itemId: this.model.get('_id')
                    // @property {Item.Model} model
                    ,	model: this.model

                    //@property {Boolean} showRating
                    ,	showRating: this.showRating
                    //@property {Boolean} showRating
                    ,	showPrice: this.showPrice

                    //@property {String} track_productlist_list
                    ,	track_productlist_list: this.model.get('track_productlist_list')
                    //@property {String} track_productlist_position
                    ,	track_productlist_position: this.model.get('track_productlist_position')
                    //@property {String} track_productlist_category
                    ,	track_productlist_category: this.model.get('track_productlist_category')
                };
                //@class ItemViews.RelatedItem.View
            }
        });
    });

//@class ItemViews.RelatedItem.View.Initialize.Options
//@property {Item.Model} model


function pullSSResults(request, response){

    var ssResultOut = [];
    var ssId = request.getParameter("ssid");
    try
    {

        var ssResult = nlapiLoadSearch('item',ssId, null, null);

        var ssResultSet = ssResult.runSearch();
        var ssResultSet = ssResultSet.getResults(0, 50);

        for (var i = 0; i < ssResultSet.length ; i++)
        {
            var resultItem = ssResultSet[i];

            ssResultOut.push(resultItem.getId());
        }
    }catch(e)
    {
        nlapiLogExecution('ERROR', 'Error', e);

    }

    //nlapiLogExecution('DEBUG', 'response', 'SavedSearch ID: ' + JSON.stringify(ssResultOut));

    response.write(JSON.stringify(ssResultOut));

}


// Entry point for javascript creates a router to handle new routes and adds a view inside the Product Details Page

define(
	'TavanoTeam.SmartMerchand.SmartMerchand'
,   [
		"CMS.Merchandising.View"
	]
,   function (
        CMSMerchandisingView
	)
{
	'use strict';

	return  {
        mountToApp: function mountToApp (container)
        {
            container.getComponent('CMS').registerCustomContentType({

                // this property value MUST be lowercase
                id: 'cct_smart_merchand'

                // The view to render the CCT
                ,	view: CMSMerchandisingView
            });
		}
	};
});



};


try{
	extensions['TavanoTeam.SmartMerchand.1.0.0']();
	SC.addExtensionModule('TavanoTeam.SmartMerchand.SmartMerchand');
}
catch(error)
{
	console.error(error)
}

