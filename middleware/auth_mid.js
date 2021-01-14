module.exports = {
    ensureAuth: function (req, res, next) {
        if(req.isAuthenticated()){
            return next()
        }
        else{
            res.redirect('/')
        }
    },
    // ensure logged in users don't see login page
    ensureGuest: function(req, res, next) {
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }
        else{
            return next()
        }
    }
}