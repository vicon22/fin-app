package io.scrooge.data.user;

import static org.junit.jupiter.api.Assertions.*;

import io.scrooge.services.user.IntegrationTest;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureMockMvc
class UserRepositoryTest extends IntegrationTest {

    @Autowired
    UserRepository userRepository;

    @Test
    void findByUsernameTest() {
        List<User> users = userRepository.findAll();

        users.forEach(
            u -> assertNotNull(u.getUsername())
        );
    }
}