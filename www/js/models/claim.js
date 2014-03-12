define(['knockout','router','jquery','util/signature'], function(ko, router, jquery, SignatureCapture ) {
    return function Claim(data) {
        var self = this;
        var observableArray = ['title_verified'];
        var quality = {
            quality:75,
            destinationType : 1,
            targetHeight:600,
            targetWidth:600,
            saveToPhotoAlbum: true
        };
        self.use_library = ko.observable(false);
        self.closeClaim = null;
        
        self.signature = null;
        self.witness = null;
        
        self.upload_preliminary = ko.observable(false);
        self.upload_advanced = ko.observable(false);
        self.upload_engineer = ko.observable(false);
        self.upload = ko.computed(function() {
            if((self.upload_preliminary()) || (self.upload_advanced()) || (self.upload_engineer())) {
                return true;
            } else {
                return false;
            }
        });

        self.progress = ko.observable(0);
        self.image_progress = ko.observable(0);
        
        self.open_claim = function() {
            if(viewModel.claims.new_claims.indexOf(viewModel.selectedClaim()) >= 0) {
                viewModel.claims.open_claims.push(viewModel.selectedClaim());
                viewModel.claims.new_claims.remove(viewModel.selectedClaim());
            }
            viewModel.claims.store();
        }
        
        self.data = {
            id:data.Claim.id,
            complete_preliminary:false,
            complete_pictures:false,
            complete_advanced:false,
            complete_engineer:false,
            complete_inspection:false
        };
        
        self.images = {};
        
        $.each(PICS, function(index,item) {
            self.images[item] = ko.observable('');
            if((data.Claim[item].substr(0,1) !== '/')&&(data.Claim[item].substr(0,4) !== 'file')) {
                data.Claim[item] = '';
            } else {
                 self.images[item](data.Claim[item]);
            }
        });

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
        
        self.preliminaryProcess = function() {
            self.data.complete_preliminary = true;
            viewModel.claims.store();
            self.open_claim();
            router.loadPage('reports');
        }
        
         self.preliminarySave = function() {
            self.data.complete_preliminary = true;
            viewModel.claims.store();
            self.open_claim();
            router.loadPage('reports');
        }
        
        self.close = function(claim) {
            self.closeClaim = claim;
            navigator.notification.confirm('Are you sure you want to delete this claim? This can\'t be undone',function(response) {
               if(response === 1) {
                   router.request('app/claims/close',self.closeProcess,{data:{Claim:{id:claim.data.id,status:'CLOSED'}}});
               }
            });
        }
        
        self.closeProcess = function(data) {
            viewModel.selectedClaim = ko.observable();
            viewModel.claims.open_claims.remove(self.closeClaim);
            viewModel.claims.store();
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
            if(self.use_library()) {
                quality.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                quality.saveToPhotoAlbum = false;
            } else {
                quality.sourceType = Camera.PictureSourceType.CAMERA;
                quality.saveToPhotoAlbum = true;
            }
            navigator.camera.getPicture(self.processPicture,null,quality);
        }
        
        self.processPicture = function(data) {
            self.open_claim();
            self.data[self.selectedPicture] = data;//'data:image/jpeg;base64,'+data;
            self.images[self.selectedPicture](data);
            //router.loadPage('pictures');
            //$('#photoinfo').html(data);
        }
        
        self.savePicture = function() {
            self.data.complete_pictures = true;
            viewModel.claims.store();
            router.loadPage('reports');
        }
        
        //Advanced
        self.advanced = function() {
            self.open_claim();
            router.loadPage('advanced');
        }
        
        self.loadAdvancedCopy = function() {
            try {
            router.loadPage('advanced_copy');
            } catch(e) {
                console.log(e);
            }
        }
        
        self.loadSignatures = function() {
            router.loadPage('signatures',self.processAdvanced);
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
            self.data.complete_advanced = true;
            viewModel.claims.store();
            router.loadPage('reports');
        }
        
        self.engineer = function() {
            self.open_claim();
            router.loadPage('engineer');
        }
        
        self.saveEngineer = function() {
            self.data.complete_engineer = true;
            viewModel.claims.store();
            router.loadPage('reports');
        }
        
        self.inspection = function() {
            self.open_claim();
            router.loadPage('inspection');
        }
        
        self.saveInspection = function() {
            self.data.complete_inspection = true;
            viewModel.claims.store();
            router.loadPage('reports');
        }
        
        self.debug = function() {
            self.open_claim();
            router.loadPage('debug');
        }
    }
});
