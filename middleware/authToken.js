const jwt = require('jsonwebtoken');

const requireAuth = async(req, res, next) => {
    try {
        //const token = await req.headers['x-access-token'];
        const token = await req.cookies.token || '';


        // check json web token exists & is verified
        if (token) {
            // console.log(process.env.JWT_SECRET);
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    console.log(err);
                    console.log(err.message);
                    res.clearCookie('token');
                    res.sendStatus(200);
                    next();
                    //  res.redirect('/');

                } else {
                    // res.json({ decoded });
                    console.log(decodedToken);
                    req.decoded = decodedToken;
                    next();
                }
            });
        } else {
            console.log('Token not found');
            req.decoded = {
              role: undefined,
              userid: undefined
            }
            next();
            //res.redirect('/');

        }
    } catch(err) {
        console.error(err.message)
    }

};

module.exports = { requireAuth };
