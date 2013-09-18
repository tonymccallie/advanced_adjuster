define(['knockout','router','jquery','util/signature'], function(ko, router, jquery, SignatureCapture ) {
    return function Claim(data) {
        var self = this;
        var observableArray = ['title_verified'];
        var quality = {
            quality:75,
            destinationType : 0,
            targetHeight:600,
            targetWidth:600
        };
        
        self.signature = null;
        self.witness = null;
        
        self.upload_preliminary = ko.observable(false);
        self.upload_advanced = ko.observable(false);
        self.upload_engineer = ko.observable(false);
        
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
            self.data[self.selectedPicture] = 'data:image/jpeg;base64,'+data;
            router.loadPage('pictures');
            //$('#photoinfo').html(data);
        }
        
        self.advanced = function() {
            self.open_claim();
            router.loadPage('advanced',self.processAdvanced);
        }
        
        self.processAdvanced = function() {
            if(self.data.signature == "") {
                self.signature = new SignatureCapture( "signature" );
            }
            if(self.data.witness == "") {
                self.witness = new SignatureCapture( "witness" );
            }
        }
        
        self.clearSignature = function() {
            self.signature.clear();
        }
        
        self.clearWitness = function() {
            self.witness.clear();
        }
        
        self.saveSignatures = function() {
            if(self.data.signature == "") {
                self.data.signature = self.signature.toString();
            }
            if(self.data.witness == "") {
                self.data.witness = self.witness.toString();
            }
            viewModel.claims.store();
            router.loadPage('reports');
        }
        
        self.engineer = function() {
            self.open_claim();
            router.loadPage('engineer');
        }
    }
});