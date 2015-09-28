define(['knockout', 'router', 'models/user', 'models/claims'], function (ko, router, User, Claims) {
	return function AppViewModel() {
		var self = this;
		self.memory = ko.observable(0);
		self.user = ko.observable(new User());
		self.claims = new Claims;
		self.saved_payment_requests = ko.observableArray([]);
		self.selectedClaim = ko.observable();
		self.logs = ko.observableArray([]);

		self.loadPage = function (url) {
			router.loadPage(url);
		}

		self.loadReports = function () {
			router.loadPage('reports');
		}

		self.initialize = function () {
			if (isMobile) {
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
					gFileSystem = fileSystem;
					fileSystemPath = fileSystem.root.fullPath;
				}, viewModel.log);
			}
			//check login
			if (localStorage.getItem('advadj_user') !== null) {
				self.user().load();
			} else {
				self.loadPage('login');
			}
		}

		self.settings = function () {
			router.loadPage('settings', self.processSettings);
		}

		self.processSettings = function () {
			if (viewModel.user().signature == "") {
				viewModel.user().signature_obj = new SignatureCapture("signature");
			}
		}

		self.check_memory = function () {
			var currentSize = (((sizeof(localStorage.getItem('advadj_claims'))) / 1024 / 1024) / 5) * 100;
			self.memory(currentSize)
		}

		self.upload = function () {
			router.loadPage('upload', self.processUpload);
		}

		self.processUpload = function () {

		}

		self.update = function () {

		}

		self.log = function (log) {
			self.logs.push(log);
		}

		self.viewlog = function () {
			router.loadPage('logs');
		}

		self.selectDelete = function () {
			router.loadPage('report_list');
		}

		self.deleteReports = function () {
			navigator.notification.confirm('Are you sure you want to delete these claims? This can\'t be undone', function (response) {
				if (response === 1) {
					ko.utils.arrayFilter(self.claims.marked(), function (claim) {
						claim.close(claim, function (data) {
							viewModel.claims.open_claims.remove(claim);
						})
					});
					viewModel.selectedClaim = ko.observable();
					viewModel.claims.store();
				}
			});
		}
	}
});