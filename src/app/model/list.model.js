const Index = require('./index.model');

class List extends Index {

    /**
     * Lấy Mã và tên của tuyến dưới
     * @param {varchar} id 
     * @returns 
     */
    preNode(id) {
        var tuyen = this.preNodeIndex(id);
        var que = ""
        if (tuyen == "tinh") que = "select id,ten from " + tuyen + " where 1";
        else que = "select id,ten from " + tuyen + " where id_cap_tren =" + id;

        return new Promise((resolve, reject) => { 
            if (tuyen == "") return resolve('ID không đúng')
            this.connection.query(que, (err, rows) => { 
                if (err) 
                    return reject(err);
                resolve(JSON.stringify(rows)); 
            });
        });
    }


    /**
     * Lấy thuộc tính Tên của id hiện tại
     * @param {varchar} id 
     * @returns 
     */
    searchName(id) {
        var tuyen = this.currentNode(id);
        return new Promise((resolve, reject) => { 
            if (tuyen == "") { return resolve('ID sai') }
            this.connection.query("select ten from " + tuyen + " where id= '" + id + "'", (err, rows) => {
                if (err) return reject(err);
                if (!rows.length) resolve('Lỗi');
                resolve(JSON.stringify(rows[0]));
            });
        });
    }

    /**
     * Thêm mới 1 địa phương thuộc tuyến có id là userId trong phạm vi trên hộ khẩu
     * @param {varchar} userid - Tuyến đang thực hiện tác vụ  
     * @param {varchar} ten - Tên địa phương mới 
     * @param {double} dientich - Diện tích của địa phương mới
     * @returns 
     */
    createNew(userid, ten, dientich) {
        var do_dai_id = 0;
        var tuyen = this.preNodeIndex(userid);
        if (tuyen == "tinh") {
            do_dai_id = 2;
        } else if (tuyen == "huyen") {
            do_dai_id = 4;
        } else if (tuyen == "xa") {
            do_dai_id = 6;
        } else if (tuyen == "thon") {
            do_dai_id = 8;
        } 
        return new Promise((resolve, reject) => {
            if (ten == "") return resolve("Thiếu thông tin về Tên");
            if (dientich == "") return resolve("Thiếu thông tin về Diện tích");
            let que = "insert into " + tuyen +
                " SELECT LPAD(max(id) + 1," + do_dai_id + ",'0'),'" + userid + "','" + ten + "','','Không','2020-01-01',2021-01-01,'Chưa xong'," + dientich +
                " FROM " + tuyen + " WHERE id_cap_tren = '" + userid + "'";
            this.connection.query(que, (err, _) => {
                if (tuyen == "") return reject('ID sai')
                if (err) return reject(err);
                resolve("Thêm địa phương thành công");
            })
        })
    }

    /**
     * Xóa địa phương có id = id
     * @param {varchar} id 
     * @returns 
     */
    delete(id) {
        var tuyen = this.currentNode(id);

        return new Promise((resolve, reject) => {
            let que = "DELETE FROM " + tuyen + " WHERE id = '" + id + "'";
            this.connection.query(que, (err, _) => {
                if (tuyen == "") return reject('ID không đúng')
                if (err) return reject(err);
                resolve("Xóa địa phương thành công");
            })

        })
    }

    /**
     * Truyền vào thông tin ID, Tên mới, Diện tích mới để cập nhật thay đổi cho đối tượng có ID truyền vào
     * trả về thông báo
     * @param {varchar} id 
     * @param {varchar} ten 
     * @param {double} dientich 
     * @returns 
     */
    edit(id, ten, dientich) {
        var tuyen = this.currentNode(id);
        let que = "";
        if (ten == "" && dientich == "") return "Thiếu thông tin !"
        else if (ten != "" && dientich != "") que = "UPDATE " + tuyen + " SET Ten = '" + ten + "', dien_tich = '" + dientich + "' WHERE id = '" + id + "'";
        else if (ten != "") que = "UPDATE " + tuyen + " SET Ten = '" + ten + "' WHERE id = '" + id + "'";
        else que = "UPDATE " + tuyen + " SET dien_tich = '" + dientich + "' WHERE id = '" + id + "'";
        return new Promise((resolve, reject) => {
            if (tuyen == "") return reject('ID không đúng')
            this.connection.query(que, (err, rows) => {
                if (err) return reject(err);
                resolve("Chỉnh sửa thành công");
            })

        })
    }

    /**
     * Lấy thông tin của nhân khẩu có id được truyền vào
     * @param {*} id 
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
       * Trả về dữ liệu tùy theo type được truyền vào
       * @param {*} arr_id - Mảng các id được chọn truyền vào để lấy thông tin phục vụ thống kê 
       * @param {*} type - Nội dung thống kê (Mật độ dân số, Tháp tuổi)
       * @returns 
       */
    statistic(arr_id, type) {

        var cac_dia_phuong_id = arr_id.split(',');
        var tuyen = this.currentNode(cac_dia_phuong_id[0]);
        var join_huyen = " LEFT JOIN huyen on huyen.id_cap_tren = tinh.Id ";
        var join_phuong = " LEFT JOIN xa on xa.id_cap_tren = huyen.Id ";
        var join_thon = " LEFT JOIN thon ON thon.id_cap_tren = xa.Id ";
        var join_ho = " LEFT JOIN ho_khau ON ho_khau.id_cap_tren = thon.Id ";
        var where = "";
        for (var i = 0; i < cac_dia_phuong_id.length; i++) {
            if (i > 0) {
                where += " OR ";
            }
            where += (" " + tuyen + ".Id = '" + cac_dia_phuong_id[i] + "'");
        }
        if (type == 'thap_tuoi') {
            var que = "SELECT  DATEDIFF(now() , (nhan_khau.ngay_sinh))/365 as Tuoi, nhan_khau.gioi_tinh FROM " + tuyen
                + (tuyen == "tinh" ? join_huyen : "")
                + (tuyen == "huyen" || tuyen == "tinh" ? join_phuong : "")
                + (tuyen == "xa" || tuyen == "huyen" || tuyen == "tinh" ? join_thon : "")
                + (tuyen == "thon" || tuyen == "xa" || tuyen == "huyen" || tuyen == "tinh" ? join_ho : "")
                + " LEFT JOIN nhan_khau ON nhan_khau.id_cap_tren = ho_khau.Id "
                + "WHERE " + where + " AND nhan_khau.gioi_tinh is not null  ORDER BY nhan_khau.gioi_tinh, Tuoi";
           
            return new Promise((resolve, reject) => {
                this.connection.query(que, (err, rows) => {
                    if (err)
                        return reject(err);
                    resolve(JSON.stringify(rows));
                })
            })
        }
        if (type == 'mat_do') {
            var que = "SELECT " + tuyen + ".Ten, COUNT(nhan_khau.id) /" + tuyen + ".dien_tich   as Matdo FROM " + tuyen
                + (tuyen == "tinh" ? join_huyen : "")
                + (tuyen == "huyen" || tuyen == "tinh" ? join_phuong : "")
                + (tuyen == "xa" || tuyen == "huyen" || tuyen == "tinh" ? join_thon : "")
                + (tuyen == "thon" || tuyen == "xa" || tuyen == "huyen" || tuyen == "tinh" ? join_ho : "")
                + " LEFT JOIN nhan_khau ON nhan_khau.id_cap_tren = ho_khau.Id "
                + "WHERE " + where + " AND nhan_khau.gioi_tinh is not null GROUP BY " + tuyen + ".Id; ";
           
            return new Promise((resolve, reject) => {
                this.connection.query(que, (err, rows) => {
                    if (err)
                        return reject(err);
                    resolve(JSON.stringify(rows));
                })
            })
        }
    }

}

module.exports = new List;