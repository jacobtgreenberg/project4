const express = require('express')
const send = express.Router()
const Clicky = require('../models/clickmodel.js')
const User = require('../models/usersmodel.js')




send.post('/',(req, res) => {
    Clicky.find({user: req.session.currentUser, inbox: false}, (error, all) => {
        res.render('send.ejs' , {
            content : req.body,
            complete : all
        })
    })
})



send.post('/upsend/:id',(req, res) => {
    Clicky.find({user: req.session.currentUser, inbox: false}, (error, all) => {
        res.render('upsend.ejs' , {
            content : req.body,
            complete : all,
            id : req.params.id
        })
    })
})



send.post('/reply/:id',(req, res) => {
    Clicky.find({user: req.session.currentUser, inbox: true}, (error, all) => {
        let testArray = req.body.tags.split(",")
        let from = testArray.splice(testArray.length - 1, 1)
        req.body.tags = "re: " + testArray
        from = from.join().split(":")
        req.body.to = "to:" + from[from.length - 1] 
        res.render('reply.ejs' , {
            content : req.body,
            complete : all,
            id : req.params.id
        })
    })
})

send.post('/upreply/:id',(req, res) => {
    req.body.to = req.body.to.replace("to:","")
    User.findOne({username: req.body.to}, (error, foundUser)=>{
        if(foundUser.username === undefined){
            res.send('no such person')
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
                    res.redirect('/inbox')
                })
             })  
            }
        })
})

send.post('/commit',(req, res) => {
    console.log(req.body.tags)
    User.findOne({username: req.body.to}, (error, foundUser)=>{
        if(foundUser.username === undefined){
            res.send('no such person')
        }else if(req.body.to === 'public'){
            req.body.user = req.body.to
            if(req.body.tags){
                req.body.tags = req.body.tags.split(",")
                req.body.tags = req.body.tags.map(s => s.trim())
            }
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
                    res.redirect('/home')
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
                    res.redirect('/home')
                })
             })  
            }
        })
})

send.post('/upcommit/:id',(req, res) => {
    User.findOne({username: req.body.to}, (error, foundUser)=>{
        console.log(req.body)
        if(foundUser.username === undefined){
            res.send('no such person')
        }else if(req.body.to === 'public'){
            req.body.user = req.body.to
            if(req.body.tags){
                req.body.tags = req.body.tags.split(",")
                req.body.tags = req.body.tags.map(s => s.trim())
            }
            Clicky.create(req.body, (err, newClick) =>{
                req.body.user = req.session.currentUser
                if(req.body.tags.length === 0){
                    req.body.tags = 'public'
                }else{
                req.body.tags += ',public'
                req.body.tags = req.body.tags.split(",")
                req.body.tags = req.body.tags.map(s => s.trim())
                }
                Clicky.findByIdAndUpdate(req.params.id, {tags: req.body.tags} , (err, anotherClick)=> {
                    res.redirect('/home')
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
                Clicky.findByIdAndUpdate(req.params.id, {tags: req.body.tags, text: req.body.text, color: req.body.color} , (err, anotherClick) =>{
                    res.redirect('/home')
                })
             })  
            }
        })
})



module.exports = send