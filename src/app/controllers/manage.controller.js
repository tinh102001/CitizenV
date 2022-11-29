const manage_model = require('../model/manage.model');
const index_controller = require('./index.controller');

const m_dangnhap = require('../model/sign.model');
const bcrypt = require('bcrypt');

const { convertToDateSQL } = require('./index.controller');

class Manage {
    index(req, res) {
        res.render('manage', { layout: 'main' });
    }

    // Chưa các phương thức quản lý của tuyến trên với tuyến dưới
    // Trình tự để thực hiện tác động với tuyến dưới: 
    // Kiểm tra user có là tuyến trên của id không -> User có đang được cấp quyền khai báo không -> Thực hiện
    
    
    
    /**
     * Lấy thông tin tuyến dưới, khác với trang danh sách, ở đây ta lấy về thông tin quyền, mật khẩu,...
     * @param {*} req 
     * @param {*} res 
     */
    preNode(req, res) {
        var id = index_controller.trim(req.query.id);
        manage_model.preNode(id)
            .then(result => res.send(result))
    }

    /**
     * Cấp mật khẩu cho tuyến dưới
     * Nếu mật khẩu cấp là rỗng đồng nghĩa với việc xóa mật khẩu = Chưa được cấp
     * @param {*} req 
     * @param {*} res 
     */
    changePass(req, res) {
        var id = index_controller.trim(req.body.id);
        var password = req.body.password;

        index_controller.premissionLimit(req.user, id).then(id => {
            if (password == "") {
                m_dangnhap.deletePass(id)
                    .then(result => res.json({ status: result }))
            } else {
                // Mã hóa mật khẩu
                bcrypt.hash(password, 10, function (err, hashedPass) {
                    if (err) res.status(500).json({ status: 'Mã hóa thất bại' });
                    m_dangnhap.createPass(id, hashedPass)
                        .then(result => res.json({ status: result }))
                })
            }
        }).catch(err => {
            res.status(403).json({ status: err })
        })
    }

    /**
     * Cấp quyền cho địa phương có id truyền vào
     * @param {*} req - chứa id, thời gian bắt đầu, kết thúc 
     * @param {*} res 
     * @returns 
     */

    providePre(req, res) {
        var id = index_controller.trim(req.query.id);
        var start = req.query.start;
        var end = req.query.end;

        if (!index_controller.dateFormat([start, end]))
            return res.status(400).json({ status: 'Ngày không hợp lệ' })

        if (start != "") start = convertToDateSQL(start);
        if (end != "") end = convertToDateSQL(end);


        index_controller.premissionLimit(req.user, id)
            .then(id => manage_model.havePre(req.user, id))
            .then(id => manage_model.providePre(id, start, end))
            .then(result => res.json({ status: result }))
            .catch(err => res.status(403).json({ status: err }))
    }

    /**
     * Xóa quyền
     * @param {*} req 
     * @param {*} res 
     */
    dropPre(req, res) {
        var id = index_controller.trim(req.query.id);
        index_controller.premissionLimit(req.user, id)
            .then(id => manage_model.havePre(req.user, id))
            .then(id => manage_model.dropPre(id))
            .then(result => res.json({ status: result }))
            .catch(err => res.status(403).json({ status: err }))
    }

    /**
     * Cập nhật tiến độ cho tuyến trên
     * @param {*} req 
     * @param {*} res 
     */
    updateProgress(req, res) {
        var progress = req.query.progress;
        manage_model.updateProgress(req.user, progress)
            .then(id => manage_model.havePre(req.user, id))
            .then(result => res.json({ status: result }))
            .catch(err => res.status(500).json({ status: err }))
    }
    

    /**
     * Lấy thông tin cần thiết của id
     * @param {*} req 
     * @param {*} res 
     */
    getNamePrePro(req, res) {
        var id = index_controller.trim(req.query.id);
        index_controller.premissionLimit(req.user, id)
            .then(id => 
                
                manage_model.getNamePrePro(id))
            .then(s => res.send(s))
            .catch(err => res.status(403).json({ status: err }))
    }
}

module.exports = new Manage;