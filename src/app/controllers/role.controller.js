const key = 'citizenV'
const jwt = require('jsonwebtoken')
const sign_model = require('../model/sign.model');

class Role {

    /**
     * Kiểm tra token có rỗng/ đã hết hạn chưa
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    checkTicket(req, res, next) {
        // các phương thức fetch đều gửi kèm theo token vào header và hàm này sẽ kiểm tra nó,
         
        var token = req.headers['authorization']
        if (token != "") {
            jwt.verify(token, key, function (err, user) {
                if (err) return res.status(400).json('Hết hạn đăng nhập!')
                sign_model.findPass(user.id).then(data => {
                    if (data == '') {
                        res.status(403).json({ status: 'ID của bạn không tồn tại' });
                    } else {
                        req.role = user.role
                        req.user = user.id
                        next() // qua phần kiểm duyệt
                    }
                })
            })
        } else {
            return res.status(401).json("Bạn không đủ thẩm quyền")
        }
    }

    // Kiểm tra có phải A1 A2 A3 B1
    isA123B1(req, res, next) {
        if (['A1', 'A2', 'A3', 'B1'].includes(req.role)) next()
        else return res.status(401).json("Bạn không phải là A1,A2,A3,B1")
    }

    // Kiểm tra có là B1 B2
    isB12(req, res, next) {
        if (['B1', 'B2'].includes(req.role)) next()
        else return res.status(401).json("Bạn không phải là B1,B2")
    }
}

module.exports = new Role;