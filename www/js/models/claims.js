define(['knockout','router','models/claim','sizeof'],function(ko, router, Claim, SizeOf) {
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
        
        self.overall_progress = ko.observable(0);
        self.toUpload = ko.computed(function() {
            var tmplist = [];
            $.each(self.open_claims(), function(index, item) {
                if((item.upload_preliminary()) || (item.upload_advanced()) || (item.upload_engineer())) {
                    tmplist.push(item);
                }
            });
            return tmplist;
        },self);
        self.overall_current = 0;

        self.init = function() {
            if(localStorage.getItem('advadj_claims') !== null) {
                var claims = ko.utils.parseJson(localStorage.getItem('advadj_claims'));
                $.each(claims, function(index,item) {
                    self.open_claims.push(new Claim(item));
                    self.claim_ids.push(item.Claim.id);
                });
                
                self.open_claims.sort(function(left,right) {
                    return left.data.claimFileID == right.data.claimFileID ? 0 : (left.data.claimFileID > right.data.claimFileID) ? -1 : 1;
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
            viewModel.check_memory();
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
            var pictures = 0;
            var tmpclaim;
            
            //var file_options = new FileUploadOptions();
            //TODO Get over here
            var deferreds = [];

            $.each(self.toUpload(), function(index, item) {
                tmpclaim = {
                    json: ko.toJSON(item)
                };

                var deferred = router.post('app/claims/upload',tmpclaim,item.progress);

                deferred.progress(function(data) {
                    console.log(['Progress',data]);
                }).done(function(data) {
                    console.log(['Done',data]);
                }).fail(function(data) {
                    console.log(['Fail',data]);
                });

                deferreds.push(deferred);

//                if((item.upload_preliminary()) || (item.upload_advanced()) || (item.upload_engineer())) {
//                    $('#upload_error').html($('#upload_error').html()+'<br/>Uploading Report: '+item.data.claimFileID+' '+item.data.last_name);
//                    $('#loading').fadeIn(400,function() {
//
//                    });
//                    try {
//
//                    } catch(error) {
//                        navigator.notification.alert('There was an error uploading the reports',null,'Advanced Adjusting');
//                        $('#upload_error').html($('#upload_error').html()+'<br/>Error on claim '+item.data.claimFileID+': '+error);
//                    }
//                     $('#loading').fadeOut();
//                }


//                if(item.upload_preliminary()) {
//                    item.upload_preliminary(false);
//                }
//                if(item.upload_advanced()) {
//                    item.upload_advanced(false);
//                }
//                if(item.upload_engineer()) {
//                    item.upload_engineer(false);
//                }
            });

            $.when.apply($, deferreds).then(function(data){
                //ALL items complete
                console.log(['All Complete',data]);
            }).fail(function(data){
                // Probably want to catch failure
                console.log(['All Fail',data]);
            });

            //router.loadPage('reports');

           
        }
    }
});
