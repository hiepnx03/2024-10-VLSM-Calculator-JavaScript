# Cấu Hình Mạng với Cisco Packet Tracer

## Giới Thiệu
Dự án này hướng dẫn cách sử dụng Cisco Packet Tracer để thiết lập và cấu hình mạng, bao gồm chia mạng con bằng VLSM (Variable Length Subnet Mask) và sử dụng subnet mask hợp lý. Mục tiêu của dự án là giúp người học nắm vững cách thiết kế mạng tối ưu và hiệu quả.

## Yêu Cầu Hệ Thống
- Cisco Packet Tracer (Phiên bản 7.3 trở lên được khuyến nghị)
- Kiến thức cơ bản về mạng máy tính và mô hình OSI
- Hiểu biết về địa chỉ IPv4 và subnetting

## Nội Dung Chính
### 1. Chia Mạng Bằng VLSM
VLSM cho phép sử dụng địa chỉ IP một cách linh hoạt và tối ưu bằng cách phân bổ subnet mask phù hợp cho từng mạng con. Dưới đây là các bước thực hiện:
1. Xác định số lượng host cho từng subnet.
2. Sắp xếp subnet theo số lượng host từ lớn đến nhỏ.
3. Chọn subnet mask phù hợp.
4. Gán địa chỉ IP cho các subnet theo thứ tự.
5. Cấu hình địa chỉ IP trên thiết bị trong Cisco Packet Tracer.

Ví dụ:
- Mạng chính: `192.168.1.0/24`
- Yêu cầu chia thành 3 subnet với số lượng host: 50, 30, 10
- Áp dụng VLSM:
  - `192.168.1.0/26` (62 host, subnet mask: `255.255.255.192`)
  - `192.168.1.64/27` (30 host, subnet mask: `255.255.255.224`)
  - `192.168.1.96/28` (14 host, subnet mask: `255.255.255.240`)

### 2. Cấu Hình Mạng trong Cisco Packet Tracer
#### a. Thiết lập Môi Trường Mạng
1. Thêm các thiết bị (PC, Router, Switch) vào môi trường Packet Tracer.
2. Kết nối các thiết bị bằng dây cáp phù hợp (Copper Straight-through, Cross-over).

#### b. Cấu Hình IP Cho Thiết Bị
**Cấu hình địa chỉ IP trên Router:**
```bash
Router> enable
Router# configure terminal
Router(config)# interface FastEthernet0/0
Router(config-if)# ip address 192.168.1.1 255.255.255.192
Router(config-if)# no shutdown
Router(config-if)# exit
```

**Cấu hình địa chỉ IP trên PC:**
1. Chọn PC → Desktop → IP Configuration
2. Nhập địa chỉ IP và subnet mask tương ứng

### 3. Kiểm Tra Kết Nối Mạng
Sử dụng lệnh `ping` để kiểm tra kết nối giữa các thiết bị:
```bash
PC> ping 192.168.1.1
```
Nếu có phản hồi từ router, tức là mạng đã được cấu hình đúng.

## Video Hưỡng Dẫn
- [Video Hưỡng Dẫn VLSM , Cấu Hình Cisco Gõ Lệnh Ít](https://www.youtube.com/watch?v=VL7QSnnei24&list=PLGw1zpyNKaFs-YHqJVmlspz-uT64lcKjB&ab_channel=Nguy%E1%BB%85nXu%C3%A2nHi%E1%BB%87pOfficial)


## Kết Luận
Dự án này cung cấp hướng dẫn cơ bản về cấu hình mạng trong Cisco Packet Tracer, tập trung vào chia subnet với VLSM và thiết lập IP cho các thiết bị. Việc thực hành thường xuyên sẽ giúp bạn hiểu rõ hơn về quản trị mạng và tối ưu hóa tài nguyên IP.

## Tài Nguyên Tham Khảo
- [Cisco Packet Tracer Official Guide](https://www.netacad.com/)
- [Subnet Calculator](https://www.subnet-calculator.com/)
