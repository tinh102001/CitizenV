var root_id = localStorage.getItem("id");
var token = localStorage.getItem("token");
const currentPageUrl = location.href;
const menuItem = document.querySelectorAll("li");

var ds = document.getElementById("ds");
var tc = document.getElementById("tc");
var ql = document.getElementById("ql");
var nl = document.getElementById("nl");

if (root_id.length == 8) {
  ds.parentNode.removeChild(ds);
  ql.parentNode.removeChild(ql);
  tc.parentNode.removeChild(tc);
}
if ([2, 3, 4].includes(root_id.length)) {
  nl.parentNode.removeChild(nl);
}

for (let i = 0; i < menuItem.length; i++) {
  if (menuItem[i].childNodes[1].href === currentPageUrl) {
    menuItem[i].className = "active";
  }
}
