define(['knockout','router','models/user','models/claims'], function(ko, router, User, Claims) {
    return function AppViewModel() {
        var self = this;
        self.memory = ko.observable(0);
        self.user = ko.observable(new User());
        self.claims = new Claims;
        self.saved_payment_requests = ko.observableArray([]);
        self.selectedClaim = ko.observable();
        self.logs = ko.observableArray([]);
        
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
        
        self.check_memory = function() {
            var currentSize = (((sizeof(localStorage.getItem('advadj_claims')))/1024/1024)/5)*100;
            self.memory(currentSize)
        }

        self.upload = function() {
            router.loadPage('upload',self.processUpload);
        }
        
        self.processUpload = function() {
        
        }
        
        self.update = function() {
           
        }
        
        self.log = function(log) {
            self.logs.push(log);
            router.loadPage('logs');
        }
    }
});
