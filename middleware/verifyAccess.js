

function verifyToken(req,res,next) {

var token = req.cookies.token || '' ; 

if (!token) {

    return res.redirect('/login')
}
else {

    next();
}

}


module.exports = verifyToken;