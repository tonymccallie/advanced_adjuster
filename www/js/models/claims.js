define(['knockout','router','models/claim'],function(ko, router, Claim) {
    return function Claims() {
        var self = this;
        self.new_claims = ko.observableArray([]);
        self.open_claims = ko.observableArray([]);
        self.claim_ids = [];
        self.selected = ko.observable();
        self.progress = {
            total: ko.observable(0),
            title: ko.observable('test')
        };
        
        self.init = function() {
            if(localStorage.getItem('advadj_claims') !== null) {
                var claims = ko.utils.parseJson(localStorage.getItem('advadj_claims'));
                $.each(claims, function(index,item) {
                    self.open_claims.push(new Claim(item));
                    self.claim_ids.push(item.Claim.id);
                });
            }
            self.update();
        }
    
        self.store = function() {
            var data = [];
            $.each(viewModel.claims.open_claims(), function(index,item) {
                data.push({ Claim: item.data});
            });
            localStorage.setItem('advadj_claims',ko.toJSON(data));
        }
        
        self.update = function() {
            router.request('app/claims/list',self.updateProcess,{data:{User:{id:viewModel.user().user_id()}}});
        }
        
        self.updateProcess = function(data) {
            var claim = null;
            $.each(data, function(index, item) {
                if(self.claim_ids.indexOf(item.Claim.id) < 0) {
                    item.Claim.signature = "";
                    item.Claim.witness = "";
                    self.new_claims.push(new Claim(item));
                    self.claim_ids.push(item.Claim.id);
                }
            });
        }
        
        self.upload = function() {
            $('.progress_bar').slideDown();
            var pictures = 0;
            var tmpclaim;
            
            //var file_options = new FileUploadOptions();
            
            $.each(self.open_claims(), function(index, item) {
                    self.progress.title('Uploading Report: '+item.data.claimFileID+' '+item.data.last_name);
                    tmpclaim = {
                        json: ko.toJSON(item)
                    };
                    router.post('app/claims/upload',tmpclaim,self.progress.total,function(data) {
                        console.log(['sucess',data]);
                        item.upload_preliminary(false);
                    });
                if(item.upload_preliminary()) {
                    item.upload_preliminary(false);
                }
                if(item.upload_advanced()) {
                    item.upload_advanced(false);
                }
                if(item.upload_engineer()) {
                    item.upload_engineer(false);
                }
            });
            $('.progress_bar').slideUp();
        }
    }
});