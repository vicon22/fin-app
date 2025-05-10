package io.scrooge.services.transaction;

import io.scrooge.data.AbstractEntity;
import io.scrooge.data.bank.Bank;
import io.scrooge.data.category.TransactionCategory;
import io.scrooge.data.transaction.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.jpa.domain.Specification;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class TransactionServiceTest {

    @Mock
    private TransactionRepository repository;

    @InjectMocks
    private TransactionService transactionService;

    private List<Transaction> mockTransactions;
    private UUID projectId;
    private UUID categoryId;
    private UUID bankId1;
    private UUID bankId2;

    @BeforeEach
    void setUp() {
        mockTransactions = new ArrayList<>();
        projectId = UUID.randomUUID();
        categoryId = UUID.randomUUID();
        bankId1 = UUID.randomUUID();
        bankId2 = UUID.randomUUID();

        for (int i = 0; i < 10; i++) {
            Transaction transaction = new Transaction();
            
            transaction.setAmount(1000L + i * 100);
            transaction.setCategory_id(categoryId);
            
            TransactionType type = (i % 2 == 0) ? TransactionType.INCOME : TransactionType.EXPENSE;
            transaction.setType(type);
            
            TransactionState state;
            if (i < 3) {
                state = TransactionState.INITIAL;
            } else if (i < 5) {
                state = TransactionState.PENDING;
            } else if (i < 7) {
                state = TransactionState.FULFILLED;
            } else {
                state = TransactionState.APPROVED;
            }
            transaction.setState(state);
            
            UUID producerBankId = (i % 2 == 0) ? bankId1 : bankId2;
            transaction.setProducer_bank_id(producerBankId);
            
            if (i < 5) {
                UUID consumerBankId = (i % 2 == 0) ? bankId2 : bankId1;
                transaction.setConsumer_bank_id(consumerBankId);
            }
            
            LocalDate createdDate;
            if (i < 2) {
                createdDate = LocalDate.now().minusDays(3);
            } else if (i < 4) {
                createdDate = LocalDate.now().minusDays(20);
            } else if (i < 7) {
                createdDate = LocalDate.now().minusMonths(2);
            } else {
                createdDate = LocalDate.now().minusMonths(6);
            }
            transaction.setCreated(createdDate);
            
            mockTransactions.add(transaction);
        }
    }

    @Test
    void testListAllByProject() {
        when(repository.findAllByProjectId(projectId)).thenReturn(mockTransactions);

        List<Transaction> result = transactionService.listAllByProject(projectId);

        assertEquals(10, result.size());
        verify(repository).findAllByProjectId(projectId);
    }

    @Test
    void testTotalByProject() {
        when(repository.totalByProjectId(projectId)).thenReturn(10);

        int result = transactionService.totalByProject(projectId);

        assertEquals(10, result);
        verify(repository).totalByProjectId(projectId);
    }

    @Test
    void testGetSummaryByType() {
        when(repository.findAll(any(Specification.class))).thenReturn(mockTransactions);

        Map<TransactionType, Long> result = transactionService.getSummaryByType(null);

        assertEquals(2, result.size());
        assertTrue(result.containsKey(TransactionType.INCOME));
        assertTrue(result.containsKey(TransactionType.EXPENSE));
        
        long expectedIncome = 0;
        long expectedExpense = 0;
        
        for (Transaction t : mockTransactions) {
            if (t.getType() == TransactionType.INCOME) {
                expectedIncome += t.getAmount();
            } else {
                expectedExpense += t.getAmount();
            }
        }
        
        assertEquals(expectedIncome, result.get(TransactionType.INCOME));
        assertEquals(expectedExpense, result.get(TransactionType.EXPENSE));
        
        verify(repository).findAll(any(Specification.class));
    }

    @Test
    void testGetSummaryByState() {
        when(repository.findAll(any(Specification.class))).thenReturn(mockTransactions);

        Map<TransactionState, Integer> result = transactionService.getSummaryByState(null);

        assertEquals(4, result.size());
        assertEquals(3, result.get(TransactionState.INITIAL));
        assertEquals(2, result.get(TransactionState.PENDING));
        assertEquals(2, result.get(TransactionState.FULFILLED));
        assertEquals(3, result.get(TransactionState.APPROVED));
        
        verify(repository).findAll(any(Specification.class));
    }

    @Test
    void testGetSummaryByCategory() {
        when(repository.findAll(any(Specification.class))).thenReturn(mockTransactions);

        Map<UUID, HashMap<TransactionType, Long>> result = transactionService.getSummaryByCategory(null);

        assertEquals(1, result.size());
        assertTrue(result.containsKey(categoryId));
        
        HashMap<TransactionType, Long> categoryData = result.get(categoryId);
        assertEquals(2, categoryData.size());
        
        long expectedIncome = 0;
        long expectedExpense = 0;
        
        for (Transaction t : mockTransactions) {
            if (t.getType() == TransactionType.INCOME) {
                expectedIncome += t.getAmount();
            } else {
                expectedExpense += t.getAmount();
            }
        }
        
        assertEquals(expectedIncome, categoryData.get(TransactionType.INCOME));
        assertEquals(expectedExpense, categoryData.get(TransactionType.EXPENSE));
        
        verify(repository).findAll(any(Specification.class));
    }

    @Test
    void testGetSummaryByTime() {
        when(repository.findAll(any(Specification.class))).thenReturn(mockTransactions);

        Map<TransactionTime, Long> result = transactionService.getSummaryByTime(null, null);

        assertEquals(4, result.size());
        
        LocalDate oneWeekAgo = LocalDate.now().minusWeeks(1);
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        LocalDate oneQuarterAgo = LocalDate.now().minusMonths(3);
        
        long weekCount = mockTransactions.stream().filter(t -> t.getCreated().isAfter(oneWeekAgo)).count();
        long monthCount = mockTransactions.stream().filter(t -> t.getCreated().isAfter(oneMonthAgo)).count();
        long quarterCount = mockTransactions.stream().filter(t -> t.getCreated().isAfter(oneQuarterAgo)).count();
        
        assertEquals(weekCount, result.get(TransactionTime.WEEK));
        assertEquals(monthCount, result.get(TransactionTime.MONTH));
        assertEquals(quarterCount, result.get(TransactionTime.QUARTER));
        assertEquals((long)mockTransactions.size(), result.get(TransactionTime.YEAR));
        
        verify(repository).findAll(any(Specification.class));
        
        when(repository.findAll(any(Specification.class))).thenReturn(mockTransactions);
        Map<TransactionTime, Long> incomeResult = transactionService.getSummaryByTime(null, TransactionType.INCOME);
        
        List<Transaction> incomeTransactions = mockTransactions.stream()
            .filter(t -> t.getType() == TransactionType.INCOME)
            .toList();
        
        long incomeWeekCount = incomeTransactions.stream().filter(t -> t.getCreated().isAfter(oneWeekAgo)).count();
        long incomeMonthCount = incomeTransactions.stream().filter(t -> t.getCreated().isAfter(oneMonthAgo)).count();
        long incomeQuarterCount = incomeTransactions.stream().filter(t -> t.getCreated().isAfter(oneQuarterAgo)).count();
        
        assertEquals(incomeWeekCount, incomeResult.get(TransactionTime.WEEK));
        assertEquals(incomeMonthCount, incomeResult.get(TransactionTime.MONTH));
        assertEquals(incomeQuarterCount, incomeResult.get(TransactionTime.QUARTER));
        assertEquals((long)incomeTransactions.size(), incomeResult.get(TransactionTime.YEAR));
    }

    @Test
    void testGetSummaryByBank() {
        when(repository.findAll(any(Specification.class))).thenReturn(mockTransactions);

        for (Transaction transaction : mockTransactions) {
            Bank producerBank = mock(Bank.class);
            when(producerBank.getId()).thenReturn(transaction.getProducer_bank_id());
            transaction.setProducer_bank(producerBank);
            
            if (transaction.getConsumer_bank_id() != null) {
                Bank consumerBank = mock(Bank.class);
                when(consumerBank.getId()).thenReturn(transaction.getConsumer_bank_id());
                transaction.setConsumer_bank(consumerBank);
            }
        }

        Map<UUID, Map<String, Long>> result = transactionService.getSummaryByBank(null);

        assertEquals(2, result.size());
        assertTrue(result.containsKey(bankId1));
        assertTrue(result.containsKey(bankId2));
        
        long bank1ProducerSum = 0;
        long bank1ConsumerSum = 0;
        long bank2ProducerSum = 0;
        long bank2ConsumerSum = 0;
        
        for (Transaction t : mockTransactions) {
            if (bankId1.equals(t.getProducer_bank_id())) {
                bank1ProducerSum += t.getAmount();
            }
            if (bankId2.equals(t.getProducer_bank_id())) {
                bank2ProducerSum += t.getAmount();
            }
            if (bankId1.equals(t.getConsumer_bank_id())) {
                bank1ConsumerSum += t.getAmount();
            }
            if (bankId2.equals(t.getConsumer_bank_id())) {
                bank2ConsumerSum += t.getAmount();
            }
        }
        
        Map<String, Long> bank1Data = result.get(bankId1);
        Map<String, Long> bank2Data = result.get(bankId2);
        
        assertEquals(bank1ProducerSum, bank1Data.get("producer"));
        assertEquals(bank1ConsumerSum, bank1Data.get("consumer"));
        assertEquals(bank2ProducerSum, bank2Data.get("producer"));
        assertEquals(bank2ConsumerSum, bank2Data.get("consumer"));
        
        verify(repository).findAll(any(Specification.class));
    }

    @Test
    void testGetSummaryByTimeWithFilter() {
        when(repository.findAll(any(Specification.class))).thenReturn(mockTransactions.subList(0, 5));

        Map<TransactionTime, Long> result = transactionService.getSummaryByTime(null, null);

        LocalDate oneWeekAgo = LocalDate.now().minusWeeks(1);
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        LocalDate oneQuarterAgo = LocalDate.now().minusMonths(3);
        
        List<Transaction> filteredTransactions = mockTransactions.subList(0, 5);
        long weekCount = filteredTransactions.stream().filter(t -> t.getCreated().isAfter(oneWeekAgo)).count();
        long monthCount = filteredTransactions.stream().filter(t -> t.getCreated().isAfter(oneMonthAgo)).count();
        long quarterCount = filteredTransactions.stream().filter(t -> t.getCreated().isAfter(oneQuarterAgo)).count();
        
        assertEquals(weekCount, result.get(TransactionTime.WEEK));
        assertEquals(monthCount, result.get(TransactionTime.MONTH));
        assertEquals(quarterCount, result.get(TransactionTime.QUARTER));
        assertEquals((long)filteredTransactions.size(), result.get(TransactionTime.YEAR));
    }

    @Test
    void testDownloadReport() throws IOException {
        Transaction transaction = new Transaction();
        try {
            java.lang.reflect.Field idField = AbstractEntity.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(transaction, UUID.randomUUID());
        } catch (Exception e) {
            transaction = spy(transaction);
            when(transaction.getId()).thenReturn(UUID.randomUUID());
        }
        
        transaction.setAmount(1000L);
        transaction.setTitle("Test Transaction");
        transaction.setDetails("Test Details");
        transaction.setState(TransactionState.APPROVED);
        transaction.setType(TransactionType.INCOME);
        transaction.setLegal(TransactionLegal.LEGAL);
        transaction.setCreated(LocalDate.now());
        
        Bank bank = mock(Bank.class);
        when(bank.getName()).thenReturn("Test Bank");

        TransactionCategory category = mock(TransactionCategory.class);
        when(category.getTitle()).thenReturn("Test Category");
        
        transaction.setCategory(category);
        transaction.setProducer_bank(bank);
        
        List<Transaction> reportTransactions = Collections.singletonList(transaction);
        when(repository.findAll(any(Specification.class))).thenReturn(reportTransactions);

        byte[] result = transactionService.downloadReport(null);

        assertNotNull(result);
        assertTrue(result.length > 0);
        verify(repository).findAll(any(Specification.class));
    }
} 