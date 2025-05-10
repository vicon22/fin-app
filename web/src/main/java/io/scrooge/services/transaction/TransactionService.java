package io.scrooge.services.transaction;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import com.vaadin.hilla.crud.JpaFilterConverter;
import com.vaadin.hilla.crud.filter.Filter;
import io.scrooge.data.transaction.Transaction;
import io.scrooge.data.transaction.TransactionRepository;
import io.scrooge.data.transaction.TransactionState;
import io.scrooge.data.transaction.TransactionType;
import io.scrooge.data.transaction.dto.FlowCategoryCurrencySum;
import io.scrooge.data.transaction.dto.FlowCategorySum;
import jakarta.annotation.security.RolesAllowed;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class TransactionService extends CrudRepositoryService<Transaction, UUID, TransactionRepository> {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<Transaction> listAllByProject(UUID projectId) {
        return this.repository.findAllByProjectId(projectId);
    }

    public int totalByProject(UUID projectId) {
        return this.repository.totalByProjectId(projectId);
    }

    public List<FlowCategoryCurrencySum> totalByUser(UUID userId) {
        return this.repository.totalByUserIdByCategories(userId);
    }

    public List<FlowCategorySum> totalByProjectByCategories(UUID projectId) {
        return this.repository.totalByProjectIdByCategories(projectId);
    }

    private Specification getFilterSpec(Filter filter) {
        return filter != null
                ? JpaFilterConverter.toSpec(filter, Transaction.class)
                : Specification.anyOf();
    }

    public Map<TransactionType, Long> getSummaryByType(Filter filter) {
        var items = this.repository.findAll(this.getFilterSpec(filter));
        var result = new HashMap<TransactionType, Long>();

        for (var item : items) {
            var elem = (Transaction)item;
            var type = elem.getType();

            if (!result.containsKey(type)) {
                result.put(type, 0l);
            }

            result.put(type, result.get(type) + elem.getAmount());
        }

        return result;
    }

    public Map<TransactionState, Integer> getSummaryByState(Filter filter) {
        var items = this.repository.findAll(this.getFilterSpec(filter));
        var result = new HashMap<TransactionState, Integer>();

        for (var item : items) {
            var elem = (Transaction)item;
            var state = elem.getState();

            if (!result.containsKey(state)) {
                result.put(state, 0);
            }

            result.put(state, result.get(state) + 1);
        }

        return result;
    }

    public Map<UUID, HashMap<TransactionType, Long>> getSummaryByCategory(Filter filter) {
        var items = this.repository.findAll(this.getFilterSpec(filter));
        var result = new HashMap<UUID, HashMap<TransactionType, Long>>();

        for (var item : items) {
            var elem = (Transaction)item;
            var catId = elem.getCategory_id();
            var type = elem.getType();

            if (!result.containsKey(catId)) {
                result.put(catId, new HashMap<>() {{
                    put(TransactionType.EXPENSE, 0l);
                    put(TransactionType.INCOME, 0l);
                }});
            }

            var unit = result.get(catId);

            unit.put(type, unit.get(type) + elem.getAmount());
            result.put(catId, unit);
        }

        return result;
    }

    public byte[] downloadReport(Filter filter) throws IOException {

        List<Transaction> transactions = this.repository.findAll(this.getFilterSpec(filter));

        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("Report");

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("ID");
        headerRow.createCell(1).setCellValue("Amount");
        headerRow.createCell(2).setCellValue("Category");
        headerRow.createCell(3).setCellValue("Producer Bank");
        headerRow.createCell(4).setCellValue("Consumer Bank");
        headerRow.createCell(5).setCellValue("Title");
        headerRow.createCell(6).setCellValue("Details");
        headerRow.createCell(7).setCellValue("State");
        headerRow.createCell(8).setCellValue("Type");
        headerRow.createCell(9).setCellValue("Legal Type");
        headerRow.createCell(10).setCellValue("Producer Account");
        headerRow.createCell(11).setCellValue("Consumer Account");
        headerRow.createCell(12).setCellValue("Consumer TIN");
        headerRow.createCell(13).setCellValue("Consumer Tel");
        headerRow.createCell(14).setCellValue("Created");

        // Заполнение строк данными
        int rowNum = 1;
        for (Transaction transaction : transactions) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(transaction.getId().toString());
            row.createCell(1).setCellValue(transaction.getAmount());
            row.createCell(2).setCellValue(transaction.getCategory() != null ? transaction.getCategory().getTitle() : "N/A");
            row.createCell(3).setCellValue(transaction.getProducer_bank() != null ? transaction.getProducer_bank().getName() : "N/A");
            row.createCell(4).setCellValue(transaction.getConsumer_bank() != null ? transaction.getConsumer_bank().getName() : "N/A");
            row.createCell(5).setCellValue(transaction.getTitle());
            row.createCell(6).setCellValue(transaction.getDetails());
            row.createCell(7).setCellValue(transaction.getState() != null ? transaction.getState().toString() : "N/A");
            row.createCell(8).setCellValue(transaction.getType() != null ? transaction.getType().toString() : "N/A");
            row.createCell(9).setCellValue(transaction.getLegal() != null ? transaction.getLegal().toString() : "N/A");
            row.createCell(10).setCellValue(transaction.getProducer_account());
            row.createCell(11).setCellValue(transaction.getConsumer_account());
            row.createCell(12).setCellValue(transaction.getConsumer_tin());
            row.createCell(13).setCellValue(transaction.getConsumer_tel());
            row.createCell(14).setCellValue(transaction.getCreated() != null ? transaction.getCreated().toString() : "N/A");
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        workbook.write(byteArrayOutputStream);
        workbook.close();

        return byteArrayOutputStream.toByteArray();
    }
}
