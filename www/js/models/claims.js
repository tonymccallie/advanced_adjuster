define(['knockout','router','models/claim'],function(ko, router, Claim) {
    return function Claims() {
        var self = this;
        self.new_claims = ko.observableArray([]);
        self.open_claims = ko.observableArray([]);
        self.selected = ko.observable();
        
        self.init = function() {
            if(localStorage.getItem('advadj_claims') !== null) {
                var claims = ko.utils.parseJson(localStorage.getItem('advadj_claims'));
                $.each(claims, function(index,item) {
                    self.open_claims.push(new Claim(item));      
                });
            }
            self.update();
        }
        
        self.update = function() {
            if(localStorage.getItem('advadj_claim_ids') !== null) {
                self.open_claim_ids(ko.utils.parseJson(localStorage.getItem('advadj_claim_ids')));
            }
            router.request('app/claims/list',self.updateProcess,{data:{User:{id:viewModel.user().user_id()}}});
        }
        
        self.updateProcess = function(data) {
            var claim = null;
            $.each(data, function(index, item) {
                claim = new Claim(item);
                console.log([claim,viewModel.claims.new_claims.indexOf(claim)]);
                if((viewModel.claims.new_claims.indexOf(claim) < 0)&&(viewModel.claims.open_claims.indexOf(claim) < 0)) {
                    self.new_claims.push(claim);   
                }
            });
        }
    }
});