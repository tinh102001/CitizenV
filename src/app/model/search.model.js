const Index = require('./index.model');

class Search extends Index {


    /**
     * Hàm tìm thông tin nhân khẩu dựa theo dữ liệu truyền vào
     * @param {varchar} cmnd 
     * @param {varchar} hoten 
     * @param {varchar} diaphuong 
     * @returns 
     */
     search(cmnd, hoten, diaphuong) {
        var que = 'select cmnd, ho_va_ten, DATE_FORMAT(ngay_sinh, "%d/%m/%Y"), gioi_tinh, quoc_tich, dia_chi_thuong_tru, dia_chi_tam_tru, ton_giao, trinh_do_van_hoa, nghe_nghiep from nhan_khau where ';
        if (cmnd != "") que += "cmnd = " + cmnd
        else {
            if (diaphuong == "A01" && hoten != "") {
                
                que += "ho_va_ten like '%" + hoten + "%'"; // Thuộc cục dân số thì trả về tất cả các thành viên ở toàn nước
            } else
            if (diaphuong != "") {
                que += "id like '" + diaphuong + "%'"
                if (hoten != "") que += "and ho_va_ten like '%" + hoten + "%'"
            }
            else if (hoten != "") que += "ho_va_ten like '%" + hoten + "%'"; 
        }
        return new Promise((resolve, reject) => {  
            this.connection.query(que, (err, rows) => { 
                if (err)
                    return reject(err);
                resolve(JSON.stringify(rows)); 
            });
        });
    }
}

module.exports = new Search;