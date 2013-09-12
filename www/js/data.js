

function Data() {
    var self = this;
    
    self.loadClaims = function() {
    	var data = [
            {
                'first_name':'Jim',
                'last_name':'Bob',
                'phone' : '806-555-5557',
                'address' : '1234 West 3rd Ave.',
                'city' : 'Amarillo',
                'state' : 'TX',
                'zip' : '79102',
                'number' : '27155'
            },
            {
                'first_name':'Fred',
                'last_name':'Green',
                'phone' : '806-555-5553',
                'address' : '1234 Parkway Dr.',
                'city' : 'Amarillo',
                'state' : 'TX',
                'zip' : '791029',
                'number' : '27167'
            },
            {
                'first_name':'Sally & Joe',
                'last_name':'Smithers',
                'phone' : '806-555-5556',
                'address' : '1234 West 2nd St.',
                'city' : 'Canyon',
                'state' : 'TX',
                'zip' : '79118',
                'number' : '25435'
            },
            {
                'first_name':'Jack',
                'last_name':'Reacher',
                'phone' : '806-555-5551',
                'address' : '1234 West 1st St.',
                'city' : 'Perryton',
                'state' : 'TX',
                'zip' : '79111',
                'number' : '27567'
            },
            {
                'first_name':'James',
                'last_name':'Dean',
                'phone' : '806-555-5552',
                'address' : '1234 Broadway Dr.',
                'city' : 'Amarillo',
                'state' : 'TX',
                'zip' : '79102',
                'number' : '27151'
            }
        ];
        
        var objects = [];
        
        $.each(data, function(index,item) {
	        objects.push(new Claim(item));
        });
        
        return objects;
    }
}