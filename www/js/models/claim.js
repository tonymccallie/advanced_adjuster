define(['knockout','router','jquery'], function(ko, router, jquery) {
    return function Claim(data) {
        var self = this;
        var observableArray = ['title_verified'];
        var quality = {
            quality:60,
            targetHeight:300,
            targetWidth:300
        };
        
        self.open_claim = function() {
            if(viewModel.claims.new_claims.indexOf(viewModel.selectedClaim()) >= 0) {
                viewModel.claims.open_claims.push(viewModel.selectedClaim());
                viewModel.claims.new_claims.remove(viewModel.selectedClaim());
            }
            viewModel.claims.store();
        }
        
        self.data = {
            id:data.Claim.id
        };
        
        $.each(data.Claim, function(index,item) {
            self.data[index] = item;
//            if($.inArray(index,observableArray) >= 0) {
//                self.data[index] = ko.observable(item);
//            } else {
//                self.data[index] = item;
//            }
        });
        
        self.select = function(claim) {
            viewModel.selectedClaim(claim);
        }
        
        //PRELIMINARY REPORT
        self.preliminary = function() {
            self.open_claim();
            router.loadPage('preliminary');
        }
        
        self.preliminaryProcess = function(data) {
            self.open_claim();
            router.loadPage('reports');
        }
        
        //PICTURES
        self.selectedPicture = null;
        
        self.pictures = function() {
            self.open_claim();
            router.loadPage('pictures');
        }
        
        
        self.getPhoto = function(field,data) {
            self.selectedPicture = field;
            navigator.camera.getPicture(self.processPicture,null,quality);
        }
        
        self.processPicture = function(data) {
            self.open_claim();
            self.data[self.selectedPicture] = data;
            router.loadPage('pictures');
            //$('#photoinfo').html(data);
        }
        
        self.advanced = function() {
            self.open_claim();
            router.loadPage('advanced');
        }
        
        self.engineer = function() {
            self.open_claim();
            router.loadPage('engineer');
        }
    }
});