const Index = require('./index.model');

class Manage extends Index {

    /**
     * Hàm gửi câu truy vấn để lấy dữ liệu quản lý về mật khẩu, quyền khai báo của địa phương tuyến dưới 
     * @param {varchar} id 
     * @returns 
     */
    preNode(id) {
        var tuyen = this.preNodeIndex(id);
        var que = ""
        if (tuyen == "tinh") que = "select id,ten,mat_khau,quyen_khai_bao,tien_do, SUBSTRING(thoi_gian_ket_thuc,1,10) as thoi_gian_ket_thuc from " + tuyen + " where 1";
        else que = "select id,ten,mat_khau,quyen_khai_bao,tien_do,SUBSTRING(thoi_gian_ket_thuc,1,10) as thoi_gian_ket_thuc from " + tuyen + " where id_cap_tren =" + id;

        return new Promise((resolve, reject) => { //trả về promise 
            if (tuyen == "") reject('Sai định dạng ID')
            this.connection.query(que, (err, rows) => {
                //truyền truy vấn dữ liệu vào
                if (err) return reject(err);
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].quyen_khai_bao == 'Có') {
                        var words = rows[i].thoi_gian_ket_thuc.split('-');
                        rows[i].thoi_gian_ket_thuc = words[2] + '-' + words[1] + '-' + words[0];
                    } else rows[i].thoi_gian_ket_thuc = 'Chưa đặt'

                    if (!rows[i].mat_khau) rows[i].mat_khau = "Chưa cấp";
                    else if (rows[i].mat_khau[0] == "$") rows[i].mat_khau = "Đã cấp";
                    else rows[i].mat_khau = "Chưa cấp";
                }
                resolve(JSON.stringify(rows));
            });
        });
    }


    /**
     * Thực hiện các thao tác quản lý đối với tuyến dưới đều phải kiểm tra bản thân có quyền hay không
     * @param {varchar} user -  Id đang được đăng nhập
     * @param {varchar} id - Id là đối tượng bị tác động
     * @returns 
     */
    havePre(user, id) {
        var tuyen = this.currentNode(user);
        var que = "select quyen_khai_bao from " + tuyen + " where id= '" + user + "'";
        return new Promise((resolve, reject) => {
            // Nếu ID có độ dài là 3 (Là cấp cục) thì mặc định là có quyền
            if (user.length == 3) return resolve(id);
            this.connection.query(que, (err, rows) => {
                if (err) return reject("Lỗi tìm quyền");
                if (rows[0].quyen_khai_bao == "Không") return reject("Bạn không có quyền chỉnh sửa");
                return resolve(id);
            });
        });
    }


    /**
     * Cấp quyền quản lý cho tuyến dưới trong khoảng thời gian cho trước
     * @param {varchar} id - Id là đối tượng bị tác động
     * @param {date} start - Thời gian bắt đầu quyền có hiệu lực
     * @param {date} end - Thời gian hết hạn quyền
     * @returns Trạng thái xử lý
     */
    providePre(id, start, end) {

        var tuyen = this.currentNode(id);
        var que = "";
        var time_start = "thoi_gian_bat_dau = now()";
        var time_end = "thoi_gian_ket_thuc = now() + INTERVAL 1 DAY";

        if (start != "") time_start = "thoi_gian_bat_dau = '" + start + "'";
        if (end != "") time_end = "thoi_gian_ket_thuc = '" + end + "'";

        que = "UPDATE " + tuyen + " SET " + time_start + "," + time_end + " WHERE id = '" + id + "'";

        return new Promise((resolve, reject) => {
            if (tuyen == "") return reject('ID sai')
            this.connection.query(que, (err, _) => {
                if (err) return reject(err);
                resolve('Đổi quyền thành công');
            });
        });
    }

    /**
     * Xóa quyền của cấp dưới được chỉ định
     * @param {varchar} id - Id là đối tượng bị tác động
     * @returns 
     */
    dropPre(id) {
        var tuyen = this.currentNode(id);
        var que = "update " + tuyen + " SET thoi_gian_ket_thuc = now() - interval 1 day where id = '" + id + "'";
        return new Promise((resolve, reject) => {
            if (tuyen == "") return reject('ID sai')
            this.connection.query(que, (err, _) => { //truyền truy vấn dữ liệu vào
                if (err) return reject(err);
                resolve('Xóa quyền thành công');
            });
        });
    }

    /**
     * Cập nhật tiến độ với tuyến trên
     * @param {varchar} id - Id hiện đang đăng nhập 
     * @param {boolean} tiendo - Xong hoặc chưa
     * @returns 
     */
     updateProgress(id, tiendo) {
        var tuyen = this.currentNode(id);
        var que = "";
        return new Promise((resolve, reject) => {
            if (id.length == 3) reject('A1 không có tiến độ');
            if (tiendo == '0') que = "UPDATE " + tuyen + " SET `tien_do` = 'Chưa xong' WHERE `Id` = '" + id + "'";
            else if (tiendo == '1') que = "UPDATE " + tuyen + " SET `tien_do` = 'Đã xong' WHERE `Id` = '" + id + "'";
            else reject('Tiến độ không hợp lệ');
            this.connection.query(que, (err, _) => {
                if (err) return reject(err);
                resolve('Đổi tiến độ thành công');
            });
        });
    }



    /**
     * Hàm trả về thông tin bao gồm Tên, Quyền, Tiến độ của khu vực có id được truyền vào
     * @param {varchar} id 
     * @returns 
     */
     getNamePrePro(id) {
        var tuyen = this.currentNode(id);
        var que = "";
        return new Promise((resolve, reject) => {
            if (tuyen == "") return reject('ID sai');
            if (id.length == 3) que = "select ten,quyen_khai_bao from " + tuyen + " where id= '" + id + "'";
            else que = "select ten,quyen_khai_bao,tien_do from " + tuyen + " where id= '" + id + "'";
            this.connection.query(que, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(JSON.stringify(rows[0]));
            });
        });
    }
}

module.exports = new Manage;