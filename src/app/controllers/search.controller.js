var search_model = require('../model/search.model');
const index_controller = require('./index.controller');

class Search {
    index(req, res) {
        res.render('search', { layout: 'main' });
    }

    /**
     * Tìm kiếm thông tin nhân khẩu dựa vào cmnd, họ và tên, địa phương
     * @param {*} req 
     * @param {*} res 
     */
    searching(req, res) {
        var cmnd = index_controller.trim(req.query.cmnd);
        var diaphuong = index_controller.trim(req.query.diaphuong);
        var hoten = index_controller.trim(req.query.hoten);

        index_controller.premissionLimit(req.user, diaphuong).then(id => { // Kiểm tra địa phương đang tìm có là tuyến dưới hay không
            search_model.search(cmnd, hoten, id).then(function (s) { // Kiểm tra thành công, nhận về id để truyền vào model tiến hành tìm kiếm
                if (s == "") res.status(400).json({ status: 'Thông tin điền sai' }) // bắt lỗi
                else res.send(s); 
            })
        }).catch(err => {
            res.status(403).json({ status: err })
        })
    }
}

module.exports = new Search;