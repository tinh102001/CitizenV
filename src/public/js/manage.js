var list_content = document.getElementById("list");
var root_id = localStorage.getItem("id"); // Lấy id tài khoản đang truy cập
var token = localStorage.getItem("token"); 

// Chỉ có người đăng nhập có vai trò B1 (cấp xã) sẽ hiện nút in phiếu
if (root_id.length != 6) document.getElementById("inphieu").style.display = "none";


/**
 * Lấy dữ liệu về tuyến dưới của cấp hiện tại (root_id) và thể hiện trên bảng quản lý
 */
list_content.innerHTML = "Đang tải...";
fetch("/manage/prenode/?id=" + root_id, {
  headers: {
    'authorization': token
  }
}).then((response) => response.json())
  .then((res) => {
    if (res.status) alert(res.status)
    list_content.innerHTML = "";

    for (var i = 0; i < res.length; i++) {

      // Tạo 1 hàng chứa dữ liệu của một đơn vị
      var row = document.createElement("tr");

      // Tạo các thành phần chứa dữ liệu 1 hàng
      var column2 = document.createElement("td");
      var column3 = document.createElement("td");
      var column4 = document.createElement("td");
      var column5 = document.createElement("td");
      var column6 = document.createElement("td");
      var column7 = document.createElement("td");


      var column4_child = document.createElement("span");
      var column5_child = document.createElement("span");
      var column6_child = document.createElement("span");

      column2.innerHTML = res[i].id;
      column3.innerHTML = res[i].ten;
      column7.innerHTML = res[i].thoi_gian_ket_thuc;


      // Thể hiện UI khác nhau giữa việc "được" và "không được" cấp về mật khẩu, quyền và tiến độ đã xong hay chưa 
      if (res[i].mat_khau[0] == 'C') {
        column4_child.setAttribute("id", "clearly-0")
        column4_child.innerHTML = res[i].mat_khau;
        column4.appendChild(column4_child);
      } else {
        column4_child.setAttribute("id", "clearly-1")
        column4_child.innerHTML = res[i].mat_khau;
        column4.appendChild(column4_child);
      }


      if (res[i].quyen_khai_bao[0] == "K") {
        column5_child.setAttribute("id", "clearly-0")
        column5_child.innerHTML = res[i].quyen_khai_bao;
        column5.appendChild(column5_child);
      } else {
        column5_child.setAttribute("id", "clearly-1")
        column5_child.innerHTML = res[i].quyen_khai_bao;
        column5.appendChild(column5_child);
      }


      if (res[i].tien_do[0] == "C") {
        column6_child.setAttribute("id", "clearly-0")
        column6_child.innerHTML = res[i].tien_do;
        column6.appendChild(column6_child);
      } else {
        column6_child.setAttribute("id", "clearly-1")
        column6_child.innerHTML = res[i].tien_do;
        column6.appendChild(column6_child);
      }


      row.appendChild(column2);
      row.appendChild(column3);
      row.appendChild(column4);
      row.appendChild(column5);
      row.appendChild(column6);
      row.appendChild(column7)

      list_content.appendChild(row);

    }

  });


/**
 * Lấy thông tin về Tên, Quyền khai báo, Tiến độ của tài khoản hiện tại và thể hiện trên header của trang
 */
fetch("/manage/getnameprepro/?id=" + root_id, {
  headers: {
    'authorization': token
  }
}).then((response) => response.json())
  .then((res) => {
    var name = document.getElementById("ten");
    name.innerHTML = res.ten;
    var quyen = document.getElementById("quyen");
    quyen.innerHTML = "Quyền: " + res.quyen_khai_bao;
    var tiendo = document.getElementById("tiendo");
    if (res.tien_do) {
      tiendo.innerHTML = "Tiến độ: " + res.tien_do;
    } else {
      tiendo.parentNode.removeChild(tiendo);
    }
    var doituong = document.getElementById("doituong");
    doituong.innerHTML = "Vai trò:"
    if (root_id.length == 3) {
      doituong.innerHTML = "Vai trò: A1";
    } else if (root_id.length == 2) {
      doituong.innerHTML = "Vai trò: A2";
    } else if (root_id.length == 4) {
      doituong.innerHTML = "Vai trò: A3";
    } else if (root_id.length == 6) {
      doituong.innerHTML = "Vai trò: B1";
    } else if (root_id.length == 8) {
      doituong.innerHTML = "Vai trò: B2";
    }
  });

/**
 * Cấp mật khẩu cho tuyến dưới
 * Hiện thanh thông báo kết quả thực hiện
 */
function providePass() {
  id = document.getElementById('thay_id').value;
  pass = document.getElementById('thay_pass').value;
  fetch("/manage/changepass/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token
    },
    body: JSON.stringify({
      "id": id,
      "password": pass,
    })
  }).then((response) => response.json())
    .then((res) => {
      alert(res.status);
      document.location.pathname = "/manage";
    })
}


/**
 * Xóa mật khẩu tuyến dưới
 * Hiện thanh thông báo kết quả thực hiện
 */
function dropPass() {
  id = document.getElementById('xoa_id').value;
  fetch("/manage/changepass/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token
    },
    body: JSON.stringify({
      "id": id,
      "password": "",
    })
  }).then((response) => response.json())
    .then((res) => {
      alert(res.status);
      document.location.pathname = "/manage";
    })
}


/**
 * Cấp quyền khai báo cho tuyến dưới
 * Hiện thanh thông báo kết quả thực hiện
 */
function thay_doi_quyen() {
  var id = document.getElementById('thay_doi_quyen_id').value;
  var start = document.getElementById('ngay_mo').value;
  var end = document.getElementById('ngay_dong').value;
  fetch("/manage/providepre/?id="  + id +
   "&start=" + start + "&end=" + end, {
    headers: {
      'authorization': token
    }
  }).then((response) => response.json())
    .then((res) => {
      alert(res.status);
      document.location.pathname = "/manage";
    })
}


/**
 * Xóa quyền khai báo tuyến dưới
 * Hiện thanh thông báo kết quả thực hiện
 */
function xoa_quyen() {
  var id = document.getElementById('xoa_quyen_id').value;
  fetch("/manage/droppre/?id=" + id, {
    headers: {
      'authorization': token
    }
  }).then((response) => response.json())
    .then((res) => {
      alert(res.status);
      document.location.pathname = "/manage";

    })
}

/**
 * Thông báo tiến độ hoàn thành cho tuyến trên
 */
function hoan_thanh() {
  fetch("/manage/updatepro/?progress=1", {
    headers: {
      'authorization': token
    }
  }).then((response) => response.json())
    .then((res) => {
      alert(res.status);
      document.location.pathname = "/manage";
    })
}

/**
 * Có thể thông báo lại về tiến độ với tuyến trên: Hoàn thành -> Chưa hoàn thành
 */
function chua_hoan_thanh() {
  fetch("/manage/updatepro/?progress=0", {
    headers: {
      'authorization': token
    }
  }).then((response) => response.json())
    .then((res) => {
      alert(res.status);
      document.location.pathname = "/manage";
    })
}

/**
 * In phiếu điền thông tin nhân khẩu
 */
function inphieu() {

  var style = "<style>"
  style += "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}"
  style += "td, th {border: 1px solid #dddddd;text-align: left;padding: 8px; height:24px;}"
  style += "tr:nth-child(even) {background-color: #dddddd;}"
  style += "</style>"

  var table = "<h1>Tên hộ:</h1><table><thead><tr>";

  table += "<th>" + "STT" + "</th>"
  table += "<th>" + "Họ và tên" + "</th>"
  table += "<th>" + "Ngày sinh" + "</th>"
  table += "<th>" + "Giới tính" + "</th>"
  table += "<th>" + "Tôn giáo" + "</th>"
  table += "<th>" + "Quốc tịch" + "</th>"
  table += "<th>" + "Nghề nghiệp" + "</th>"
  table += "<th>" + "CMND" + "</th>"
  table += "<th>" + "Thường trú" + "</th>"
  table += "<th>" + "Tạm trú" + "</th>"
  table += "<th>" + "Trình độ văn hóa" + "</th>"


  table += "</tr></thead><tbody>"
  for (var j = 0; j < 15; j++) {
    table += "<tr>"
    for (var i = 0; i < 11; i++) {
      table += "<td></td>"
    }
    table += "</tr>"
  }
  table += "</tbody></table><h2>Người khai báo</h2><h3>(Ký tên)</h3>"

  var win = window.open('', '', 'height=800,width=800');
  win.document.write(style);
  win.document.write(table);
  win.document.close();
  win.print();
}