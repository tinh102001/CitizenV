var list_content = document.getElementById("list_pre_node");
var root_id = localStorage.getItem("id"); // lấy id đang được đăng nhập
var token = localStorage.getItem("token");// token được truyền vào localStorage sau khi đăng nhập
var nav = document.getElementById("navigation");
var arrIndexOfLocation = [root_id];
var navNameOfLocation = [];
var root = "";
var new_family_btn = document.getElementById("new_family_btn");

new_family_btn.style.visibility = "hidden";
if (root_id.length == 8) {
  new_family_btn.style.visibility = "visible";
}
var form =
  `<form>
<div class="row">
<div class="col-md-3 pr-1">
  <div class="form-group">
    <label>Nhập họ tên</label>
    <input type="text" class="form-control name" disabled = "true"/>
  </div>
</div>
<div class="col-md-3 pr-1">
  <div class="form-group">
    <label>CMND/CCCD</label>
    <input type="text" class="form-control cmnd" disabled = "true" />
  </div>
</div>
<div class="col-md-2 pr-1">
  <div class="form-group">
    <label>Giới tính</label>
    <input type="text" class="form-control gioi_tinh" disabled = "true" />
  </div>
</div>
<div class="col-md-3 pr-1">
  <div class="form-group">
    <label>Ngày sinh</label>
    <input type="text" name="dob" placeholder="DD/MM/YYYY" class="form-control ngay_sinh" disabled = "true" />
  </div>
</div>
</div>
<div class="row">
<div class="col-md-4 pr-1">
  <label> Quốc tịch</label>
  <input type="text" class="form-control quoc_tich" disabled = "true" />
</div>
<div class="col-md-4 pr-1">
  <label>Tôn giáo</label>
  <input type="text" class="form-control ton_giao" disabled = "true"/>
</div>
<div class="col-md-4 pr-1">
  <label>Nghề nghiệp</label>
  <input type="text" class="form-control nghe_nghiep" disabled = "true" />
</div>
</div>
<div class="row">
<div class="col-md-5 pr-1">
  <label>Địa chỉ thường trú</label>
  <input type="text" class="form-control thuong_tru" , placeholder="Thôn-Xã-Huyện-Tỉnh", disabled = "true"/>
</div>
<div class="col-md-5 pr-1">
  <label>Địa chỉ tạm trú</label>
  <input type="text" class="form-control tam_tru" , placeholder="Thôn-Xã-Huyện-Tỉnh" , disabled = "true" />
</div>
<div class="col-md-2 pr-1">
  <label> Trình độ học vấn</label>
  <input type="text" class="form-control hoc_van" , placeholder="" disabled = "true"/>
</div>
</div>
</form>
<div class="row">
<div class="col-md-2">
<button id = "edit" class="btn btn-primary btn-block">Sửa</button>
</div>
<div class="col-md-2">
<button id = "remove" class="btn btn-primary btn-block">Xóa</button>
</div>
</div>
<hr color="aqua"/>
`;
var new_form = `<form>
<div class="row">
<div class="col-md-3 pr-1">
  <div class="form-group">
    <label>Nhập họ tên</label>
    <input type="text" class="form-control name" />
  </div>
</div>
<div class="col-md-3 pr-1">
  <div class="form-group">
    <label>CMND/CCCD</label>
    <input type="text" class="form-control cmnd"  />
  </div>
</div>
<div class="col-md-2 pr-1">
  <div class="form-group">
    <label>Giới tính</label>
    <input type="text" class="form-control gioi_tinh"  />
  </div>
</div>
<div class="col-md-3 pr-1">
  <div class="form-group">
    <label>Ngày sinh</label>
    <input type="text" name="dob" placeholder="DD/MM/YYYY" class="form-control ngay_sinh"  />
  </div>
</div>
</div>
<div class="row">
<div class="col-md-4 pr-1">
  <label> Quốc tịch</label>
  <input type="text" class="form-control quoc_tich"  />
</div>
<div class="col-md-4 pr-1">
  <label>Tôn giáo</label>
  <input type="text" class="form-control ton_giao" />
</div>
<div class="col-md-4 pr-1">
  <label>Nghề nghiệp</label>
  <input type="text" class="form-control nghe_nghiep"  />
</div>
</div>
<div class="row">
<div class="col-md-5 pr-1">
  <label>Địa chỉ thường trú</label>
  <input type="text" class="form-control thuong_tru" , placeholder="Thôn-Xã-Huyện-Tỉnh", />
</div>
<div class="col-md-5 pr-1">
  <label>Địa chỉ tạm trú</label>
  <input type="text" class="form-control tam_tru" , placeholder="Thôn-Xã-Huyện-Tỉnh" ,  />
</div>
<div class="col-md-2 pr-1">
  <label> Trình độ học vấn</label>
  <input type="text" class="form-control hoc_van" , placeholder="" />
</div>
</div>
</form>
<div class="row">
<div class="col-md-2">
<button id = "edit" class="btn btn-primary btn-block">Sửa</button>
</div>
<div class="col-md-2">
<button id = "remove" class="btn btn-primary btn-block">Xóa</button>
</div>
</div>
<hr color="aqua"/>
`;

fetch("/list/searchname/?id=" + root_id, {
  headers: {
    'authorization': token
  }
}).then((response) => response.json()).then((res) => {
  root = "<p>" + res.ten + "</p>"
});
fetch("/form/prenode/?id=" + root_id, {
  headers: {
    'authorization': token
  }
}).then((response) => response.json())
  .then((res) => {
    nav.innerHTML = root;
    for (i in res) {
      var tr = document.createElement("tr");
      tr.innerHTML = '<td class = "ck" id="ck-1"></td>';
      for (j in res[i]) {
        var td = document.createElement("td");
        td.innerHTML = res[i][j];
        tr.appendChild(td);
      }
      list_content.appendChild(tr);
    }
  });

/**
 * Khi muốn thêm form nhập thành viên
 */
document.getElementById("add").onclick = function () {
  var x = document.createElement("div");
  x.innerHTML = new_form;
  document.querySelector("#thanh_vien").appendChild(x);
  var elements = document.getElementsByClassName("name");
  for (var i = 0; i < elements.length; i++) {
    elements[i].onblur = function () {
      this.value = reName(this.value);
    }
  }
  var elements = document.getElementsByClassName("tam_tru");
  for (var i = 0; i < elements.length; i++) {
    elements[i].onblur = function () {
      this.value = reName(this.value);
    }
  }
  var elements = document.getElementsByClassName("thuong_tru");
  for (var i = 0; i < elements.length; i++) {
    elements[i].onblur = function () {
      this.value = reName(this.value);
    }
  }
};



document.getElementById("submit").onclick = function () {
  var accept = true;
  var str = "";

  document.getElementById("err").innerHTML = "";

  var elements = document.getElementsByClassName("name");


  var list_send = new Array(elements.length);
  for (var i = 0; i < list_send.length; i++) {
    list_send[i] = new Array(11);
  }
  var elements = document.getElementsByClassName("name");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value == "") {
      str_name = " Chưa nhập Họ tên";
      str = str + str_name + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
  }
  elements_id_ho = document.getElementsByClassName("id_ho");
  for (var i = 0; i < elements.length; i++) {
    if (elements_id_ho[0].value == "") {
      str_name = " Chưa nhập Mã hộ";
      str = str + str_name + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
    list_send[i][1] = (elements[i].value);
    list_send[i][0] = (elements_id_ho[0].value);

  }
  elements = document.getElementsByClassName("cmnd");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value == "") {
      str_cmnd = " Chưa nhập CMND";
      str = str + str_cmnd + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
    list_send[i][2] = (elements[i].value)
  }

  elements = document.getElementsByClassName("nghe_nghiep");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value == "") {
      str_cmnd = " Chưa nhập Nghề Nghiệp";
      str = str + str_cmnd + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
    list_send[i][3] = (elements[i].value)
  }

  elements = document.getElementsByClassName("gioi_tinh");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value == "") {
      str_dt = " Chưa nhập Giới tính";
      str = str + str_dt + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
    list_send[i][4] = (elements[i].value)
  }

  elements = document.getElementsByClassName("ngay_sinh");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value == "") {
      str_dob = " Chưa nhập Ngày sinh";
      str = str + str_dob + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    } else if (!isDate(elements[i].value)) {
      str_check_dob = " Ngày sinh không đúng định dạng";
      str = str + str_check_dob + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
    list_send[i][5] = convertDOB(elements[i].value)
  }

  elements = document.getElementsByClassName("quoc_tich");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value == "") {
      str_quoc_tich = " Chưa nhập Quốc tịch";
      str = str + str_quoc_tich + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
    list_send[i][6] = (elements[i].value)
  }




  elements = document.getElementsByClassName("ton_giao");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value == "") {
      str_ton_giao = " Chưa nhập Tôn giáo";
      str = str + str_ton_giao + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
    list_send[i][7] = (elements[i].value)
  }
  elements = document.getElementsByClassName("hoc_van");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value == "") {
      str_hoc_van = " Chưa nhập Trình độ học vấn";
      str = str + str_hoc_van + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
    list_send[i][8] = (elements[i].value)
  }

  elements = document.getElementsByClassName("thuong_tru");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value == "") {
      str_cmnd = " Chưa nhập Địa chỉ thường trú";
      str = str + str_cmnd + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
    list_send[i][9] = (elements[i].value)
  }

  elements = document.getElementsByClassName("tam_tru");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value == "") {
      str_cmnd = " Chưa nhập Địa chỉ tạm trú";
      str = str + str_cmnd + '<br>';
      document.getElementById("err").innerHTML = str;
      accept = false;
      break;
    }
    list_send[i][10] = (elements[i].value)
  }

  if (accept) {
    fetch(
      '/form/form/', {
      method: 'POST',
      headers: {
        'authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'list_send': list_send,
        'id_family': list_send[0][0]
      })
    }).then((response) => response.json())
      .then((res) => {
        if (res.status) alert(res.status)
        document.location.pathname = "/form";
      });
  }

};

/**
 * Kiểm tra hợp thức ngày đã nhập
 * @param {string} d 
 * @returns 
 */
function isDate(d) {
  s = d.split("/");

  if (s.length != 3) return false;
  if (isNaN(s[0]) || isNaN(s[1]) || isNaN(s[2])) return false;

  day = parseInt(s[0]);
  month = parseInt(s[1]);
  year = parseInt(s[2]);

  if (month > 12 || month < 1) return false;
  if (
    month == 1 ||
    month == 3 ||
    month == 5 ||
    month == 7 ||
    month == 8 ||
    month == 10 ||
    month == 12
  ) {
    if (day > 31) return false;
  } else if (month == 2) {
    if (year % 4 == 0 && year % 100 != 0) {
      if (day > 29) return false;
    } else if (day > 28) return false;
  } else if (day > 30) return false;

  if (day < 1) return false;

  date = new Date();
  if (year > date.getFullYear() || year < 1950) return false;

  return true;
}

/**
 * Tự động viết hoa chữ cái đầu của Họ và tên
 * @param {string} name 
 * @returns 
 */
function reName(name) {
  normal_name = name;
  ss = normal_name.split(" ");
  normal_name = "";
  for (i = 0; i < ss.length; i++)
    if (ss[i].length > 0) {
      if (normal_name.length > 0) normal_name = normal_name + " ";
      normal_name = normal_name + ss[i].substring(0, 1).toUpperCase();
      normal_name = normal_name + ss[i].substring(1).toLowerCase();
    }
  return normal_name;
}

/**
 * Chuyển ngày sinh nhập từ frontend về dạng date rồi truyền đi để thêm vào csdl
 * @param {*} dob 
 * @returns 
 */
function convertDOB(dob) {
  var ingre = dob.split('/');
  var day = ingre[0];
  var month = ingre[1];
  var year = ingre[2];
  return year + month + day;
}
function newFamily() {
  var str = "/form/newfamily/";
  fetch(str, {
    method: 'POST',
    headers: {
      'authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'new_family': document.getElementById("name_family").value,
      'userid': arrIndexOfLocation.slice(-1)[0]
    })
  }).then((response) => response.json()).then((res) => {
    alert(res.status)
    document.location.pathname = "/form";
  })
}

/**
 * Xử lý sự kiện ấn nút Xóa của từng ô thành viên
 */
$('#thanh_vien').on('click', 'button#remove', function () {
  var index = $('button#remove').index(this);
  var myDiv = document.getElementById("thanh_vien");
  myDiv.removeChild(myDiv.children[index]);
});

/**
 * Xử lý sự kiện ấn nút Sửa của từng ô thành viên
 */
$('#thanh_vien').on('click', 'button#edit', function () {
  var index = $('button#edit').index(this);
  var myDiv = document.getElementById("thanh_vien");
  var num_of_atri = myDiv.children[index].childNodes[0].length;
  for (var i = 0; i < num_of_atri; i++) {
    myDiv.children[index].childNodes[0][i].disabled = false;
  }
});

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

  if (index.length == 10) {
    new_family_btn.style.visibility = "visible";
    document.getElementsByClassName('title')[0].innerHTML = "Thành viên "
    fetch("/form/listmember/?id=" + index, {
      headers: {
        'authorization': token,
      }
    }).then((response) => response.json()).then((res) => {
      document.querySelector("#thanh_vien").innerHTML = "";
      document.getElementsByClassName('id_ho')[0].value = index;
      document.getElementsByClassName('title')[0].innerHTML += this.getElementsByTagName("td")[2].innerHTML;

      for (var i = 0; i < res.length; i++) {
        var x = document.createElement("div");
        x.innerHTML = form;
        document.querySelector("#thanh_vien").appendChild(x);
        console.log(x.innerHTML);
      }

      for (var i = 0; i < res.length; i++) {
        document.getElementsByClassName('name')[i].value = res[i].ho_va_ten;
        document.getElementsByClassName('cmnd')[i].value = res[i].cmnd;
        document.getElementsByClassName('gioi_tinh')[i].value = res[i].gioi_tinh;
        document.getElementsByClassName('ngay_sinh')[i].value = res[i].ngay_sinh;
        document.getElementsByClassName('quoc_tich')[i].value = res[i].quoc_tich;
        document.getElementsByClassName('ton_giao')[i].value = res[i].ton_giao;
        document.getElementsByClassName('nghe_nghiep')[i].value = res[i].nghe_nghiep;
        document.getElementsByClassName('tam_tru')[i].value = res[i].dia_chi_tam_tru;
        document.getElementsByClassName('thuong_tru')[i].value = res[i].dia_chi_thuong_tru;
        document.getElementsByClassName('hoc_van')[i].value = res[i].trinh_do_van_hoa;
      }
    })
  } else {
    str = "/list/prenode/?id=" + index;
    arrIndexOfLocation.push(index);
    navNameOfLocation[arrIndexOfLocation.length - 2] =
      document.createElement("p");
    navNameOfLocation[arrIndexOfLocation.length - 2].innerHTML =
      " > " + this.getElementsByTagName("td")[2].innerHTML;
    nav.appendChild(navNameOfLocation[arrIndexOfLocation.length - 2]);

    tieude.innerHTML = "";
    var trHead = document.createElement("tr");
    trHead.innerHTML = "<th></th>" + "<th>Mã</th>" + "<th>Địa điểm</th>";
    tieude.appendChild(trHead);

    list_content.innerHTML = "";
    fet = fetch(str, {
      headers: {
        'authorization': token,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        new_family_btn.style.visibility = "visible";
        for (i in res) {
          var tr = document.createElement("tr");
          tr.innerHTML =
            '<td class = "ck" id="ck-1"></td>';
          for (j in res[i]) {
            var td = document.createElement("td");
            td.innerHTML = res[i][j];
            tr.appendChild(td);
          }
          list_content.appendChild(tr);
        }
      });
  }
});

// Hàm để ấn vào điều hướng
$("#navigation").on("click", "p", function () {
  var index = $(this).index();
  nav.innerHTML = root;
  var temp = [];
  for (i = 0; i < index; i++) {
    temp[i] = document.createElement("p");
    temp[i].innerHTML = navNameOfLocation[i].innerHTML;
    nav.appendChild(temp[i]);
  }

  navNameOfLocation.splice(index, navNameOfLocation.length);
  arrIndexOfLocation.splice(index + 1, arrIndexOfLocation.length);
  str =
    "/list/prenode/?id=" +
    arrIndexOfLocation[arrIndexOfLocation.length - 1];

  list_content.innerHTML = "";

  tieude.innerHTML = "";
  var trHead = document.createElement("tr");
  trHead.innerHTML = "<th></th>" + "<th>Mã</th>" + "<th>Địa điểm</th>";
  tieude.appendChild(trHead);

  fet = fetch(str, {
    headers: {
      'authorization': token,
    },
  })
    .then((response) => response.json())
    .then((res) => {
      for (i in res) {
        var tr = document.createElement("tr");
        tr.innerHTML =
          '<td class = "ck" id="ck-1" ></td>';
        for (j in res[i]) {
          var td = document.createElement("td");
          td.innerHTML = res[i][j];
          tr.appendChild(td);
        }
        list_content.appendChild(tr);
      }
    });
});