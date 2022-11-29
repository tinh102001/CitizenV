var root_id = localStorage.getItem("id");
var token = localStorage.getItem("token");

var head_table = document.getElementById("head_table");
var body_table = document.getElementById("body_table");

var body_table_result = document.getElementById("ketquatimkiem");
var arrIdDiaPhuong = [];

$(document).ready(function () {
  $("#mytable").DataTable({});
});

//kiểm tra form tra cứu
function Chapnhan() {
  var okie = true; //chưa có lỗi
  //xóa các thông báo lỗi
  document.getElementById("loi_cmnd").innerHTML = "";

  //kiểm tra các trường bắt buộc nhập
  if (document.getElementById("CMND").value == "") {
    document.getElementById("loi_cmnd").innerHTML = "chưa nhập cmnd";
    document.getElementById("CMND").focus();
    okie = false;
  }
  if (okie) document.getElementById("form").submit();
}

//tìm kiếm thông tin nhân khẩu
function tracuu() {
  var cmnd = document.getElementById("cmnd").value;
  var hoten = document.getElementById("hovaten").value;
  var diaphuong = arrIdDiaPhuong[arrIdDiaPhuong.length - 1];

  var url =
    "/search/search/?cmnd=" +
    cmnd +
    "&hoten=" +
    hoten +
    "&diaphuong=" +
    diaphuong;
  fetch(url, {
    headers: {
      'authorization': token,
    },
  })
    .then((response) => response.json())
    .then((res) => {
      body_table_result.innerHTML = "";
      for (i in res) {
        var tr = document.createElement("tr");
        for (j in res[i]) {
          var td = document.createElement("td");
          td.innerHTML = res[i][j];
          tr.appendChild(td);
        }
        body_table_result.appendChild(tr);
      }
    });
}


//lựa chọn tỉnh/huyện/xã/thôn theo quyền A123B12
switch (root_id.length) {
  case 2:
    head_table.innerHTML = "";
    head_table.innerHTML =
      "<tr>" +
      "<th>CMND</th>" +
      "<th>Họ và tên</th>" +
      "<th>Huyện</th>" +
      "<th>Xã</th>" +
      "<th>Thôn</th>" +
      "</tr>";
    body_table.innerHTML =
      "<tr>" +
      '<td><input type="text" id="cmnd" class="form-control"/></td>' +
      '<td><input type="text" id="hovaten" class="form-control"/></td>' +
      '<td><input list="danhsachhuyen" type="text" id="huyen" class="form-control"/><datalist id="danhsachhuyen"></datalist></td>' +
      '<td><input list="danhsachxa" type="text" id="xa" class="form-control"/><datalist id="danhsachxa"></datalist></td>' +
      '<td><input list="danhsachthon" type="text" id="thon" class="form-control"/><datalist id="danhsachthon"></datalist></td>' +
      "</tr>";

    var danhsachhuyen = document.getElementById("danhsachhuyen");
    var danhsachxa = document.getElementById("danhsachxa");
    var danhsachthon = document.getElementById("danhsachthon");

    //fetch dữ liệu huyện từ database
    layHuyen = fetch("/list/prenode/?id=" + root_id, {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        //url có dạng đường dẫn/?biến=giá trị & biến=giá trị
        arrIdDiaPhuong.push(root_id);
        //thêm giá trị vào datalist của trường huyện
        for (i in res) {
          var option = document.createElement("option");
          option.setAttribute("data-value", res[i].id);
          option.value = "";
          option.value = res[i].ten;
          danhsachhuyen.appendChild(option);
        }
      });

    //thêm giá trị vào datalist xã theo giá trị trong trường huyện
    $("#huyen").on("input", function () {
      var value1 = this.value;
      var idHuyen = $('#danhsachhuyen [value="' + value1 + '"]').data("value");
      arrIdDiaPhuong.push(idHuyen);
      layXa = fetch("/list/prenode/?id=" + idHuyen, {
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((res) => {
          danhsachxa.innerHTML = "";
          for (i in res) {
            var option = document.createElement("option");
            option.setAttribute("data-value", res[i].id);
            option.value = "";
            option.value = res[i].ten;
            danhsachxa.appendChild(option);
          }
        });

      $("#xa").on("input", function () {
        var value1 = this.value;
        var idXa = $('#danhsachxa [value="' + value1 + '"]').data("value");
        arrIdDiaPhuong.push(idXa);
        layThon = fetch("/list/prenode/?id=" + idXa, {
          headers: {
            Authorization: token,
          },
        })
          .then((response) => response.json())
          .then((res) => {
            //url có dạng đường dẫn/?biến=giá trị&biến=giá trị

            danhsachthon.innerHTML = "";
            for (i in res) {
              var option = document.createElement("option");
              option.setAttribute("data-value", res[i].id);
              option.value = "";
              option.value = res[i].ten;
              danhsachthon.appendChild(option);
            }
          });
        $("#thon").on("input", function () {
          var value1 = this.value;
          var idHoKhau = $('#danhsachthon [value="' + value1 + '"]').data(
            "value"
          );
          arrIdDiaPhuong.push(idHoKhau);
        });
      });
    });
    break;

  case 4:
    head_table.innerHTML =
      "<tr>" +
      "<th>CMND</th>" +
      "<th>Họ và tên</th>" +
      "<th>Xã</th>" +
      "<th>Thôn</th>" +
      "</tr>";
    body_table.innerHTML =
      "<tr>" +
      '<td><input type="text" id="cmnd" class="form-control"/></td>' +
      '<td><input type="text" id="hovaten" class="form-control"/></td>' +
      '<td><input list="danhsachxa" type="text" id="xa" class="form-control"/><datalist id="danhsachxa"></datalist></td>' +
      '<td><input list="danhsachthon" type="text" id="thon" class="form-control"/><datalist id="danhsachthon"></datalist></td>' +
      "</tr>";

    var danhsachxa = document.getElementById("danhsachxa");
    var danhsachthon = document.getElementById("danhsachthon");

    layXa = fetch("/list/prenode/?id=" + root_id, {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        //url có dạng đường dẫn/?biến=giá trị&biến=giá trị
        arrIdDiaPhuong.push(root_id);
        for (i in res) {
          var option = document.createElement("option");
          option.setAttribute("data-value", res[i].id);
          option.value = "";
          option.value = res[i].ten;
          danhsachxa.appendChild(option);
        }
      });

    $("#xa").on("input", function () {
      var value1 = this.value;
      var idXa = $('#danhsachxa [value="' + value1 + '"]').data("value");
      arrIdDiaPhuong.push(idXa);
      layThon = fetch("/list/prenode/?id=" + idXa, {
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((res) => {
          //url có dạng đường dẫn/?biến=giá trị&biến=giá trị
          danhsachthon.innerHTML = "";
          for (i in res) {
            var option = document.createElement("option");
            option.setAttribute("data-value", res[i].id);
            option.value = "";
            option.value = res[i].ten;
            danhsachthon.appendChild(option);
          }
        });
      $("#thon").on("input", function () {
        var value1 = this.value;
        var idHoKhau = $('#danhsachthon [value="' + value1 + '"]').data(
          "value"
        );
        arrIdDiaPhuong.push(idHoKhau);
      });
    });
    break;

  case 6:
    head_table.innerHTML =
      "<tr>" +
      "<th>CMND</th>" +
      "<th>Họ và tên</th>" +
      "<th>Thôn</th>" +
      "</tr>";
    body_table.innerHTML =
      "<tr>" +
      '<td><input type="text" id="cmnd"  class="form-control"/></td>' +
      '<td><input type="text" id="hovaten" class="form-control"/></td>' +
      '<td><input list="danhsachthon" type="text" id="thon" class="form-control"/><datalist id="danhsachthon"></datalist></td>' +
      "</tr>";

    var danhsachthon = document.getElementById("danhsachthon");
    layThon = fetch("/list/prenode/?id=" + root_id, {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        //url có dạng đường dẫn/?biến=giá trị&biến=giá trị
        arrIdDiaPhuong.push(root_id);
        for (i in res) {
          var option = document.createElement("option");
          option.setAttribute("data-value", res[i].id);
          option.value = "";
          option.value = res[i].ten;
          danhsachthon.appendChild(option);
        }
      });
    $("#thon").on("input", function () {
      var value1 = this.value;
      var idHoKhau = $('#danhsachthon [value="' + value1 + '"]').data("value");
      arrIdDiaPhuong.push(idHoKhau);
    });
    break;

  case 3:
    head_table.innerHTML =
      "<tr>" +
      "<th>CMND</th>" +
      "<th>Họ và tên</th>" +
      "<th>Tinh</th>" +
      "<th>Huyện</th>" +
      "<th>Xã</th>" +
      "<th>Thôn</th>" +
      "</tr>";
    body_table.innerHTML =
      "<tr>" +
      '<td><input type="text" id="cmnd" class="form-control"/></td>' +
      '<td><input type="text" id="hovaten" class="form-control"/></td>' +
      '<td><input list="danhsachtinh" type="text" id="tinh" class="form-control" /><datalist id="danhsachtinh"></datalist></td>' +
      '<td><input list="danhsachhuyen" type="text" id="huyen" class="form-control"/><datalist id="danhsachhuyen"></datalist></td>' +
      '<td><input list="danhsachxa" type="text" id="xa" class="form-control"/><datalist id="danhsachxa"></datalist></td>' +
      '<td><input list="danhsachthon" type="text" id="thon" class="form-control"/><datalist id="danhsachthon"></datalist></td>' +
      "</tr>";

    var danhsachtinh = document.getElementById("danhsachtinh");
    var danhsachhuyen = document.getElementById("danhsachhuyen");
    var danhsachxa = document.getElementById("danhsachxa");
    var danhsachthon = document.getElementById("danhsachthon");

    layTinh = fetch("/list/prenode/?id=" + root_id, {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        //url có dạng đường dẫn/?biến=giá trị&biến=giá trị
        arrIdDiaPhuong.push(root_id);
        for (i in res) {
          var option = document.createElement("option");
          option.setAttribute("data-value", res[i].id);
          option.value = "";
          option.value = res[i].ten;
          danhsachtinh.appendChild(option);
        }
      });

    $("#tinh").on("input", function () {
      var value1 = this.value;
      var idHuyen = $('#danhsachtinh [value="' + value1 + '"]').data("value");
      arrIdDiaPhuong.push(idHuyen);
      layHuyen = fetch("/list/prenode/?id=" + idHuyen, {
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((res) => {
          //url có dạng đường dẫn/?biến=giá trị&biến=giá trị
          danhsachhuyen.innerHTML = "";
          for (i in res) {
            var option = document.createElement("option");
            option.setAttribute("data-value", res[i].id);
            option.value = "";
            option.value = res[i].ten;
            danhsachhuyen.appendChild(option);
          }
        });

      $("#huyen").on("input", function () {
        var value1 = this.value;
        var idXa = $('#danhsachhuyen [value="' + value1 + '"]').data("value");
        arrIdDiaPhuong.push(idXa);
        layXa = fetch("/list/prenode/?id=" + idXa, {
          headers: {
            Authorization: token,
          },
        })
          .then((response) => response.json())
          .then((res) => {
            //url có dạng đường dẫn/?biến=giá trị&biến=giá trị
            danhsachxa.innerHTML = "";
            for (i in res) {
              var option = document.createElement("option");
              option.setAttribute("data-value", res[i].id);
              option.value = "";
              option.value = res[i].ten;
              danhsachxa.appendChild(option);
            }
          });

        $("#xa").on("input", function () {
          var value1 = this.value;
          var idThon = $('#danhsachxa [value="' + value1 + '"]').data("value");
          arrIdDiaPhuong.push(idThon);
          layThon = fetch("/list/prenode/?id=" + idThon, {
            headers: {
              Authorization: token,
            },
          })
            .then((response) => response.json())
            .then((res) => {
              //url có dạng đường dẫn/?biến=giá trị&biến=giá trị
              danhsachthon.innerHTML = "";
              for (i in res) {
                var option = document.createElement("option");
                option.setAttribute("data-value", res[i].id);
                option.value = "";
                option.value = res[i].ten;
                danhsachthon.appendChild(option);
              }
            });
          $("#thon").on("input", function () {
            var value1 = this.value;
            var idHoKhau = $('#danhsachthon [value="' + value1 + '"]').data(
              "value"
            );
            arrIdDiaPhuong.push(idHoKhau);
          });
        });
      });
    });

    break;
}
