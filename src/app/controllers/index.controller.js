var moment = require('moment');
var list_model = require('../model/list.model');

class Index {

    /**
     * Ngày có dạng dd/mm/yyyy
     * @param {} array 
     * @returns 
     */
    dateFormat(array){
        for (var i = 0; i <array.length ; i++) {
            if (array[i] != "" && !moment(array[i], "DD/MM/YYYY", true).isValid()) {
                return false;
            }
        }
        return true;
    }  

    /**
     * Kiểm tra mọi kí tự có là các chữ số không
     * @param {*} array 
     * @returns 
     */
    numberFormat(array) {
        for (var i = 0; i <array.length; i++) {
            if (isNaN(array[i])) {
                return false;
            }
        }
        return true;
    }

    trim(s){
        return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
    }
    
    /**
     * Chuyển về dạng Date phù hợp với SQL
     * @param {} day 
     * @returns 
     */
    convertToDateSQL(day) {
        return day = moment(day, "DD/MM/YYYY", true).format('YYYY/MM/DD');
    }

    /**
     * Kiểm tra xem id có thuộc quản lý của user không
     * @param {*} user 
     * @param {*} id 
     * @returns 
     */
    premissionLimit(user, id) {
        return new Promise((resolve, reject) => {
            if(![2,3,4,6,8,10].includes(id.length)) reject('ID không hợp lệ');
            list_model.searchName(id).then(data => {
                if (data == "") {
                    reject('ID không tồn tại');
                } else {
                    if (id.startsWith(user) || user[0] == 'A') { // User là A01 (cục) hoặc id có định dạng có ký tự ban đầu giống với user thì hợp lệ 
                        resolve(id) 
                    } else {
                        reject('ID trái tuyến');
                    }
                }
            })
        });
    }
    
}

module.exports = new Index;