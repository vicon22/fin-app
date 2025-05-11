package io.scrooge.security;


import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import io.scrooge.data.user.User;
import io.scrooge.data.user.UserRepository;
import io.scrooge.services.user.IntegrationTest;
import java.util.UUID;
import java.util.random.RandomGenerator;
import lombok.SneakyThrows;
import org.apache.poi.util.StringUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.testcontainers.shaded.org.apache.commons.lang3.RandomStringUtils;

@SpringBootTest
@AutoConfigureMockMvc
class UserDetailsServiceImplTest extends IntegrationTest {

    @Autowired
    UserRepository userRepository;
    @Mock
    UserDetailsServiceImpl userDetailsService;

    @Test
    void loadUserByUsernameNotFoundTest() {
        String userName = RandomStringUtils.randomAlphanumeric(0);
        when(userDetailsService.loadUserByUsername(userName))
            .thenThrow(new UsernameNotFoundException("No user present with username: " + userName));
        assertThatThrownBy(() -> userDetailsService.loadUserByUsername(userName))
            .isInstanceOf(UsernameNotFoundException.class)
            .hasMessageContaining("No user present with username: " + userName);
    }
}