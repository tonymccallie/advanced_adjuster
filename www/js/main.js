/*
<script type="text/javascript" src="cordova.js"></script>
<script type="text/javascript" src="js/config.js"></script>
<script type="text/javascript" src="js/data.js"></script>
<script type="text/javascript" src="js/app.js"></script>
*/
var viewModel;
var isMobile = true;
var Camera;
var fileSystemPath;
var LocalFileSystem;
var History = [];
var DOMAIN = 'http://advadj.greyback.net/';
    //DEVELOPMENT
    var devtest = /localhost/.test(window.location.hostname);
    if(devtest) {
        DOMAIN = 'http://localhost/adjuster_bridge/';
        isMobile = false;
    }
    devtest = /threeleaf/.test(window.location.hostname);
    if(devtest) {
        DOMAIN = 'http://office.threeleaf.net:8080/adjuster_bridge/';
        isMobile = false;
    }

var PICS = ['pic_front_right','pic_front_left','pic_rear_left','pic_rear_right','pic_water_inside','pic_water_outside','pic_roof_front','pic_roof_rear',
			'pic_optional1','pic_optional2','pic_optional3','pic_optional4','pic_optional5','pic_optional6','pic_optional7','pic_optional8','pic_optional9','pic_optional10',
			'pic_optional11','pic_optional12','pic_optional13','pic_optional14','pic_optional15','pic_optional16','pic_optional17','pic_optional18','pic_optional19','pic_optional20'];

require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
	baseUrl: 'js',
	paths: {
		'jquery':'util/jquery-2.0.2.min',
		'knockout':'util/knockout-2.3.0',
		'router':'util/router',
		'sizeof':'util/sizeof.compressed',
		'picker':'util/picker',
		'pickadate':'util/picker.date'
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
		'picker': ['jquery'],
		'pickadate': {
			deps:['jquery','picker'],
			exports:'DatePicker'
		}
	}
});

require(['config','util/fastbutton','util/bootstrap','jquery','knockout','app','pickadate'], function(app, FastButton, BootstrapJS, jquery, ko, AppViewModel, DatePicker) {
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
    app.initialize();
    viewModel.initialize();
});
