var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
        if (!navigator.userAgent.match(/(iPad|iPhone|Android)/)) {
        	isMobile = false;
			navigator.notification = {
				alert:function (message) {
					alert(message);
				},
				confirm:function (message, callback) {
					var response = confirm(message);
					var converted = 2;
					if(response) {
						converted = 1;
					} else {
						converted = 2;
					}
					callback(converted);
				}
			}; 
        }
    },
    deviceready: function() {
        
    }
};

app.initialize();