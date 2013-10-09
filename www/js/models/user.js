define(['knockout','router'],function(ko, router) {
    return function User() {
        var self = this;
        
        //check for existing login
        self.user_id = ko.observable();
        self.first_name = ko.observable();
        self.fc_num = ko.observable();
        self.last_name = ko.observable();
        self.name = ko.computed(function() {
            return self.first_name() + ' ' + self.last_name()
        });
        
        //LOAD
        self.load = function() {
            user = ko.utils.parseJson(localStorage.getItem('advadj_user'));
            self.user_id(user.id);
            self.first_name(user.first_name);
            self.last_name(user.last_name);
            self.fc_num(user.fc_num);
            router.loadPage('reports');
            viewModel.claims.init();
        }
        
        //LOGIN
        self.loginSubmit = function() {
            router.request('app/users/login',self.loginProcess,$('#user_login').serialize());
        }
        
        self.loginProcess = function(data) {
            localStorage.setItem('advadj_user',ko.toJSON(data.User));
            self.load();
        }
        
        //REGISTER
        self.registerSubmit = function(data) {
            router.request('app/users/register',self.registerProcess,$('#user_register').serialize());
        }
        
        self.registerProcess = function(data) {
            navigator.notification.alert('You have successfully registered your account. You may now log in.',null,'Advanced Adjusting');
            router.loadPage('login');
        }
        
        
        //LOGOUT
        self.logout = function() {
            self.id = null;
            self.name = '';
            localStorage.removeItem('advadj_user');
            localStorage.removeItem('advadj_claims');
            viewModel.claims.new_claims([]);
            viewModel.claims.open_claims([]);
            viewModel.claims.claim_ids = [];
            viewModel.selectedClaim(null);
            router.loadPage('login');
            navigator.notification.alert('You have been successfully logged out.',null,'Advanced Adjusting');
        }
        
        
        //RECOVER
        self.recoverSubmit = function() {
            
        }
    }
});