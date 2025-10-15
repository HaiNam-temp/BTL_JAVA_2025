
docker image ls mysql:8.0
docker image rm <IMAGE_ID> --force
docker pull mysql:8.0
docker compose up --build
# shopapp (Backend)

Spring Boot backend cho Shopapp.

Tài liệu này hướng dẫn cách chạy ứng dụng trên máy local bằng Docker Compose (khuyến nghị) hoặc chạy trực tiếp bằng Maven. Có ví dụ lệnh cho PowerShell (Windows).

---

## Chuẩn bị
- Cài Docker Desktop (Windows) — WSL2 backend được khuyến nghị
- JDK 21 (nếu chạy mà không dùng Docker)
- Maven (không bắt buộc — repo có `mvnw`)
- (Tùy chọn) MySQL client nếu bạn muốn import SQL thủ công

---

## Chạy với Docker Compose (Khuyến nghị)

File liên quan:
- `docker-compose.yml` — cấu hình MySQL và app
- `.env.example` — ví dụ biến môi trường (sao chép thành `.env` và sửa)
- `db/schema_and_data.sql` — script tạo schema và dữ liệu mẫu (được mount vào thư mục init của MySQL)

1) Sao chép `.env.example` thành `.env` và chỉnh thông tin nếu cần:

```powershell
copy .env.example .env
# mở .env và chỉnh MYSQL_ROOT_PASSWORD, MYSQL_USER, MYSQL_PASSWORD, APP_PORT...
```

2) Khởi động stack:

```powershell
docker compose up --build
```

3) Dừng stack:

```powershell
docker compose down
```

Ghi chú:
- Lần chạy đầu MySQL sẽ thực thi các script trong `/docker-entrypoint-initdb.d/`. Compose đã mount `db/schema_and_data.sql` vào đó nên DB và dữ liệu mẫu sẽ tự tạo.
- Nếu container MySQL bị lỗi với thông báo `exec /usr/local/bin/docker-entrypoint.sh: exec format error`, xem phần Khắc phục bên dưới.

---

## Chạy bằng Maven (không dùng Docker)

1) Tạo database và import schema (nếu bạn không dùng MySQL trong Docker):

```powershell
mysql -u <username> -p < db\schema_and_data.sql
```

2) Chỉnh `src/main/resources/application.yml` hoặc biến môi trường để kết nối DB.

3) Build và chạy:

```powershell
.\mvnw.cmd clean package -DskipTests
java -jar target\shopapp-0.0.1-SNAPSHOT.jar
```

Hoặc chạy trực tiếp (dev):

```powershell
.\mvnw.cmd spring-boot:run
```

---

## Khắc phục lỗi (Docker / MySQL)

Triệu chứng:
- Log MySQL hiển thị `exec /usr/local/bin/docker-entrypoint.sh: exec format error` và container liên tục restart.

Nguyên nhân thường gặp và cách khắc phục:

1) Image cục bộ bị hỏng hoặc file entrypoint rỗng
- Kiểm tra nội dung entrypoint bên trong image (an toàn, chỉ đọc):

```powershell
docker run --rm --entrypoint sh mysql:8.0 -c "ls -l /usr/local/bin/docker-entrypoint.sh && sed -n '1,20p' /usr/local/bin/docker-entrypoint.sh || true"
```

Nếu file rỗng hoặc không đúng, xóa image cục bộ và tải lại:

```powershell
# dừng/gỡ container lỗi (nếu còn)
docker rm -f <shopapp-db-container-id>
# kiểm tra image id

docker image rm <IMAGE_ID> --force
# pull lại image
docker pull mysql:8.0
# khởi lại compose
docker compose up --build
```

2) Mount nhầm ghi đè entrypoint
- Đảm bảo bạn không mount file host lên `/usr/local/bin/docker-entrypoint.sh`. Compose hiện mount `./db/schema_and_data.sql` vào `/docker-entrypoint-initdb.d/` là chính xác.

3) Sai kiến trúc (hiếm gặp khi dùng Docker Desktop)
- Kiểm tra `docker version` để đảm bảo `Server OS/Arch` phù hợp (ví dụ `linux/amd64`). Nếu host là ARM và image là amd64, Docker Desktop có thể dùng emulation nhưng đôi khi gặp lỗi.

4) Antivirus hoặc vấn đề hệ thống file
- Trên Windows, một số chương trình bảo vệ có thể gây lỗi khi tải image; thử tắt/whitelist các thư mục Docker nếu nghi ngờ.

5) CRLF/LF hoặc quyền thực thi
- `exec format error` thường do file không phải là script thực thi hợp lệ hoặc binary sai kiến trúc, chứ ít khi do CRLF.

---

## Các lệnh hữu ích (PowerShell)

- Liệt kê container:
```powershell
docker ps -a
```

- Xem log container DB:
```powershell
docker logs <shopapp-db-container-id> --tail 200
```

- Kiểm tra mounts của container:
```powershell
docker inspect <shopapp-db-container-id> --format '{{json .Mounts}}' | Out-String
```

---

## Muốn tôi làm tiếp gì?
Tôi có thể:
- Tự thực hiện trong môi trường này: xóa container DB lỗi và image `mysql:8.0`, pull lại image, rồi chạy `docker compose up --build` và báo log chi tiết.
- Hoặc bạn gửi output của các lệnh: `docker logs <id> --tail 200`, `docker image ls mysql:8.0`, và kết quả kiểm tra entrypoint bằng `docker run --rm --entrypoint sh mysql:8.0 -c "sed -n '1,20p' /usr/local/bin/docker-entrypoint.sh || true"` để tôi phân tích.

Chọn cách bạn muốn, tôi sẽ tiếp tục.
