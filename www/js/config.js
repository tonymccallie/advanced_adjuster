define(function() {
    return app = {
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
                navigator.camera = {
                    getPicture: function(callback,ignore,quality) {
                        callback('/advadj/www/img/test_image.jpeg');
                    }
                };
                Camera = {
                    PictureSourceType: {
                        PHOTOLIBRARY:0,
                        CAMERA:1
                    }
                };
                LocalFileSystem = {
                    PERSISTENT:1
                }
                window.requestFileSystem = function(ignore, unknown, success, error) {
                    success({
                        root:{
                            fullPath:'/Users/tonymccallie/Sites/advadj/www'
                        }
                    });
                }
            }
        },
        deviceready: function() {
            
        },
        report: function(id) {
            // Report the event in the console
            console.log("Report: " + id);
    
            // Toggle the state from "pending" to "complete" for the reported ID.
            // Accomplished by adding .hide to the pending element and removing
            // .hide from the complete element.
            document.querySelector('#' + id + ' .pending').className += ' hide';
            var completeElem = document.querySelector('#' + id + ' .complete');
            completeElem.className = completeElem.className.split('hide').join('');
        }
    };
});
