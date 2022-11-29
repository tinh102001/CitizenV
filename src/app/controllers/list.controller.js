var list_model = require('../model/list.model'); 
const index_controller = require('./index.controller');

class List {
    index(req, res) {
        res.render('list', { layout: 'main' }); 
    }

    /**
     * Lấy tham số id, tên mới, diện tích mới muốn chỉnh sửa rồi gửi cho model
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    edit(req, res) {
        var id = index_controller.trim(req.query.id);
        var ten = index_controller.trim(req.query.name);
        var dientich = req.query.dientich;
        if (!index_controller.numberFormat([dientich]))// Kiểm tra định dạng của diện tích được nhập vào
            return res.status(400).json({ status: 'Diện tích không hợp lệ' })

        index_controller.premissionLimit(req.user, id)
            .then(id => list_model.edit(id, ten, dientich))
            .then(s => res.json({ status: s }))
            .catch(err => res.status(403).json({ status: err }))

    }

    /**
     * Kiểm tra quyền trước khi thực hiện với tuyến dưới
     * @param {*} req 
     * @param {*} res 
     */
    delete(req, res) {
        var id = index_controller.trim(req.query.id);

        index_controller.premissionLimit(req.user, id)
            .then(id => list_model.delete(id))
            .then(s => res.json({ status: s }))
            .catch(err => res.status(403).json({ status: err }))
    }

    /**
     * Controller tạo địa phương mới, lấy thông tin từ req làm tham số cho model để thực hiện truy vấn
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    createNew(req, res) {
        var name = index_controller.trim(req.query.name);
        var dientich = req.query.dientich;
        if (!index_controller.numberFormat([dientich])) 
            return res.status(400).json({ status: 'Diện tích không hợp lệ' })

        list_model.createNew(req.user, name, dientich)
            .then(s => res.json({ status: s }))
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    statistic(req, res) {
        var arr_id = req.query.arr_id;
        var type = req.query.type;
        list_model.statistic(arr_id, type).then(function (s) {
            if (s == "") res.status(403).json({ status: '' })
            else res.send(s);
        })

    }

    /**
     * Lấy thông tin tuyến dưới
     * @param {*} req 
     * @param {*} res 
     */
    preNode(req, res) {
        var id = index_controller.trim(req.query.id); 

        list_model.preNode(id)
            .then(s => {
                if (s == "") res.status(403).json({ status: 'mã không hợp lệ' })
                else res.send(s); 
            })
    }


    /**
     * Gửi id để tìm tên tương ứng
     * @param {*} req 
     * @param {*} res 
     */
    searchName(req, res) {
        var id = index_controller.trim(req.query.id);
        list_model.searchName(id)
            .then(s => { 
                if (s == "") res.status(403).json({ status: 'mã không hợp lệ' })
                else res.send(s); 
            }).catch(err => res.status(404).json({ status: err }))
    }
    /**
     * Gửi tham số Mã hộ cho model để lấy thông tin các nhân khẩu của hộ đó 
     * @param {*} req 
     * @param {*} res 
     */
    listMember(req, res) {
        var id = req.query.id;
        list_model.memberInfo(id).then(function (s) {
            if (s == "") res.status(403).json({ status: "Id không đúng" });
            else res.send(s); 
        });
    }

}

module.exports = new List();