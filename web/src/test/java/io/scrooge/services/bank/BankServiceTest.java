package io.scrooge.services.bank;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import io.scrooge.data.bank.Bank;
import io.scrooge.data.bank.BankRepository;
import io.scrooge.services.user.IntegrationTest;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@AutoConfigureMockMvc
class BankServiceTest extends IntegrationTest {

    @Autowired
    private BankRepository bankRepository;

    @Test
    void getAllTest() {

        List<Bank> banks = bankRepository.findAll();

        banks.forEach( bank -> assertNotNull(bank.getId()));
    }
}