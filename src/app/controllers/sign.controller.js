const sign_model = require('../model/sign.model');
const key = 'citizenV'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const index_controller = require('./index.controller');

class Sign {

    index(req, res) {
        res.render('sign', { layout: 'login_layout' });
    }

    /**
     * Tiến hành lấy thông tin từ fetch (id, password)
     * @param {*} req 
     * @param {*} res 
     */
    login(req, res) {
        var id = index_controller.trim(req.body.id);
        var password = req.body.password;
        var role = 'A1';
        sign_model.findPass(id).then(data => {
            // Xem mật khẩu của id, không có thì nghĩa là tài khoản chưa được cấp mật khẩu
            if (data == '') return res.status(404).json({ status: 'Không tồn tại tài khoản' })  
            // Nếu có, mã hóa mật khẩu điền vào với mật khẩu trong CSDL
            bcrypt.compare(password, (data[0].mat_khau).toString())
                .then(result => {
                    if (!result) return res.status(400).json({ status: 'Mật khẩu sai' })
                    //Mật khẩu đúng, kiểm tra định dạng id đăng nhập và gắn quyền vào tài khoản
                    if (id.length == 2) role = 'A2'
                    else if (id.length == 4) role = 'A3'
                    else if (id.length == 6) role = 'B1'
                    else if (id.length == 8) role = 'B2'
                    // Mỗi token được cấp sau khi truy cập có hiệu lực 1 tiếng, sau đó token sẽ hết hạn 
                    var token = jwt.sign({ id: id, role: role }, key, { expiresIn: 60*60 }) 
                    res.json({
                        status: 'succes',
                        id: id,
                        token: token
                    })
                })
        }).catch(err => {
            res.status(404).json({ status: err }) // Bắt lỗi
        })
    }
}

module.exports = new Sign;