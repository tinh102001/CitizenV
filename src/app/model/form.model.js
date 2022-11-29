const Index = require('./index.model');

class Form extends Index {

    /**
     * Trang nhập liệu muốn hiện ra thông tin cấp dưới của B1 hoặc B2 về Mã, Tên.
     * @param {*} id 
     * @returns 
     */
    preNode(id) {
        var tuyen = this.preNodeIndex(id);
        var que = "select id,ten from " + tuyen + " where id_cap_tren =" + id;
        if (tuyen == "ho_khau") que = "select id, ten from " + tuyen + " where id_cap_tren =" + id;
        return new Promise((resolve, reject) => {
            if (tuyen == "") reject('ID không đúng')
            this.connection.query(que, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(JSON.stringify(rows));
            });
        });
    }


    /**
     * Xóa dữ liệu của hộ được chỉ định để phục vụ việc cập nhật lại thành viên của hộ theo trang nhập liệu
     * @param {*} id_ho - Mã hộ bị xóa dữ liệu 
     * @returns 
     */
    cleanOldMember(id_ho) {
        var last_que = 'DELETE from nhan_khau WHERE nhan_khau.id_cap_tren =' + id_ho;
        return new Promise((resolve, reject) => {
            this.connection.query(last_que, (err, _) => {
                if (err)
                    return reject(err);
                resolve('xoa bang thanh cong');
            });
        });
    }

    /**
     * Chuyển dữ liệu nhập thành câu truy vấn thêm thông tin nhân khẩu vào csdl
     * @param {String} list_send - Thông tin 1 hay nhiều nhân khẩu được nhập vào có dạng : "1,Thành,2,Tĩnh,3,Đức" 
     * @returns 
     */
    form(list_send) {
        var last_que = "";
        for (var i = 0; i < list_send.length; i++) {
            var name = list_send[i][1];
            var id_ho = list_send[i][0];
            var id_nguoi = id_ho + "0" + (i + 1);
            var cmnd = list_send[i][2];
            var ngay_sinh = list_send[i][5];
            var quoc_tich = list_send[i][6];
            var ton_giao = list_send[i][7];
            var hoc_van = list_send[i][8];
            var thuong_tru = list_send[i][9];
            var tam_tru = list_send[i][10];
            var nghe_nghiep = list_send[i][3];
            var gioi_tinh = list_send[i][4]
            last_que += ('insert into nhan_khau values ("' + id_nguoi + '","' + id_ho + '","' + name + '","' + ngay_sinh + '","' + gioi_tinh + '","' + ton_giao + '","'
                + quoc_tich + '","' + nghe_nghiep + '",' + cmnd + ',"' + thuong_tru + '","' + tam_tru + '","' + hoc_van + '");');
        }
   
        return new Promise((resolve, reject) => {
            this.connection.query(last_que, (err, rows) => {
                if (err)
                    return reject(err);
                resolve('Cập nhật nhân khẩu của hộ thành công');
            });
        });

    }

    /**
     * Lấy tất cả thông tin của nhân khẩu được chỉ định 
     * @param {varchar} id - id của nhân khẩu
     * @returns 
     */
    memberInfo(id) {
        return new Promise((resolve, reject) => {
          this.connection.query(
            "select ho_va_ten, DATE_FORMAT(ngay_sinh, '%d/%m/%Y') as ngay_sinh, gioi_tinh, ton_giao, quoc_tich, nghe_nghiep, cmnd, dia_chi_thuong_tru, dia_chi_tam_tru, trinh_do_van_hoa from nhan_khau where id_cap_tren= '" +
              id +
              "'",
            (err, rows) => {
              if (err)
                return reject(err);
              resolve(JSON.stringify(rows));
            }
          );
        });
      }
      /**
       * Chèn vào bảng CSDL ho_khau giá trị mới
       * @param {varchar} userid - id cấp thôn thực hiện thêm hộ mới
       * @param {*} info - Tên hộ mới
       * @returns 
       */
      newFamily(userid, info) {
          return new Promise((resolve, reject) => {
            this.connection.query(
              "insert into ho_khau  SELECT LPAD(max(id) + 1,10,'0'),'" +userid +"','"+info+"'"+ " from ho_khau WHERE id_cap_tren = '" + userid + "'",
              (err, _) => {
                if (err)
                  return reject(err);
                resolve('Tạo hộ mới thành công'); 
              }
            );
          });
      }
}

module.exports = new Form;