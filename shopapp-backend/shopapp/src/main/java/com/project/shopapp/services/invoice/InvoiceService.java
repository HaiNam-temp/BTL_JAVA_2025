package com.project.shopapp.services.invoice;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Order;
import com.project.shopapp.models.OrderDetail;
import com.project.shopapp.models.User;
import com.project.shopapp.repositories.OrderDetailRepository; // Sẽ cần nếu OrderDetails là LAZY và không được fetch
import com.project.shopapp.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Quan trọng cho LAZY loading

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class InvoiceService implements IInvoiceService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository; // Inject nếu OrderDetails là LAZY

    // Đặt file font (ví dụ: NotoSans-Regular.ttf) vào src/main/resources/fonts/
    // Bạn có thể tải NotoSans từ Google Fonts: https://fonts.google.com/noto/specimen/Noto+Sans
    public static final String FONT_PATH = "fonts/NotoSans-VariableFont_wdth,wght.ttf";

    @Override
    @Transactional(readOnly = true) // Quan trọng để LAZY loading OrderDetails hoạt động
    public byte[] generateInvoicePdf(Long orderId) throws IOException, DataNotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new DataNotFoundException("Cannot find order with id: " + orderId));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        document.setMargins(30, 30, 30, 30);

        PdfFont font = null;
        try {
            InputStream fontStream = getClass().getClassLoader().getResourceAsStream(FONT_PATH);
            if (fontStream == null) {
                throw new IOException("Font file not found in classpath: " + FONT_PATH + ". Please ensure it's in 'src/main/resources/" + FONT_PATH + "'");
            }
            byte[] fontBytes = fontStream.readAllBytes();
            fontStream.close();
            font = PdfFontFactory.createFont(fontBytes, PdfFontFactory.EmbeddingStrategy.PREFER_EMBEDDED);
            document.setFont(font);
        } catch (IOException e) {
            System.err.println("Error loading font: " + e.getMessage() + ". Using default font. Vietnamese characters may not display correctly.");
            // Nếu không load được font, iText sẽ dùng font mặc định, tiếng Việt có thể lỗi
        }

        // 1. Tiêu đề hóa đơn
        Paragraph title = new Paragraph("HÓA ĐƠN BÁN HÀNG")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(20)
                .setBold();
        document.add(title);

        // 2. Thông tin cửa hàng (Bạn có thể thêm thông tin cửa hàng của mình ở đây)
        // Ví dụ:
        // Paragraph shopInfo = new Paragraph("Cửa hàng ABC\nĐịa chỉ: 123 Đường XYZ, Quận 1, TP.HCM\nSĐT: 0909123456")
        // .setTextAlignment(TextAlignment.LEFT)
        // .setFontSize(10);
        // document.add(shopInfo.setMarginBottom(10));


        // 3. Thông tin đơn hàng
        document.add(new Paragraph("Mã đơn hàng: #" + order.getId()).setMarginTop(15).setFontSize(12));
        if (order.getOrderDate() != null) {
            document.add(new Paragraph("Ngày đặt hàng: " + order.getOrderDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))).setFontSize(10));
        }

        // 4. Thông tin khách hàng
        document.add(new Paragraph("Thông tin khách hàng:").setMarginTop(15).setBold().setFontSize(12));
        // Ưu tiên thông tin trực tiếp trên Order (thông tin tại thời điểm đặt hàng)
        String customerName = order.getFullName(); //
        String customerAddress = order.getAddress(); //
        String customerPhone = order.getPhoneNumber(); //
        String customerEmail = order.getEmail(); //

        // Nếu thông tin trên Order không có, thử lấy từ User object
        if ((customerName == null || customerName.isEmpty()) && order.getUser() != null) {
            User user = order.getUser(); //
            customerName = user.getFullName(); //
            // customerAddress có thể vẫn là order.getAddress() vì đó là địa chỉ giao hàng
            if (customerPhone == null || customerPhone.isEmpty()) customerPhone = user.getPhoneNumber(); //
            if (customerEmail == null || customerEmail.isEmpty()) customerEmail = user.getEmail(); //
        }
        
        document.add(new Paragraph("Họ tên: " + (customerName != null ? customerName : "N/A")).setFontSize(10));
        document.add(new Paragraph("Địa chỉ: " + (customerAddress != null ? customerAddress : "N/A")).setFontSize(10));
        document.add(new Paragraph("Điện thoại: " + (customerPhone != null ? customerPhone : "N/A")).setFontSize(10));
        if (customerEmail != null && !customerEmail.isEmpty()) {
            document.add(new Paragraph("Email: " + customerEmail).setFontSize(10));
        }


        // 5. Bảng chi tiết sản phẩm
        document.add(new Paragraph("Chi tiết sản phẩm:").setMarginTop(15).setBold().setFontSize(12));
        // STT, Tên Sản Phẩm, Số Lượng, Đơn Giá, Thành Tiền
        float[] columnWidths = {0.5f, 4, 1, 2, 2}; 
        Table table = new Table(UnitValue.createPercentArray(columnWidths)).useAllAvailableWidth();
        table.setMarginTop(10);

        // Header của bảng
        table.addHeaderCell(new Cell().add(new Paragraph("STT").setBold().setFontSize(10).setTextAlignment(TextAlignment.CENTER)));
        table.addHeaderCell(new Cell().add(new Paragraph("Tên sản phẩm").setBold().setFontSize(10)));
        table.addHeaderCell(new Cell().add(new Paragraph("SL").setBold().setFontSize(10).setTextAlignment(TextAlignment.CENTER)));
        table.addHeaderCell(new Cell().add(new Paragraph("Đơn giá").setBold().setFontSize(10).setTextAlignment(TextAlignment.RIGHT)));
        table.addHeaderCell(new Cell().add(new Paragraph("Thành tiền").setBold().setFontSize(10).setTextAlignment(TextAlignment.RIGHT)));

        // Lấy OrderDetails.
        // Vì Order.orderDetails là LAZY, @Transactional(readOnly = true) ở đầu phương thức là cần thiết.
        List<OrderDetail> orderDetails = order.getOrderDetails(); //
        // Nếu bạn không muốn dùng @Transactional hoặc gặp vấn đề, bạn có thể fetch tường minh:
        // List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(orderId);


        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        int stt = 1;
        if (orderDetails != null) {
            for (OrderDetail detail : orderDetails) {
                table.addCell(new Cell().add(new Paragraph(String.valueOf(stt++)).setFontSize(10).setTextAlignment(TextAlignment.CENTER)));
                if (detail.getProduct() != null) {
                    table.addCell(new Cell().add(new Paragraph(detail.getProduct().getName()).setFontSize(10))); //
                } else {
                    table.addCell(new Cell().add(new Paragraph("Sản phẩm không xác định").setFontSize(10)));
                }
                table.addCell(new Cell().add(new Paragraph(String.valueOf(detail.getNumberOfProducts())).setFontSize(10).setTextAlignment(TextAlignment.CENTER))); //
                String priceFormatted = (detail.getPrice() != null) ? currencyFormatter.format(detail.getPrice()) : "N/A";
                table.addCell(new Cell().add(new Paragraph(priceFormatted).setFontSize(10).setTextAlignment(TextAlignment.RIGHT)));

                String totalMoneyFormatted = (order.getTotalMoney() != null) ? currencyFormatter.format(order.getTotalMoney()) : "N/A";
                table.addCell(new Cell().add(new Paragraph(totalMoneyFormatted).setFontSize(10).setTextAlignment(TextAlignment.RIGHT)));
            }
        }
        document.add(table);

        // 6. Tổng tiền
        if (order.getTotalMoney() != null) {
            // KIỂM TRA NULL TRƯỚC KHI FORMAT
            String grandTotalFormatted = currencyFormatter.format(order.getTotalMoney());
            document.add(new Paragraph("Tổng tiền thanh toán: " + grandTotalFormatted)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginTop(20)
                    .setBold()
                    .setFontSize(14));
        } else {
            document.add(new Paragraph("Tổng tiền thanh toán: N/A")
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginTop(20)
                    .setBold()
                    .setFontSize(14));
        }
        

        // 7. Chân trang (ví dụ)
        document.add(new Paragraph("Cảm ơn quý khách đã mua hàng!")
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(30)
                .setFontSize(10));
        document.add(new Paragraph("Hẹn gặp lại!")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10));


        document.close(); // Quan trọng: phải đóng document để ghi vào output stream
        return baos.toByteArray();
    }
}