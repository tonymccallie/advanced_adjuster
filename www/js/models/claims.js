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
                    self.new_claims.push(new Claim(item));
                    self.claim_ids.push(item.Claim.id);
                }
            });
        }
        
        self.upload = function() {
            $('.progress_bar').slideDown();
            var pictures = 0;
            var tmpclaim;
            var pics = [
                {
                    field:'pic_front_left', title: 'Front Left'
                },
                {
                    field:'pic_front_right', title: 'Front Right'
                },
                {
                    field:'pic_rear_left', title: 'Rear Left'
                },
                {
                    field:'pic_rear_right', title: 'Rear Left'
                },
                {
                    field:'pic_water_inside', title: 'Water Inside'
                },
                {
                    field:'pic_water_outside', title: 'Water Outside'
                },
                {
                    field:'pic_optional1', title: 'Optional 1'
                },
                {
                    field:'pic_optional1', title: 'Optional 2'
                },
                {
                    field:'pic_optional1', title: 'Optional 3'
                },
                {
                    field:'pic_optional1', title: 'Optional 4'
                }
            ];
            
            //var file_options = new FileUploadOptions();
            
            $.each(self.open_claims(), function(index, item) {
                if(item.upload_preliminary()) {
                    self.progress.title('Report data');
                    tmpclaim = {
                        json: ko.toJSON(item)
                    };
                    router.post('app/claims/upload',tmpclaim,self.progress.total,function(data) {
                        console.log(['sucess',data]);
                    });
                    $.each(pics,function(index,picfield) {
                        if(item.data[picfield.field] != '') {
                            console.log(['image',picfield.title])
                            self.progress.title(picfield.title);
                            router.post('app/claims/image',{file:item.data[picfield.field]},self.progress.total,function(data) {
                                console.log(['sucess',data]);
                            });
                            pictures++;
                        }
                    });
                }
            });
        }
    }
});