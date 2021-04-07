//DEPENDENCIES
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session')

//CONFIGURATION
const app = express();
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
require('dotenv').config()
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
)
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clickies'
const bcrypt = require('bcrypt')
const server = app.listen(PORT)

//DATABASE
mongoose.connect( MONGODB_URI, {useNewUrlParser : true})

//MODELS
const Clicky = require('./models/clickmodel.js');
const User = require('./models/usersmodel.js')

//Socket setup
const io = require('socket.io')(server)

io.on('connection', (socket) =>{
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })
})

//CONTROLLERS
const userController = require('./controllers/userscont.js')
app.use('/users', userController)
const sendController = require('./controllers/sendcont.js')
app.use('/send', sendController)
const uploadController = require('./controllers/uploadcont.js')
app.use('/upload', uploadController)

//ROUTES


app.get('/', (req, res) => {
    res.redirect('/users')
})

//index for reference of all
app.get('/index' , (req, res) => {
    Clicky.find({}, (error, all) => {
        res.render('home.ejs' , {
            complete : all,
            
        })
    })
    console.log("current user is " + req.session.currentUser)
})

//public
app.get('/public' , (req, res) => {
    Clicky.find({user: 'public'}, (err, public) => {
        res.render('public.ejs' ,  {
            complete : public
        })
    })
})

//user home
app.get('/home' , (req, res) => {
    Clicky.find({user: req.session.currentUser, inbox: false}, (error, all) => {
        res.render('home.ejs' , {
            complete : all,
            user : req.session.currentUser
        })
    })
    console.log("current user is " + req.session.currentUser)
})

//search
app.post('/search' , (req, res) => {
    Clicky.find({tags: req.body.search, user: req.session.currentUser, inbox: false } ,(err, all) => {
        res.render('search.ejs' , {
            complete : all,
            tag: req.body.search
        })
    })
})

//inbox search
app.post('/inboxsearch' , (req, res) => {
    Clicky.find({tags: req.body.search, user: req.session.currentUser, inbox: true } ,(err, all) => {
        res.render('inbox.ejs' , {
            complete : all,
        })
    })
})

//public search
app.post('/publicsearch' , (req, res) => {
    Clicky.find({tags: req.body.search, user: "public"} ,(err, all) => {
        res.render('publicsearch.ejs' , {
            complete : all,
            tag : req.body.search
        })
    })
})

//inbox
app.get('/inbox' , (req, res) => {
    Clicky.find({user: req.session.currentUser, inbox: true}, (error, all) => {
        res.render('inbox.ejs' , {
            complete : all,
        })
    })
    console.log("current user is " + req.session.currentUser)
})

//create
app.post('/', (req, res) => {
    req.body.user = req.session.currentUser
    req.body.tags = req.body.tags.split(",")
    req.body.tags = req.body.tags.map(s => s.trim())
    Clicky.create(req.body, (err, newClick) =>{
        res.redirect('/home')
    })   
})

//public upload
app.post('/publicupload', (req, res) => {
    req.body.user = req.session.currentUser
    req.body.tags = req.body.tags.split(",")
    req.body.tags = req.body.tags.map(s => s.trim())
    Clicky.create(req.body, (err, newClick) =>{
        res.redirect('/public')
    }) 
})

//public search upload
app.post('/publicsearchupload', (req, res) => {
    req.body.user = req.session.currentUser
    req.body.tags = req.body.tags.split(",")
    req.body.tags = req.body.tags.map(s => s.trim())
    Clicky.create(req.body, (err, newClick) =>{
        Clicky.find({tags : req.body.search, user : "public"}, (err, found) => {
            res.render('publicsearch.ejs' , {
                complete : found,
                tag : req.body.search
            })
        })
    }) 
})

//create in search screen
app.post('/searchcreate', (req, res) => {
    req.body.user = req.session.currentUser
    req.body.tags = req.body.tags.split(",")
    req.body.tags = req.body.tags.map(s => s.trim())
    Clicky.create(req.body, (err, newClick) =>{
        Clicky.find({tags: req.body.search, user: req.session.currentUser, inbox: false } ,(err, all) => {
            res.render('search.ejs' , {
                complete : all,
                tag: req.body.search
            })
        })
    })   
})



//update in search screen
app.put('/searchupdate' , (req, res) => {
    req.body.tags = req.body.tags.split(",")
    req.body.tags = req.body.tags.map(s => s.trim())
    
    Clicky.findByIdAndUpdate(req.body.id, req.body, (err, updated) => {
        Clicky.find({tags: req.body.search, user: req.session.currentUser, inbox: false } ,(err, all) => {
            res.render('search.ejs' , {
                complete : all,
                tag: req.body.search
            })
        })
    })
})


//update
app.put('/:id' , (req, res) => {
    req.body.tags = req.body.tags.split(",")
    req.body.tags = req.body.tags.map(s => s.trim())
    Clicky.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
        res.redirect('/home')
    })
})

//cancel
app.post('/cancel', (req, res) => {
    res.redirect('/home')
})

//inbox cancel
app.post('/cancelinbox', (req, res) => {
    res.redirect('/inbox')
})

//public cancel
app.post('/publiccancel', (req, res) => {
    res.redirect('/public')
})

//public search cancel
app.post('/publicsearchcancel', (req, res) => {
    Clicky.find({tags : req.body.search, user: "public"}, (err, found) => {
        console.log(req.body)
        res.render('publicsearch.ejs', {
            complete : found,
            tag : req.body.search
        })
    })
})

//deleteAllHome
app.delete('/delete', (req, res) => {
    Clicky.deleteMany({inbox : false, user: req.session.currentUser },(err, data) => {
        res.redirect('/home')
    } )
})

//deleteAllInbox
app.delete('/deleteallinbox', (req, res) => {
    Clicky.deleteMany({inbox : true },(err, data) => {
        res.redirect('/inbox')
    } )
})

//search delete
app.delete('/searchdelete', (req, res) => {
    Clicky.findByIdAndRemove(req.body.id, { useFindAndModify: false}, (err ,data) => {
      Clicky.find({user: req.session.currentUser, inbox: false, tags: req.body.search}, (error, all)=> {
          res.render('search.ejs', {
            complete : all,
            tag: req.body.search
          })
      })
    })
})

//delete
app.delete('/:id' , (req, res) => {
    Clicky.findByIdAndRemove(req.params.id, { useFindAndModify: false}, (err ,data) => {
        if(data.inbox === true){
            res.redirect('/inbox')
        }else{
            res.redirect('/home')
        }
    })
})



//loads send interface for search trigger
app.post('/searchysend',(req, res) => {
    Clicky.find({user: req.session.currentUser, inbox: false, tags: req.body.search}, (error, all) => {
        res.render('searchsend.ejs' , {
            content : req.body,
            complete : all
        })
    })
})

//loads send interface for search clicky
app.post('/searchupsend',(req, res) => {
    Clicky.find({user: req.session.currentUser, tags: req.body.search, inbox: false}, (error, all) => {
        res.render('searchupsend.ejs' , {
            content : req.body,
            complete : all,
            id : req.body.id
        })
    })
})

//commits send for clicky in search
app.post('/searchupcommit',(req, res) => {
    User.findOne({username: req.body.to}, (error, foundUser)=>{
        console.log(req.body)
        if(foundUser.username === undefined){
            res.send('no such person')
        }else if(req.body.to === 'public'){
            req.body.user = req.body.to
            req.body.tags = req.body.tags.split(",")
            req.body.tags = req.body.tags.map(s => s.trim())
            Clicky.create(req.body, (err, newClick) =>{
                req.body.user = req.session.currentUser
                if(req.body.tags.length === 0){
                    req.body.tags = 'public'
                }else{
                req.body.tags += ',public'
                req.body.tags = req.body.tags.split(",")
                req.body.tags = req.body.tags.map(s => s.trim())
                }
                console.log(req.body)
                Clicky.findByIdAndUpdate(req.body.id, {tags: req.body.tags} , (err, anotherClick)=> {
                    Clicky.find({tags: req.body.search, user: req.session.currentUser, inbox: false } ,(err, all) => {
                        res.render('search.ejs' , {
                            complete : all,
                            tag: req.body.search
                        })
                    })
                })
            })   
        }else{
             req.body.user = req.body.to
             req.body.inbox = true
             if(req.body.tags.length === 0){
                 req.body.tags =`from:${req.session.currentUser}`
             }else{
                req.body.tags += `,from:${req.session.currentUser}`
                req.body.tags = req.body.tags.split(",")
                req.body.tags = req.body.tags.map(s => s.trim())
             }
             Clicky.create(req.body, (err, newClick) =>{
                if(req.body.tags === `from:${req.session.currentUser}`){
                    req.body.tags = `to:${req.body.to}`
                }else{
                    console.log(req.body.tags.length)
                    console.log(req.body.tags)
                    req.body.tags.splice(req.body.tags.length - 1, 1 , `to:${req.body.to}`)
                }
                Clicky.findByIdAndUpdate(req.body.id, {tags: req.body.tags, text: req.body.text, color: req.body.color} , (err, anotherClick) =>{
                    Clicky.find({tags: req.body.search, user: req.session.currentUser, inbox: false } ,(err, all) => {
                        res.render('search.ejs' , {
                            complete : all,
                            tag: req.body.search
                        })
                    })
                })
             })  
            }
        })
})

//commits send for trigger in search
app.post('/searchcommity',(req, res) => {
    console.log(req.body.tags.length)
    User.findOne({username: req.body.to}, (error, foundUser)=>{
        if(foundUser.username === undefined){
            res.send('no such person')
        }else if(req.body.to === 'public'){
            req.body.user = req.body.to
            req.body.tags = req.body.tags.split(",")
            req.body.tags = req.body.tags.map(s => s.trim())
            Clicky.create(req.body, (err, newClick) =>{
                req.body.user = req.session.currentUser
                if(req.body.tags.length === 0){
                    req.body.tags = 'public'
                }else{
                    req.body.tags += ',public'
                    req.body.tags = req.body.tags.split(",")
                    req.body.tags = req.body.tags.map(s => s.trim())
                }
                Clicky.create(req.body, (err, anotherClick)=> {
                    Clicky.find({tags: req.body.search, user: req.session.currentUser, inbox: false } ,(err, all) => {
                        console.log(req.body.search)
                        res.render('search.ejs' , {
                            complete : all,
                            tag: req.body.search
                        })
                    })
                })
            })   
        }else{
             req.body.user = req.body.to
             req.body.inbox = true
             if(req.body.tags.length === 0){
                 req.body.tags = `from:${req.session.currentUser}`
             }else{
                req.body.tags += `,from:${req.session.currentUser}`
                req.body.tags = req.body.tags.split(",")
                req.body.tags = req.body.tags.map(s => s.trim())
             }
             Clicky.create(req.body, (err, newClick) =>{
                req.body.user = req.session.currentUser
                req.body.inbox = false
                if(req.body.tags === `from:${req.session.currentUser}`){
                    req.body.tags = `to:${req.body.to}`
                }else{
                    req.body.tags.splice(req.body.tags.length - 1, 1 , `to:${req.body.to}`)
                }
                Clicky.create(req.body, (err, anotherClick) =>{
                    Clicky.find({tags: req.body.search, user: req.session.currentUser, inbox: false } ,(err, all) => {
                        console.log(req.body.search)
                        res.render('search.ejs' , {
                            complete : all,
                            tag: req.body.search
                        })
                    })
                })
             })  
            }
        })
})
