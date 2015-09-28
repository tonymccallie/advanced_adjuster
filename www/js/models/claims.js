define(['knockout','router','models/claim','sizeof'],function(ko, router, Claim, SizeOf) {
    return function Claims() {
        var self = this;
        self.new_claims = ko.observableArray([]);
        self.open_claims = ko.observableArray([]);
        self.claim_ids = [];
        self.selected = ko.observable();
        self.uploading = ko.observable(false);
        self.progress = {
            total: ko.observable(0),
            title: ko.observable('test')
        };
		
		self.filter = ko.observable();
		
		self.filteredNewClaims = ko.computed(function() {
			if(!self.filter()) {
				return self.new_claims();
			} else {
				return ko.utils.arrayFilter(self.new_claims(), function(claim) {
					if(
						(claim.data.claimFileID.toLowerCase().indexOf(self.filter().toLowerCase()) > -1)||
						(claim.data.last_name.toLowerCase().indexOf(self.filter().toLowerCase()) > -1)||
						(claim.data.company.toLowerCase().indexOf(self.filter().toLowerCase()) > -1)) {
						return true;
					} else {
						return false;
					}
				});
			}
		});
		
		self.filteredOpenClaims = ko.computed(function() {
			if(!self.filter()) {
				return self.open_claims();
			} else {
				return ko.utils.arrayFilter(self.open_claims(), function(claim) {
					if(
						(claim.data.claimFileID.toLowerCase().indexOf(self.filter().toLowerCase()) > -1)||
						(claim.data.last_name.toLowerCase().indexOf(self.filter().toLowerCase()) > -1)||
						(claim.data.company.toLowerCase().indexOf(self.filter().toLowerCase()) > -1)) {
						return true;
					} else {
						return false;
					}
				});
			}
		});
		
		self.marked = ko.computed(function() {
			var markedClaims = [];
			ko.utils.arrayFilter(self.open_claims(), function(claim) {
				if(claim.marked() == true) {
					markedClaims.push(claim);
				}
			});
			return markedClaims;
		});
        
        self.overall_progress = ko.observable(0);
        self.toUpload = ko.computed(function() {
            var tmplist = [];
            $.each(self.open_claims(), function(index, item) {
                if((item.upload_preliminary()) || (item.upload_advanced()) || (item.upload_engineer()) || (item.upload_inspection())) {
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
            router.request('app/claims/list?'+Date.now(),self.updateProcess,{data:{User:{id:viewModel.user().user_id()}}});
        }
        
        self.updateProcess = function(data) {
			console.log(data);
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
        
        self.log = function(info) {
            $('#upload_error').html($('#upload_error').html()+'<br/><i class="icon-check-sign"></i> '+info);
        }

        self.finish_upload = function() {
            $('#upload_error').html('');
            router.loadPage('reports');
        }
        
        self.image_upload = function(imageURI, item, field) {
            return $.Deferred(function() {
                var defself = this;
                try {
                    var ft = new FileTransfer();
                    var options = new FileUploadOptions();
                    var key = item.data.id+'_'+field;
                    options.fileKey = 'image';
                    options.fileName = key+'.jpg';
                    options.mimeType = "image/jpeg";
                    options.params = {
                            claim_id:item.data.id,
                            field: field
                    };
                    options.chunkedMode = true;
                    ft.upload(
                        imageURI, 
                        DOMAIN+'app/claims/image_upload', 
                        function(response) {
                            self.log(key + ' finished uploading');
                            defself.resolve();
                        }, 
                        function(error) {
                            switch(error.code) {
                                case FileTransferError.FILE_NOT_FOUND_ERR:
                                    reason = 'File not found.';
                                    break;
                                case FileTransferError.INVALID_URL_ERR:
                                    reason = 'Invalid URL.';
                                    break;
                                case FileTransferError.CONNECTION_ERR:
                                    reason = 'Connection Problem.';
                                    break;
                                case FileTransferError.ABORT_ERR:
                                    reason = 'Transfer Aborted.';
                                    break;
                            }
                            self.log('ERROR: '+item.data.claimFileID+' had an error uploading: ' + reason + '<br />' + error.source + ':' + error.target + ':' + error.http_status);
                            defself.resolve();
                        },
                        options
                    );

                    ft.onprogress = function(progressEvent) {
                        if (progressEvent.lengthComputable) {
                            var percentageComplete = progressEvent.loaded / progressEvent.total;
                            item.image_progress(percentageComplete * 100);
                            self.log(percentComplete * 100);
                        }
                    }
                } catch(e) {
                    self.log(e);
                }
            });
        }

        self.upload = function() {
            var pictures = 0;
            var tmpclaim;
            
            //var file_options = new FileUploadOptions();
            //TODO Get over here
            var deferreds = [];

            var notify = function() {

            }
            self.log('Starting uploads...');
            $('#updload_spin').show();
            $('#upload_btn').attr('disabled','disabled');
            $.each(self.toUpload(), function(index, item) {
                //UPLOAD IMAGES?
                tmpclaim = {
                    json: ko.toJSON(item)
                };
                $.each(PICS,function(index,pic) {
                    if(item.data[pic] !== '') {
                        deferreds.push(self.image_upload(item.images[pic](),item,pic));
                    }
                });
                
                self.log('Uploading '+item.data.claimFileID);

                try {
                    var deferred = router.post('app/claims/upload',tmpclaim,item.progress);

                    deferred.done(function(data) {
                        self.log(item.data.claimFileID+' finished');
                        $('#updload_spin').hide();
                        $('#upload_btn').attr('disabled',null);
                    }).fail(function(data) {
                        self.log(item.data.claimFileID+' had an error. The error returned was: "'+data.statusText+'"');
                    });

                    deferreds.push(deferred);
                } catch(error) {
                    self.log(error);
                }
            });

            $.when.apply($, deferreds).then(function(data){
                //ALL items complete
                self.log('All Uploads Complete');
                $.each(self.toUpload(), function(index, item) {
                    item.progress(0);
                    if(item.upload_preliminary()) {
                       item.upload_preliminary(false);
                    }
                    if(item.upload_advanced()) {
                        item.upload_advanced(false);
                    }
                    if(item.upload_engineer()) {
                        item.upload_engineer(false);
                    }
                    if(item.upload_inspection()) {
                        item.upload_inspection(false);
                    }
                });
            }).fail(function(data){
                // Probably want to catch failure
                self.log('There were some errors uploading your reports. Please try again later. If the problem persists, please contact the administrator.');
            });

            //router.loadPage('reports');

           
        }
    }
});
