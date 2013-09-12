define(['jquery','knockout'], function(jquery,ko) {
    return {
        request: function(url,callback,data,validation,loader,quiet) {
            if(typeof loader === 'undefined') {
                loader = true;
            }
            
            if(typeof quiet === 'undefined') {
                quiet = false;
            }
            
            if(loader) {
                $('#loading').show();
            } else {
                $('#refresh i').addClass('icon-spin');
            }
            
            var options = {
                url: DOMAIN+url+'.json',
                crossDomain: true,
                success: function (data) {
                    if(data.status == 'SUCCESS') {
                        callback(data.data);
                    } else {
                        switch(data.status) {
                            case 'VALIDATION':
                                validation(data.data);
                                break;
                            default:
                                console.log(data);
                                navigator.notification.alert('There was an error: ' + data.message,null,'Advanced Adjusting');
                                break;
                        }
                    }
                },
                complete: function(jqXHR, textStatus, errorThrown) {
                    if((textStatus != 'success')&&(!quiet)) {
                        //alert(errorThrown);
                        //navigator.notification.alert('There was a problem communicating with the server.',null,'GroupPost');
                    }
                    $('#loading').fadeOut();
                    $('#refresh i').removeClass('icon-spin');
                },
                dataType: 'json',
                async: true
            };
            
            if(typeof data === 'undefined') {
                options.type = 'GET';
            } else {
                options.type = 'POST';
                options.data = data;
            }
        
            try {
                $.ajax(options);
            } catch(e) {
                alert(e);
            }
        },
        loadPage: function(href, callback) {            
            var noTemplate = ['login','register','recover'];
        
            if(noTemplate.indexOf(href) >= 0) {
                $('#header, #footer').hide();
            } else {
                $('#header, #footer').show();
            }
            
            var timestamp = new Date().getTime();
            
            $.get('views/'+href+'.html?'+timestamp,function(data) {
                $('#content').html(data);
                ko.cleanNode($('#content').get(0));
                ko.applyBindings(viewModel, $('#content').get(0));
                window.scrollTo(0,0);
                Current = href;
                if(typeof callback !== 'undefined') {
                    callback();
                }
            });
        }
    }
});