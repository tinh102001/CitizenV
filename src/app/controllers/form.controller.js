const form_model = require('../model/form.model');
const index_controller = require('./index.controller');

class Form {
    index(req, res) {
        res.render('form', { layout: 'main' });
    }

    
    preNode(req, res) {
        var id = index_controller.trim(req.query.id);
        form_model.preNode(id).then(function (s) {
            if (s == "") res.status(403).json({ status: 'Mã không hợp lệ' })
            else res.send(s);
        })
    }
    listMember(req, res) {
        var id = req.query.id;
        form_model.memberInfo(id).then(function (s) {
            if (s == "") res.status(403).json({ status: "Mã không hợp lệ" });
            else res.send(s);
        });
    }

    form(req, res) {
        var id_family = req.body.id_family
        var list_send = req.body.list_send
        form_model.cleanOldMember(id_family).then((_) => form_model.form(list_send).then(result => res.json({ status: result }))
            .catch(err => res.status(403).json({ status: err })));

    }
    newFamily(req, res) {
        var info = req.body.new_family;
        var userid = req.body.userid
        form_model.newFamily(userid,info)
            .then(s => res.json({ status: s }))
    }
}

module.exports = new Form;