define(['knockout', 'router', 'jquery', 'util/signature'], function (ko, router, jquery, SignatureCapture) {
	return function Claim(data) {
		var self = this;
		var observableArray = ['title_verified'];
		var quality = {
			quality: 75,
			destinationType: 1,
			targetHeight: 600,
			targetWidth: 600,
			saveToPhotoAlbum: true
		};
		self.fileEntry = null;
		self.newFileName = null;
		self.claimDir = null;
		self.use_library = ko.observable(false);
		self.closeClaim = null;
		self.marked = ko.observable(false);
		self.signature = null;
		self.witness = null;
		self.principleSig = null;
		self.primarySig = null;

		self.upload_preliminary = ko.observable(false);
		self.upload_advanced = ko.observable(false);
		self.upload_engineer = ko.observable(false);
		self.upload_inspection = ko.observable(false);
		self.upload_reserve = ko.observable(false);
		self.upload = ko.computed(function () {
			if ((self.upload_preliminary()) || (self.upload_advanced()) || (self.upload_engineer()) || (self.upload_inspection()) || (self.upload_reserve())) {
				return true;
			} else {
				return false;
			}
		});

		self.progress = ko.observable(0);
		self.image_progress = ko.observable(0);

		self.open_claim = function () {
			if (viewModel.claims.new_claims.indexOf(viewModel.selectedClaim()) >= 0) {
				viewModel.claims.open_claims.push(viewModel.selectedClaim());
				viewModel.claims.new_claims.remove(viewModel.selectedClaim());
			}
			viewModel.claims.store();
		}

		self.data = {
			id: data.Claim.id,
			complete_preliminary: false,
			complete_pictures: false,
			complete_advanced: false,
			complete_engineer: false,
			complete_inspection: false,
			complete_principle: false,
			complete_primary: false
		};

		self.images = {};

		$.each(PICS, function (index, item) {
			self.images[item] = ko.observable('');
			if ((data.Claim[item].substr(0, 1) !== '/') && (data.Claim[item].substr(0, 4) !== 'file')) {
				data.Claim[item] = '';
			} else {
				self.images[item](data.Claim[item]);
			}
		});

		$.each(data.Claim, function (index, item) {
			self.data[index] = item;
		});

		self.displayTitle = ko.computed(function () {
			if (self.data.last_name === "") {
				if (typeof self.data.company == 'undefined') {
					return 'Company';
				} else {
					return self.data.company;
				}
			} else {
				return self.data.last_name;
			}
		});

		self.select = function (claim) {
			viewModel.selectedClaim(claim);
			router.loadPage('reports');
		}

		//PRELIMINARY REPORT
		self.preliminary = function () {
			self.open_claim();
			router.loadPage('preliminary', function () {
				$('input[type=date]').pickadate({
					format: 'yyyy-mm-dd',
					selectMonths: true,
					selectYears: 100
				});
			});
		}

		self.preliminaryProcess = function () {
			self.data.complete_preliminary = true;
			viewModel.claims.store();
			self.open_claim();
			router.loadPage('reports');
		}

		self.preliminarySave = function () {
			self.data.complete_preliminary = true;
			viewModel.claims.store();
			self.open_claim();
			router.loadPage('reports');
		}

		self.checkClose = function (claim) {
			navigator.notification.confirm('Are you sure you want to delete this claim? This can\'t be undone', function (response) {
				if (response === 1) {
					self.close(claim, self.closeProcess);
				}
			});
		}

		self.close = function (claim, process) {
			appLog('claim.close');
			self.closeClaim = claim;

			try {
				var dir = claim.data.claimFileID + '_images';
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
					appLog('requestFileSystem');
					if (typeof fileSystem.root.getDirectory == 'undefined') {
						router.request('app/claims/close', process, {
							data: {
								Claim: {
									id: claim.data.id,
									status: 'CLOSED'
								}
							}
						});
					} else {
						fileSystem.root.getDirectory(dir, {
							create: true
						}, function (dirEntry) {
							appLog('getDirectory')
							dirEntry.removeRecursively(function () {
								appLog('removeRecursively');
								router.request('app/claims/close', process, {
									data: {
										Claim: {
											id: claim.data.id,
											status: 'CLOSED'
										}
									}
								});
							}, function () {
								viewModel.log('removeRecursively failed');
							});
						}, function () {
							viewModel.log('getDirectory failed');
						});
					}
				}, function () {
					viewModel.log('requestFileSystem failed');
				});
			} catch (e) {
				appLog('catch delete: ' + e)
				viewModel.log('catch delete: ' + e);
			}
		}

		self.closeProcess = function (data) {
			appLog('closeProcess');
			self.removeClaim(self.closeClaim).then(function () {
				appLog(viewModel.claims.open_claims());
				viewModel.selectedClaim = ko.observable();
				viewModel.claims.store();
				router.loadPage('reports');
			});
		}

		self.removeClaim = function (claim) {
			appLog('removeClaim');
			var deferred = jQuery.Deferred();

			var claim_id_index = viewModel.claims.claim_ids.indexOf(claim.data.id);
			if (claim_id_index > -1) {
				viewModel.claims.claim_ids.splice(claim_id_index, 1);
			}

			viewModel.claims.open_claims.remove(claim);

			setTimeout(function () {
				deferred.resolve('done');
			}, 0);

			return deferred.promise();
		}

		//PICTURES
		self.selectedPicture = null;

		self.pictures = function () {
			self.open_claim();
			router.loadPage('pictures');
		}


		self.getPhoto = function (field, data) {
			self.selectedPicture = field;
			if (self.use_library()) {
				quality.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
				quality.saveToPhotoAlbum = false;
			} else {
				quality.sourceType = Camera.PictureSourceType.CAMERA;
				quality.saveToPhotoAlbum = true;
			}
			navigator.camera.getPicture(self.processPicture, null, quality);
		}

		self.processPicture = function (imageURI) {
			//Move picture to local filesystem
			gImageURI = imageURI;
			if (isMobile) {
				try {
					window.resolveLocalFileSystemURI(imageURI, self.gotFileEntry, viewModel.log);
				} catch (err) {
					viewModel.log('catch: ' + err);
				}
			} else {
				self.open_claim();
				self.data[self.selectedPicture] = '/' + claimDir + '/' + newFileName;
				self.images[self.selectedPicture](imageURI);
			}
			//router.loadPage('pictures');
			//$('#photoinfo').html(data);
		}

		self.gotFileEntry = function (fileEntry) {
			self.fileEntry = fileEntry;
			self.claimDir = self.data.claimFileID + '_images';
			gFileSystem.root.getDirectory(self.claimDir, {
				create: true
			}, self.gotDirectory, viewModel.log);
		}

		self.gotDirectory = function (dataDir) {
			var d = new Date();
			var n = d.getTime();
			self.newFileName = n + ".jpg";
			self.fileEntry.moveTo(dataDir, self.newFileName, self.gotNewFileEntry, viewModel.log);
		}

		self.gotNewFileEntry = function (newFileEntry) {
			self.open_claim();
			self.data[self.selectedPicture] = newFileEntry.nativeURL;
			self.images[self.selectedPicture](newFileEntry.nativeURL);
		}


		self.savePicture = function () {
			self.data.complete_pictures = true;
			viewModel.claims.store();
			router.loadPage('reports');
		}

		//Advanced
		self.advanced = function () {
			self.open_claim();
			router.loadPage('advanced');
		}

		self.loadAdvancedCopy = function () {
			try {
				router.loadPage('advanced_copy');
			} catch (e) {
				appLog(e);
			}
		}

		self.loadSignatures = function () {
			router.loadPage('signatures', self.processAdvanced);
		}

		self.processAdvanced = function () {
			if (self.data.signature == "") {
				self.signature = new SignatureCapture("signature");
			}
			if (self.data.witness == "") {
				self.witness = new SignatureCapture("witness");
			}
		}

		self.clearSignature = function () {
			self.signature.clear();
		}

		self.clearWitness = function () {
			self.witness.clear();
		}

		self.saveSignatures = function () {
			if (self.data.signature == "") {
				self.data.signature = self.signature.toString();
				self.signature = null;
			}
			if (self.data.witness == "") {
				self.data.witness = self.witness.toString();
				self.witness = null;
			}
			self.data.complete_advanced = true;
			viewModel.claims.store();
			router.loadPage('reports');
		}

		self.engineer = function () {
			self.open_claim();
			router.loadPage('engineer');
		}

		self.saveEngineer = function () {
			self.data.complete_engineer = true;
			viewModel.claims.store();
			router.loadPage('reports');
		}

		self.reserve = function () {
			self.open_claim();
			router.loadPage('reserve');
		}

		self.saveReserve = function () {
			self.data.complete_reserve = true;
			viewModel.claims.store();
			router.loadPage('reports');
		}

		self.inspection = function () {
			self.open_claim();
			router.loadPage('inspection');
		}

		self.inspectionProcess = function () {
			self.data.complete_inspection = true;
			viewModel.claims.store();
			self.open_claim();
			router.loadPage('reports');
		}

		self.saveInspection = function () {
			self.data.complete_inspection = true;
			viewModel.claims.store();
			router.loadPage('reports');
		}


		//Principle Residence
		self.principle = function () {
			self.open_claim();
			router.loadPage('principle', self.processPrinciple);
		}

		self.processPrinciple = function () {
			if (!self.data.principleSig) {
				self.principleSig = new SignatureCapture("principleSig");
			}
		}

		self.clearPrinciple = function () {
			self.principleSig.clear();
		}

		self.savePrinciple = function () {
			if (!self.data.principleSig) {
				self.data.principleSig = self.principleSig.toString();
				self.principleSig = null;
			}
			self.data.complete_principle = true;
			viewModel.claims.store();
			router.loadPage('reports');
		}


		//Primary Residence
		self.primary = function () {
			self.open_claim();
			router.loadPage('primary', self.processPrimary);
		}

		self.processPrimary = function () {
			if (!self.data.primarySig) {
				self.primarySig = new SignatureCapture("primarySig");
			}
		}

		self.clearPrimary = function () {
			self.primarySig.clear();
		}

		self.savePrimary = function () {
			if (!self.data.primarySig) {
				self.data.primarySig = self.primarySig.toString();
				self.primarySig = null;
			}
			self.data.complete_primary = true;
			viewModel.claims.store();
			router.loadPage('reports');
		}

	}
});