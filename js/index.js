let arrNhanVien = [];

// --------- LẤY THÔNG TIN NHÂN VIÊN ---------
function getValueNhanVien() {
  //Tạo Object từ Class
  let nhanVien = new NhanVien();
  //Tạo biến cờ để xét validation
  let flag = true;
  //Tạo mảng chứ 8input/select
  let arrField = document.querySelectorAll("#formQLNV input, #formQLNV select");
  for (let field of arrField) {
    let { id, value } = field;
    nhanVien[id] = value;
    // Thẻ Span (CN: thông báo lỗi)
    let theSpanThongBao = field.parentElement.nextElementSibling;

    if (!checkEmptyValue(theSpanThongBao, value)) {
      //TH1: Input dữ liệu rỗng
      flag = false;
    } else {
      // input có dữ liệu
      let dataAttributeValue = field.getAttribute("data-validation");
      switch (dataAttributeValue) {
        // Tài khoản: từ 4 - 6 ký số
        case "taiKhoan":
          if (
            !checkSoNguyenDuong(theSpanThongBao, value) ||
            !checkMinMaxValue(theSpanThongBao, value, 4, 6)
          ) {
            flag = false;
          }
          break;
        // Họ tên: dữ liệu chữ không nhận số
        case "hoTen":
          if (!checkWordValue(theSpanThongBao, value)) {
            flag = false;
          }
          break;
        // Email: đúng định dạng email
        case "email":
          if (!checkEmailValue(theSpanThongBao, value)) {
            flag = false;
          }
          break;
        // Password: từ 6 - 10 ký số trong đó có 1 chữ cái Hoa, 1 chữ số, 1 ký tự đặc biệt
        case "password":
          if (
            !checkPassword(theSpanThongBao, value) ||
            !checkMinMaxValue(theSpanThongBao, value, 6, 10)
          ) {
            flag = false;
          }
          break;
        // Ngày làm: đúng định dạng MM/DD/YYYY
        case "ngayLam":
          if (!checkMonthDateYear(theSpanThongBao, value)) {
            flag = false;
          }
          break;
        // Lương căn bản: từ 1,000,000 - 20,000,000 đồng
        case "luongCB":
          if (
            !checkSoNguyenDuong(theSpanThongBao, value) ||
            !checkLimit(theSpanThongBao, value, 1e6, 2e7, "đồng")
          ) {
            flag = false;
          }
          break;
        // Giờ làm: từ 80 - 200 giờ
        case "gioLam":
          if (
            !checkSoNguyenDuong(theSpanThongBao, value) ||
            !checkLimit(theSpanThongBao, value, 80, 200, "giờ")
          ) {
            flag = false;
          }
          break;
      }
    }
  }
  return flag ? nhanVien : null;
}

// --------- LOCAL STORAGE ---------
function setLocalStorage(key, value) {
  let dataString = JSON.stringify(value);
  localStorage.setItem(key, dataString);
}
function getLocalStorage(key) {
  let dataLocal = localStorage.getItem(key);
  return dataLocal ? JSON.parse(dataLocal) : null;
}
function removeLocalStorage(key) {
  let dataLocal = localStorage.getItem(key);
  return dataLocal ? localStorage.removeItem(key) : null;
}

// --------- RENDER TABLE ---------
function renderNhanVien(arr = arrNhanVien) {
  let content = "";
  for (let nhanVien of arr) {
    let newNhanVien = new NhanVien();
    Object.assign(newNhanVien, nhanVien);
    let { tknv, name, email, datepicker, chucvu } = newNhanVien;
    let chucVu = chucvu;
    switch (chucVu) {
      case "sep":
        chucVu = "Sếp";
        break;
      case "truongPhong":
        chucVu = "Trường phòng";
        break;
      case "nhanVien":
        chucVu = "Nhân viên";
        break;
    }
    console.log(chucVu);
    content += `
    <tr>
    <td>${tknv}</td>
    <td>${name}</td>
    <td>${email}</td>
    <td>${datepicker}</td>
    <td>${chucVu}</td>
    <td>${newNhanVien.tinhTongLuong()}</td>
    <td>${newNhanVien.xepLoaiNhanVien()}</td>
    <td class="d-flex">
    <button onclick="editNhanVien('${tknv}')" id="btnSua" class="btn btn-warning ">Sửa</button>
    <button onclick="deleteNhanVien('${tknv}')" id="btnXoa" class="btn btn-danger">Xoá</button>
    </td>
    </tr>
    `;
  }
  document.getElementById("tableDanhSach").innerHTML = content;
}
// --------- THÊM NHÂN VIÊN | LƯU NHÂN VIÊN | RENDER NHÂN VIÊN ---------
document.getElementById("formQLNV").onsubmit = function (event) {
  event.preventDefault();
  let nhanVien = getValueNhanVien();
  if (nhanVien) {
    arrNhanVien.push(nhanVien);
    setLocalStorage("arrNhanVien", arrNhanVien);
    renderNhanVien(arrNhanVien);
    event.target.reset();
  }
};
// --------- WINDOW NHÂN VIÊN ---------
window.onload = function () {
  let dataLocal = getLocalStorage("arrNhanVien");
  if (dataLocal) {
    arrNhanVien = dataLocal;
    renderNhanVien(arrNhanVien);
  }
};

// --------- XOÁ NHÂN VIÊN ---------
function deleteNhanVien(taiKhoanNV) {
  let viTriNhanVienDelete = arrNhanVien.findIndex((item, index) => {
    return item.tknv == taiKhoanNV;
  }); // index | -1
  if (viTriNhanVienDelete != -1) {
    arrNhanVien.splice(viTriNhanVienDelete, 1);
    setLocalStorage("arrNhanVien", arrNhanVien);
    renderNhanVien(arrNhanVien);
  }
}
// --------- SỬA NHÂN VIÊN ---------
function editNhanVien(taiKhoanNV) {
  let nhanVienEdit = arrNhanVien.find((item, index) => {
    return item.tknv == taiKhoanNV;
  }); // item | null
  if (nhanVienEdit) {
    $("#myModal").modal("show");
    let arrField = document.querySelectorAll(
      "#formQLNV input, #formQLNV select"
    );
    for (let field of arrField) {
      field.value = nhanVienEdit[field.id];
      if (field.id == "tknv") {
        field.readOnly = true;
      }
    }
  }
}
// --------- UPDATE NHÂN VIÊN ---------
function updateNhanVien() {
  let nhanVien = getValueNhanVien();
  if (nhanVien) {
    let viTriNhanVienUpdate = arrNhanVien.findIndex((item, index) => {
      return item.tknv == nhanVien.tknv;
    }); // index | -1
    if (viTriNhanVienUpdate != -1) {
      arrNhanVien[viTriNhanVienUpdate] = nhanVien;
      setLocalStorage("arrNhanVien", arrNhanVien);
      renderNhanVien(arrNhanVien);
      document.getElementById("tknv").readOnly = false;
      document.getElementById("formQLNV").reset();
    }
  }
}
// --------- SEARCH NHÂN VIÊN (ONINPUT) ---------
// document.getElementById("searchName").oninput = function (event) {
//   let keyword = event.target.value.trim().toLowerCase();
//   let newKeyword = removeVietnameseTones(keyword);

//   let arrNhanVien2 = arrNhanVien.map((item) => {
//     let newNhanVien = new NhanVien();
//     return Object.assign(newNhanVien, item);
//   });
//   console.log(arrNhanVien2);

//   let arrSearch = arrNhanVien2.filter((item, index) => {
//     let xepLoaiNV = removeVietnameseTones(
//       item.xepLoaiNhanVien().trim().toLowerCase()
//     );
//     return xepLoaiNV.includes(newKeyword);
//   });
//   renderNhanVien(arrSearch);
// };
// --------- SEARCH NHÂN VIÊN (ONCLICK) ---------
function searchXepLoaiNV() {
  let keyword = document
    .getElementById("searchName")
    .value.trim()
    .toLowerCase();
  let newKeyword = removeVietnameseTones(keyword);

  let arrNhanVien2 = arrNhanVien.map((item) => {
    let newNhanVien = new NhanVien();
    return Object.assign(newNhanVien, item);
  });

  let arrSearch = arrNhanVien2.filter((item, index) => {
    let newXepLoaiNV = removeVietnameseTones(
      item.xepLoaiNhanVien().trim().toLowerCase()
    );
    return newXepLoaiNV.includes(newKeyword);
  });

  renderNhanVien(arrSearch);
}
