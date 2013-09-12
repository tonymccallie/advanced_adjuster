var History = [];//ko.observableArray([]);
var Current = '';
var sigCapture = null;
define(['knockout'],function(ko) {
	return function AppViewModel() {
		//Variables
	    var self = this;
	    self.data = new Data();
	    self.new_claims = ko.observableArray([]);
	    self.open_claims = ko.observableArray([]);
	    self.saved_payment_requests = ko.observableArray([]);
	    self.selectedClaim = ko.observable();
	    self.adjuster = {
			first_name:ko.observable('John'),
			last_name:ko.observable('Smith'),
			fc_num:ko.observable('1234556789'),  
			phone:ko.observable('(806)553-5252'),
			email:ko.observable('info@threeleaf.net'),
	    };
	    
	        
	
	
		//CRON JOBS / SYSTEM FUNCTIONS
			//3 MINUTE CRON JOB
			setInterval(function(){
				//console.log('3Minutes');
			},(3*60*1000));
			
			var intCount = 0;
			
			//20 MINUTE CRON JOB
			setInterval(function(){
				//console.log('20Minutes');
			},(20*60*1000));
			
			//INITIAL DATA PULL
			setTimeout(function() {
				self.initialize();
			}, 0);
			
			self.initialize = function() {
				self.new_claims(self.data.loadClaims());
			}
			
			//UPDATE AFTER BEING IN THE BACKGROUND
			self.resume = function() {
				
			}
			
			var quality = {
				quality:60,
				targetHeight:300,
				targetWidth:300
			};
			
			self.getPhoto1 = function() {
				navigator.camera.getPicture(self.processPicture1,null,quality);
			}
			
			self.processPicture1 = function(data) {
				$('#photo1').attr('src',data);
			}
			
			self.getPhoto2 = function() {
				navigator.camera.getPicture(self.processPicture2,null,quality);
			}
			
			self.processPicture2 = function(data) {
				$('#photo2').attr('src',data);
			}
			
			self.getPhoto3 = function() {
				navigator.camera.getPicture(self.processPicture3,null,quality);
			}
			
			self.processPicture3 = function(data) {
				$('#photo3').attr('src',data);
			}
			
			self.getPhoto4 = function() {
				navigator.camera.getPicture(self.processPicture4,null,quality);
			}
			
			self.processPicture4 = function(data) {
				$('#photo4').attr('src',data);
			}
			
			self.getPhoto5 = function() {
				navigator.camera.getPicture(self.processPicture5,null,quality);
			}
			
			self.processPicture5 = function(data) {
				$('#photo5').attr('src',data);
			}
			
			self.getPhoto6 = function() {
				navigator.camera.getPicture(self.processPicture6,null,quality);
			}
			
			self.processPicture6 = function(data) {
				$('#photo6').attr('src',data);
			}
			
			self.getPhoto7 = function() {
				navigator.camera.getPicture(self.processPicture7,null,quality);
			}
			
			self.processPicture7 = function(data) {
				$('#photo7').attr('src',data);
			}
			
			self.getPhoto8 = function() {
				navigator.camera.getPicture(self.processPicture8,null,quality);
			}
			
			self.processPicture8 = function(data) {
				$('#photo8').attr('src',data);
			}
			
			self.getPhoto9 = function() {
				navigator.camera.getPicture(self.processPicture9,null,quality);
			}
			
			self.processPicture9 = function(data) {
				$('#photo9').attr('src',data);
			}
			
			self.getPhoto10 = function() {
				navigator.camera.getPicture(self.processPicture10,null,quality);
			}
			
			self.processPicture10 = function(data) {
				$('#photo10').attr('src',data);
			}
	
	
		//NAVIGATION
			self.loadReports = function() { loadPage('reports'); }
			self.loadPics = function() { loadPage('pictures'); }
			self.loadReport = function(claim) {
				self.open(claim);
				loadPage('report'); 
			}
			self.loadEngineer = function(claim) {
				self.open(claim);
				loadPage('engineer'); 
			}
			self.loadLogin = function() { loadPage('login'); }
			self.loadRegister = function() { loadPage('register'); }
			self.loadRecover = function() { loadPage('recover'); }
			self.loadUpload = function() { loadPage('upload'); }
			self.loadSettings = function() { loadPage('settings'); }
			self.loadAdvanced = function(claim) {
				self.open(claim);
				loadPage('advanced',null,self.setupAdvanced);
			}
			
			self.upload = function() {
				navigator.notification.confirm('Are you sure you want to upload these reports?',function(response) {
						if(response === 1) {	
							self.loadReports = function() { loadPage('reports'); }
						}
					}, 'Advanced Adjusting');
				
			}
			
	        self.setupAdvanced = function() {
	            sigCapture = new SignatureCapture( "signature" );
	            witsigCapture = new SignatureCapture( "witness_signature" );
	        }
	        
			self.back = function() {
				var href = History.pop();
				loadPage(href, true);
			}
			
			self.open = function(claim) {
				if(self.new_claims.indexOf(claim) >= 0) {
					self.open_claims.push(claim);
					self.new_claims.remove(claim);
				}
			}
			
			self.test = function() {
				alert('me');
			}
			
		//CLAIMS
			self.getClaim = function(claim) {
				self.selectedClaim(claim);
			}
	}
});

//JQUERY BINDINGS

//AJAX Frame Loader
var loadPage = function(href, isBack, callback) {	
    sigCapture = null;
	if(typeof isBack === 'undefined') {
		isBack = false;
	}
	
	var noTemplate = ['login','register','recover'];

	if(noTemplate.indexOf(href) >= 0) {
		//$('#content_wrap').css({top:0});
		$('#header, #footer').hide();
	} else {
		//$('#content_wrap').css({top:'100px'});
		$('#header, #footer').show();
	}
	
	var timestamp = new Date().getTime();
	
	$.get('views/'+href+'.html?'+timestamp,function(data) {
		$('#content').html(data);
		ko.applyBindings(viewModel, $('#content').get(0));
		//scroll_refresh();
		//myScroll.scrollTo(0,0);
		window.scrollTo(0,0);
		Current = href;
		if(typeof callback !== 'undefined') {
			callback();
		}
	})
}

var request = function(url,callback,data,validation,loader,quiet) {
	if(typeof loader === 'undefined') {
		loader = false;
	}
	
	if(typeof quiet === 'undefined') {
		quiet = false;
	}
	
	if(loader) {
		$('#loading').show();
	} else {
		$('#activity').show();
	}
	
	var options = {
		url: DOMAIN+url,
		crossDomain: true,
		success: function (data) {
			if(data.status == 'SUCCESS') {
				callback(data.data);
			} else {
				switch(data.status) {
					case 'VALIDATION':
						validation(data.data);
						break;
					default:
						console.log(data);
						navigator.notification.alert('There was an error:' + data.message,null,'AdvAdj');
						break;
				}
			}
		},
		complete: function(jqXHR, textStatus) {
			if((textStatus != 'success')&&(!quiet)) {
				navigator.notification.alert('There was a problem communicating with the server.',null,'AdvAdj');
			}
			$('#loading').fadeOut();
			$('#activity').fadeOut();
		},
		dataType: 'json',
		async: true
	};
	
	if(typeof data === 'undefined') {
		options.type = 'GET';
	} else {
		options.type = 'POST';
		options.data = data;
	}

	$.ajax(options);
}

var scroll_refresh = function() {
	setTimeout(function () {myScroll.refresh();}, 0);
}

//STARTUP	
$(function() {
	setTimeout(function() {
		loadPage('login');
	}, 0);
	
	setTimeout(function() {
		//scroll_refresh();
	},1000);
	
	//LINKS
	$('#footer a:not(.noajax)').fastClick(function() {
		loadPage($(this).attr('href'));
		return false;
	});
	
	$('#menu_button').click(function() {
		$('#app').toggleClass('open');
		return false;
	});
	
	$('#photo1_btn').click(function() {
		alert('me');
	});
});

app.initialize();
	
	