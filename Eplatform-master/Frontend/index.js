require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var redisStore = require('connect-redis')(session);

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var expressJwt = require('express-jwt');
var config = require('config.json');
var siteService = require("./services/site.service");

const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    next();
});

app.use('/public', express.static(__dirname + '/public/'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ 
    secret: config.secret, 
    resave: false, 
    saveUninitialized: true,
    store: new redisStore({ 
        host: 'redis-19868.c61.us-east-1-3.ec2.cloud.redislabs.com', 
        port: 19868,
        pass: "nsc2XGA7mWzJePBgjZ0BDX2gqYDUthCh",
        ttl :  260
    }) 
}));


// Store lang to cookie
app.use(cookieParser());
app.use(function (req, res, next) {
    cookies = req.cookies;
    if (cookies.locale || config.langs.indexOf(req.query.language) >= 0) {
        req.language = req.query.language || cookies.locale;
    } else {
        req.language = config.langs[0];
        res.cookie("locale", req.language, {
            httpOnly: true,
            path: "/",
            domain: config.cookieDomain,
            expires: new Date((new Date()).getTime() + 86400000 * 30)
        })
    }
    next();
})

app.use("/change-lang/:lang", function(req, res) {
    let lang = config.langs[0];
    let newLang = req.params.lang;

    if(config.langs.indexOf(newLang) >= 0) {
        lang = newLang;
    }
    
    res.cookie("locale", lang, {
        httpOnly: true,
        path: "/",
        domain: '.smartdirectory.vn',
        expires: new Date((new Date()).getTime() + 86400000 * 30)
    })

    res.end();
});

// platform 
app.use(function (req, res, next) {
    var ua = req.headers['user-agent'];
    req.platform = "desktop/";
    
    if (req.query.result == "json") {
        req.platform = "json/";
    } else {
        try {
            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4))) {
                req.platform = "mobile/";
            } else {
                req.platform = "desktop/";
            }
        } catch(ex) {
            req.platform = "desktop/";
        }
    }
    next();
})


// make '/app' default route
function getNewID()
{
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    siteService.newCookie();
    return uuid;
}
app.use(function(req, res, next) {
    let cookies = req.cookies;
    if (!cookies.uuid) {
        req.uuid = getNewID();
        res.cookie("uuid", req.uuid, {
            httpOnly: true,
            path: "/",
            domain: config.cookieDomain,
            expires: new Date((new Date()).getTime() + 86400000 * 30)
        });
    } else {
        req.uuid = cookies.uuid;
    }
    next(); 
});
// apis
app.use('/api-v1.0/', require("./controllers/api/api.controller"));

// routes
// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/verify', require('./controllers/api/verify.controller'));
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/upgrade', require('./controllers/upgrade.controller'));
app.use('/upload', require('./controllers/upload.controller'));

// update thông tin
app.use('/edit', expressJwt({ secret: config.secret }).unless({ path: [] }));
app.use('/edit', require('./controllers/auth/company.controller'));

app.use('/', require('./controllers/base.controller'));

// start server
var server = app.listen(process.env.PORT || config.servicePort, function () {
    console.log('Server listening at ' + config.serviceProtocol + '://' + config.serviceHost + ':' + (process.env.PORT || config.servicePort));
});