class NhanVien {
  tknv = "";
  name = "";
  email = "";
  password = "";
  datepicker = "";
  luongCB = "";
  chucvu = "";
  gioLam = "";

  tinhTongLuong = function () {
    let tongLuong = 0;
    switch (this.chucvu) {
      case "sep":
        tongLuong = this.luongCB * 1 * 3;
        break;
      case "truongPhong":
        tongLuong = this.luongCB * 1 * 2;
        break;
      case "nhanVien":
        tongLuong = this.luongCB * 1 * 1;
        break;
    }
    return tongLuong;
  };

  xepLoaiNhanVien = function () {
    let xepLoaiNV = "";
    let gioLamNV = this.gioLam * 1;
    console.log(gioLamNV);
    if (gioLamNV < 160) {
      xepLoaiNV = "Nhân viên trung bình";
    } else if (160 <= gioLamNV && gioLamNV < 176) {
      xepLoaiNV = "Nhân viên khá";
    } else if (176 <= gioLamNV && gioLamNV < 192) {
      xepLoaiNV = "Nhân viên giỏi";
    } else if (gioLamNV >= 192) {
      xepLoaiNV = "Nhân viên xuất sắc";
    }
    return xepLoaiNV;
  };
}
