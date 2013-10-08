define(['knockout','router','models/user','models/claims'], function(ko, router, User, Claims) {
    return function AppViewModel() {
        var self = this;
        self.user = ko.observable(new User());
        self.claims = new Claims;
        self.saved_payment_requests = ko.observableArray([]);
        self.selectedClaim = ko.observable();
        
        self.loadPage = function(url) {
            router.loadPage(url);
        }
        
        self.loadReports = function() {
            router.loadPage('reports');
        }
        
        self.initialize = function() {
            //check login
            if(localStorage.getItem('advadj_user') !== null) {
				self.user().load();
			} else {
				self.loadPage('login');
			}
        }
        
        self.upload = function() {
            router.loadPage('upload',self.processUpload);
        }
        
        self.processUpload = function() {
            $('.progress_bar').hide();
        }
        
        self.update = function() {
           
        }
    }
});