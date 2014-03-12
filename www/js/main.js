/*
<script type="text/javascript" src="cordova.js"></script>
<script type="text/javascript" src="js/config.js"></script>
<script type="text/javascript" src="js/data.js"></script>
<script type="text/javascript" src="js/app.js"></script>
*/
var viewModel;
var Camera;
var History = [];
var DOMAIN = 'http://advadj.greyback.net/'
var devtest = /localhost/.test(window.location.hostname);
if(devtest) {
	DOMAIN = 'http://localhost/adjuster_bridge/';
}
devtest = /threeleaf/.test(window.location.hostname);
if(devtest) {
	DOMAIN = 'http://office.threeleaf.net/adjuster_bridge/';
}

require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
	baseUrl: 'js',
	map: {
		'*': {
			'jquery':'util/jquery-2.0.2.min',
			'knockout':'util/knockout-2.3.0',
            'router':'util/router',
            'sizeof':'util/sizeof.compressed'
		}
	},
	shim: {
        'util/signature': {
			deps: ['util/modernizr.custom.34982'],
			exports: 'SignatureCapture'
		},
		'util/fastbutton': {
			deps: ['jquery','util/google.fastbutton'],
			exports: 'FastButton'
		},
		'util/bootstrap': {
			deps: ['jquery'],
            exports: 'BoostrapJS'
		},
	}
});

require(['config','util/fastbutton','util/bootstrap','jquery','knockout','app'], function(app, FastButton, BootstrapJS, jquery, ko, AppViewModel) {
    viewModel = new AppViewModel();
    ko.bindingHandlers.dateString = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            try {
                var value = valueAccessor();
                var valueUnwrapped = ko.utils.unwrapObservable(value);
                var dateParts = valueUnwrapped.match(/^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
                var ampm = 'am';
                if(dateParts[4] > 12) {
                    dateParts[4] = dateParts[4] - 12;
                    ampm = 'pm';
                }
                $(element).text(parseInt(dateParts[2])+'/'+dateParts[3]+' - '+dateParts[4]+':'+dateParts[5]+ampm);
            } catch(e) {
                console.log(e)
            }
        }
    }

    ko.bindingHandlers.fastClick = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            new FastButton(element, function() {
                valueAccessor()(viewModel, event);
            });
        }
    };
    
    ko.bindingHandlers.tap = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var allBindings = allBindingsAccessor();
            if(isMobile) {
                $(element).bind('touchend', function() {
                    if(myScroll.moved) {
                        return false;
                    }
                    valueAccessor()(viewModel, event, element);
                    return false;
                });
            } else {
                $(element).bind('click', function() {
                    valueAccessor()(viewModel, event, element);
                });
            }
        }
    }
	ko.applyBindings(viewModel);
    viewModel.initialize();
    app.initialize();
});
