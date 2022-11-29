var info = document.getElementById("info");
var nav = document.getElementById("navigation"); // Thanh điều hướng thể hiện vị trí và các địa phương đã đi qua
var list_content = document.getElementById("list_pre_node");

var root_id = localStorage.getItem("id");
var token = localStorage.getItem("token");

var arrIndexOfLocation = [root_id]; // Mảng chứa các id để truy vấn tới dtb
var navNameOfLocation = []; // Mảng để hiện thị đường dẫn trên danh sách
var root = "";// Gốc của điều hướng có thể thay đổi sau này với mỗi tài khoản có quyền khác nhau
var arrIndexClicked = [];
var male_stat = {
  '0-9': 0,
  '10-19': 0,
  '20-29': 0,
  '30-39': 0,
  '40-49': 0,
  '50-59': 0,
  '60-69': 0,
  '70-79': 0,
  '80-89': 0,
  '90-99': 0,
  '100-': 0,
}
var female_stat = {
  '0-9': 0,
  '10-19': 0,
  '20-29': 0,
  '30-39': 0,
  '40-49': 0,
  '50-59': 0,
  '60-69': 0,
  '70-79': 0,
  '80-89': 0,
  '90-99': 0,
  '100-': 0,
}

var thap_tuoi_data;
var mat_do_data;

fetch("/list/searchname/?id=" + root_id, {
  headers: {
    'authorization': token
  }
}).then((response) => response.json()).then((res) => {
  root = "<p>" + res.ten + "</p>"
});

list_content.innerHTML = "đang tải...";


laydanhsach = fetch("/list/prenode/?id=" + root_id, {
  headers: {
    'authorization': token
  }
}).then((response) => response.json())
  .then((res) => {
    list_content.innerHTML = "";
    nav.innerHTML = root;
    for (i in res) {
      var tr = document.createElement("tr");
      tr.innerHTML = '<td><input type="checkbox" class = "ck" id="ck-1"></td>';
      for (j in res[i]) {
        var td = document.createElement("td");
        td.innerHTML = res[i][j];
        tr.appendChild(td);
      }
      list_content.appendChild(tr);
    }
  });

/**
 * Khi ấn vào từng dòng thông tin. Tỉnh -> huyện trong tỉnh -> xã trong huyện ->... -> nhân khẩu trong hộ
 */
$("#table").on("click", "tbody tr", function (e) {
  var index = this.getElementsByTagName("td")[1].innerHTML;
  if ($(e.target).closest("input").length) {
    if ((e.target).checked == true) {
      arrIndexClicked.push(index);
    } else {
      arrIndexClicked = arrIndexClicked.filter(function (val) {
        return val != index;
      })
    }
    return;
  }

  if (isNaN(index)) {
    return;
  };

  // nếu ID ấn tiếp theo là Hộ khẩu -> Hiển thị thông tin về nhân khẩu nên ta thay đổi thead của table 
  // để thế hiện được thông tin của một nhân khẩu
  if (index.length == 10) {

    subStr = "/list/listmember/?id=" + index;
    fet = fetch(subStr, {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        arrIndexOfLocation.push(index);
        navNameOfLocation[arrIndexOfLocation.length - 2] =
          document.createElement("p");
        navNameOfLocation[arrIndexOfLocation.length - 2].innerHTML =
          " > " + this.getElementsByTagName("td")[2].innerHTML;
        nav.appendChild(navNameOfLocation[arrIndexOfLocation.length - 2]);

        list_content.innerHTML = "";

        tieude.innerHTML = "";
        var trHead = document.createElement("tr");
        trHead.innerHTML =
          "<th>Họ tên</th>" +
          "<th>Ngày sinh</th>" +
          "<th>Giới tính</th>" +
          "<th>Tôn giáo</th>" +
          "<th>Quốc tịch</th>" +
          "<th>Nghề nghiệp</th>" +
          "<th>CMND</th>" +
          "<th>Địa chỉ thường trú</th>" +
          "<th>Địa chỉ tạm trú</th>" +
          "<th>Trình độ học vấn</th>";
        tieude.appendChild(trHead);

        for (i in res) {
          var tr = document.createElement("tr");
          for (j in res[i]) {
            var td = document.createElement("td");
            td.innerHTML = res[i][j];
            tr.appendChild(td);
          }
          list_content.appendChild(tr);
        }
      });
  } else {
    // Xây dựng bảng thông tin về Tỉnh, Huyện, Xã, Thôn
    str = "/list/prenode/?id=" + index;

    arrIndexOfLocation.push(index);
    navNameOfLocation[arrIndexOfLocation.length - 2] =
      document.createElement("p");
    navNameOfLocation[arrIndexOfLocation.length - 2].innerHTML =
      " > " + this.getElementsByTagName("td")[2].innerHTML;
    nav.appendChild(navNameOfLocation[arrIndexOfLocation.length - 2]);

    tieude.innerHTML = "";
    var trHead = document.createElement("tr");
    trHead.innerHTML = "<th></th>" + "<th>Mã</th>" + "<th>Địa phương</th>";
    tieude.appendChild(trHead);

    list_content.innerHTML = "";
    fet = fetch(str, {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        for (i in res) {
          //tạo các hàng
          var tr = document.createElement("tr");
          tr.innerHTML =
            '<td><input type="checkbox" class = "ck" id="ck-1"></td>';
          for (j in res[i]) {
            //tạo trường cho các hàng
            var td = document.createElement("td");
            td.innerHTML = res[i][j];
            tr.appendChild(td);
          }

          list_content.appendChild(tr);
        }
      });
  }
});

/**
 * Xử lý sự kiện khi ấn thanh điều hướng, thể hiện vị trí truy cập hiện tại, ấn vào tuyến trước có thể quay lại
 */
$("#navigation").on("click", "p", function () {
  var index = $(this).index();
  nav.innerHTML = root;

  var temp = [];
  for (i = 0; i < index; i++) {
    temp[i] = document.createElement("p");
    temp[i].innerHTML = navNameOfLocation[i].innerHTML;
    nav.appendChild(temp[i]);
  }
  if ((root_id.length == 6 && index == 2)
    || (root_id.length == 4 && index == 3)
    || (root_id.length == 2 && index == 4)
    || (root_id.length == 3 && index == 5)
    || (root_id.length == 8 && index == 1)) {
    // Thông tin về nhân khẩu là cuối cùng. Khi truy cập với vai trò khác nhau, thanh điều hướng cũng có số lượng khác nhau
    return;
  }
  navNameOfLocation.splice(index, navNameOfLocation.length);
  arrIndexOfLocation.splice(index + 1, arrIndexOfLocation.length);
  str =
    "/list/prenode/?id=" +
    arrIndexOfLocation[arrIndexOfLocation.length - 1];

  list_content.innerHTML = "";

  tieude.innerHTML = "";
  var trHead = document.createElement("tr");
  trHead.innerHTML = "<th></th>" + "<th>Mã</th>" + "<th>Địa phương</th>";
  tieude.appendChild(trHead);

  fet = fetch(str, {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((res) => {
      for (i in res) {

        var tr = document.createElement("tr");
        tr.innerHTML =
          '<td><input type="checkbox" class = "ck" id="ck-1"></td>';
        for (j in res[i]) {

          var td = document.createElement("td");
          td.innerHTML = res[i][j];
          tr.appendChild(td);
        }

        list_content.appendChild(tr);
      }
    });
});


/**
 * Thực hiện thêm địa phương dưới tuyến của người đăng nhập và tải lại trang
 */
function themDiaPhuong() {
  var name = document.getElementById('name_them').value;
  var dientich = document.getElementById('dt_them').value;
  fetch("/list/createnew/?name=" + name + "&dientich=" + dientich, {
    headers: {
      'authorization': token
    }
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.status) {
        alert(res.status)
        document.location.pathname = "/list";
      }
    })
}

/**
 * Thực hiện xóa địa phương dưới tuyến của người đăng nhập và tải lại trang
 */
function xoaDiaPhuong() {
  var id_ = document.getElementById('id_xoa').value;
  fetch("/list/delete/?id=" + id_, {
    headers: {
      'authorization': token
    }
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.status) alert(res.status);
      document.location.pathname = "/list";
    })
}

/**
 * Chỉnh sửa địa phương dưới tuyến về tên và diện tích và tải lại trang
 */
function chinhSua() {
  var id_ = document.getElementById('id_chinh_sua').value;
  var name = document.getElementById('name_chinh_sua').value;
  var dientich = document.getElementById('dt_chinh_sua').value;
  fetch("/list/edit/?id=" + id_ + "&name=" + name + "&dientich=" + dientich, {
    headers: {
      'authorization': token
    }
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.status) alert(res.status);
      document.location.pathname = "/list";
    })
}

/**
 * Gửi danh sách các Id đối tượng được chọn để lấy về thông tin về: Nam, Nữ, Diện tích, Tổng dân số
 * để truyền vào mảng thap_tuoi_data, mat_do_data, biểu đồ lấy thông tin từ 2 mảng này để thể hiện
 */
function getDataStat() {
  if (arrIndexClicked.length == 0) {
    alert("Bạn chưa chọn địa phương nào!");
  } else {
    var type = document.getElementById("bieudo").value;
    fetch("/list/statistic/?arr_id=" + arrIndexClicked + "&type=" + type, {
      headers: {
        'authorization': token
      }
    }).then((response) => response.json())
      .then((res) => {
        if (type == "thap_tuoi") {
          for (i in res) {
            if (res[i]['gioi_tinh'] == "Nam") {
              // so_luong_nam++;
              if (res[i]['Tuoi'] >= 0 && res[i]['Tuoi'] <= 9) {
                male_stat['0-9']++;

              } else if (res[i]['Tuoi'] <= 19) {
                male_stat['10-19']++;

              } else if (res[i]['Tuoi'] <= 29) {
                male_stat['20-29']++;

              } else if (res[i]['Tuoi'] <= 39) {
                male_stat['30-39']++;

              } else if (res[i]['Tuoi'] <= 49) {
                male_stat['40-49']++;

              } else if (res[i]['Tuoi'] <= 59) {
                male_stat['50-59']++;

              } else if (res[i]['Tuoi'] <= 69) {
                male_stat['60-69']++;

              } else if (res[i]['Tuoi'] <= 79) {
                male_stat['70-79']++;

              } else if (res[i]['Tuoi'] <= 89) {
                male_stat['80-89']++;

              } else if (res[i]['Tuoi'] <= 99) {
                male_stat['90-99']++;

              } else {
                male_stat['100-']++;

              }
            }
            if (res[i]['gioi_tinh'] == "Nữ") {
              // so_luong_nu++;
              if (res[i]['Tuoi'] >= 0 && res[i]['Tuoi'] <= 9) {
                female_stat['0-9']++;

              } else if (res[i]['Tuoi'] <= 19) {
                female_stat['10-19']++;

              } else if (res[i]['Tuoi'] <= 29) {
                female_stat['20-29']++;

              } else if (res[i]['Tuoi'] <= 39) {
                female_stat['30-39']++;

              } else if (res[i]['Tuoi'] <= 49) {
                female_stat['40-49']++;

              } else if (res[i]['Tuoi'] <= 59) {
                female_stat['50-59']++;

              } else if (res[i]['Tuoi'] <= 69) {
                female_stat['60-69']++;

              } else if (res[i]['Tuoi'] <= 79) {
                female_stat['70-79']++;

              } else if (res[i]['Tuoi'] <= 89) {
                female_stat['80-89']++;

              } else if (res[i]['Tuoi'] <= 99) {
                female_stat['90-99']++;

              } else {
                female_stat['100-']++;

              }
            }


          }
          thap_tuoi_data = [
            ['Tuổi', 'Nam', 'Nữ'],
            ['0-9   tuổi', male_stat["0-9"], -female_stat["0-9"]],
            ['10-19 tuổi', male_stat["10-19"], -female_stat["10-19"]],
            ['20-29 tuổi', male_stat["20-29"], -female_stat["20-29"]],
            ['30-39 tuổi', male_stat["30-39"], -female_stat["30-39"]],
            ['40-49 tuổi', male_stat["40-49"], -female_stat["40-49"]],
            ['50-59 tuổi', male_stat["50-59"], -female_stat["50-59"]],
            ['60-69 tuổi', male_stat["60-69"], -female_stat["60-69"]],
            ['70-79 tuổi', male_stat["70-79"], -female_stat["70-79"]],
            ['80-89 tuổi', male_stat["80-89"], -female_stat["80-89"]],
            ['90-99 tuổi', male_stat["90-99"], -female_stat["90-99"]],
            ['100+  tuổi', male_stat["100-"], -female_stat["100-"]]
          ];

        }
        else if (type == 'mat_do') {
          mat_do_data = [
            ['Tỉnh thành', 'Mật độ',],
          ]
          for (var i = 0; i < res.length; i++) {
            mat_do_data.push([res[i]['Ten'], res[i]['Matdo']])
          }

        }
      }).then((_) => {
        showStat();
        // khởi tạo lại dữ liệu truyền vào bảng thống kê, tránh sự lặp lại về dữ liệu
        male_stat = {
          '0-9': 0,
          '10-19': 0,
          '20-29': 0,
          '30-39': 0,
          '40-49': 0,
          '50-59': 0,
          '60-69': 0,
          '70-79': 0,
          '80-89': 0,
          '90-99': 0,
          '100-': 0,
        }
        female_stat = {
          '0-9': 0,
          '10-19': 0,
          '20-29': 0,
          '30-39': 0,
          '40-49': 0,
          '50-59': 0,
          '60-69': 0,
          '70-79': 0,
          '80-89': 0,
          '90-99': 0,
          '100-': 0,
        }
      })
  }


}


google.load("visualization", "1", { packages: ["corechart"] });
var statistic = document.getElementById("thongke");
function showStat() {
  var bieudo = document.getElementById("bieudo").value;
  statistic.style.display = "block";
  if (bieudo == 'mat_do')
    google.setOnLoadCallback(matDoDanSo);
  else if (bieudo == 'thap_tuoi')
    google.setOnLoadCallback(thapTuoi);
}

/**
 * Xây dựng biểu đồ tháp tuổi
 */
function thapTuoi() {

  var data = google.visualization.arrayToDataTable(thap_tuoi_data);

  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

  var options = {

    chartArea: {
      'backgroundColor': {
        colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
        'opacity': 100
      },
    },
    isStacked: true,
    hAxis: {
      format: ';'
    },
    vAxis: {
      direction: -1
    }

  };


  var formatter = new google.visualization.NumberFormat({
    pattern: ';'
  });

  formatter.format(data, 2)
  chart.draw(data, options);
}

/**
 * Xây dựng biểu đồ về mật độ dân số
 */
function matDoDanSo() {
  var data = google.visualization.arrayToDataTable(mat_do_data);

  var options = {
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
    title: 'Mật độ dân số',

    chartArea: {
      backgroundColor: {
        fill: '#FFFFF',
        fillOpacity: 0.1
      },
    },
    hAxis: {
      title: 'Thành phố',
      minValue: 0
    },
    vAxis: {
      title: 'Mật độ dân số'
    }
  };

  var chart = new google.visualization.ColumnChart(
    document.getElementById('chart_div'));

  chart.draw(data, options);
}

/**
 * Tắt bảng thống kê
 */
function closeStat() {
  statistic.style.display = "none";
}
