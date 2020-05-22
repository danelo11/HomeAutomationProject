const auxiliary = {};

auxiliary.isAuthenticated = function(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    response.redirect('/users/signin');
};

module.exports = auxiliary;