const mysql = require('mysql');

class Index {
    /**
     * Khởi tạo kết nối
     */
    constructor() {
        this.connection = mysql.createPool({
            connectionLimit: 100,
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'citizenv', 
            multipleStatements: true,
            debug: false
        });
    }

    /**
     * Tìm tuyến của Id được truyền vào
     * @param {string} id 
     * @returns 
     */
    currentNode(id) {
        var tuyen = "";
        if (id.length == 2) { tuyen = "tinh"; }
        else if (id.length == 3) { tuyen = "cuc"; }
        else if (id.length == 4) { tuyen = "huyen"; }
        else if (id.length == 6) { tuyen = "xa"; }
        else if (id.length == 8) { tuyen = "thon"; }
        else if (id.length == 10) { tuyen = "ho_khau"; }
        return tuyen;
    }
    
    /**
     * Hàm lấy tên bảng của các đối tượng
     * @param {varchar} id - id cấp trên đối tượng cần tìm
     * @returns 
     */
    preNodeIndex(id) {
        var tuyen = "";
        if (id.length == 2) { tuyen = "huyen"; }
        else if (id.length == 3) { tuyen = "tinh"; }
        else if (id.length == 4) { tuyen = "xa"; }
        else if (id.length == 6) { tuyen = "thon"; }
        else if (id.length == 8) { tuyen = "ho_khau" }
        return tuyen;
    }
}

module.exports = Index;