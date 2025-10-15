package com.project.shopapp.services.invoice;

import com.project.shopapp.exceptions.DataNotFoundException;
import java.io.IOException;

public interface IInvoiceService {
    byte[] generateInvoicePdf(Long orderId) throws IOException, DataNotFoundException;
}