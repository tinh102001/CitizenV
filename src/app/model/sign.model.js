const Index = require('./index.model');

class Sign extends Index {

    /**
     * Lấy mật khẩu của tài khoản được truyền vào
     * 
     * @param {varchar} id 
     * @returns 
     */
    findPass(id) {
        var tuyen = this.currentNode(id);
        return new Promise((resolve, reject) => {  
            if (tuyen == "") reject('ID không đúng')
            this.connection.query("SELECT mat_khau FROM " + tuyen + " WHERE id = '" + id + "'", (err, rows) => { //truyền truy vấn dữ liệu vào
                if (err) return reject(err);
                if (!rows.length) return resolve('Tài khoản chưa được cấp'); // dữ liệu trả về trống thì tài khoản chưa được cấp mật khẩu
                else return resolve(rows);
            });
        });
    }

    /**
     * Cập nhật mật khẩu được mã hóa cho tài khoản id, trả về thông báo
     * @param {varchar} id 
     * @param {varchar} pass 
     * @returns 
     */
    createPass(id, pass) {
        var tuyen = this.currentNode(id);
        return new Promise((resolve, reject) => {
            if (tuyen == "") return reject('ID không đúng')
            this.connection.query("UPDATE " + tuyen + " SET `mat_khau` = '" + pass + "' WHERE id = '" + id + "'", (err, rows) => {
                if (err)
                    return reject(err);
                resolve("Cấp mật khẩu thành công");
            });
        });
    }

    /**
     * Đặt mật khẩu về Không của id chỉ định và trả về thông báo
     * @param {varchar} id 
     * @returns 
     */
    deletePass(id) {
        var tuyen = this.currentNode(id);
        return new Promise((resolve, reject) => { 
            if (tuyen == "") return reject('ID không đúng')
            this.connection.query("UPDATE " + tuyen + " SET `mat_khau` = 'Không' WHERE id = '" + id + "'", (err, rows) => {
                if (err) 
                    return reject(err);
                resolve("Xóa mật khẩu thành công");
            });
        });
    }
}

module.exports = new Sign;