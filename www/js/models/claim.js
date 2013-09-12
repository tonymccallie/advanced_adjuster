define(['knockout','router','jquery'], function(ko, router, jquery) {
    return function Claim(data) {
        var self = this;
        var observableArray = ['title_verified'];
        var quality = {
            quality:60,
            targetHeight:300,
            targetWidth:300
        };
        
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
            router.loadPage('preliminary');
        }
        
        self.preliminaryProcess = function(data) {
            router.loadPage('reports');
        }
        
        //PICTURES
        self.pictures = function() {
            router.loadPage('pictures');
        }
        
        
        self.getPhoto1 = function() {
            navigator.camera.getPicture(self.processPicture1,null,quality);
        }
    }
});