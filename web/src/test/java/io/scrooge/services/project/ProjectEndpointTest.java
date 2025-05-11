package io.scrooge.services.project;

import io.scrooge.data.AbstractEntity;
import io.scrooge.data.project.Project;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class ProjectEndpointTest {

    @Mock
    private ProjectService service;

    @InjectMocks
    private ProjectEndpoint projectEndpoint;

    private UUID userId;
    private UUID projectId;
    private UUID currencyId;
    private Project mockProject;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        projectId = UUID.randomUUID();
        currencyId = UUID.randomUUID();

        mockProject = new Project();
        try {
            Field idField = AbstractEntity.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(mockProject, projectId);
        } catch (Exception e) {
            mockProject = spy(mockProject);
            when(mockProject.getId()).thenReturn(projectId);
        }

        mockProject.setUser_id(userId);
        mockProject.setName("Test Project");
        mockProject.setCurrency_id(currencyId);
    }

    @Test
    void testCreateProject() {
        when(service.save(any(Project.class))).thenReturn(mockProject);

        Project result = projectEndpoint.createProject(userId, "Test Project", currencyId);

        assertNotNull(result);
        assertEquals(projectId, result.getId());
        assertEquals(userId, result.getUser_id());
        assertEquals("Test Project", result.getName());
        assertEquals(currencyId, result.getCurrency_id());

        verify(service).save(any(Project.class));
    }

    @Test
    void testGetProject_Success() {
        when(service.get(projectId)).thenReturn(Optional.of(mockProject));

        Optional<Project> result = projectEndpoint.getProject(userId, projectId);

        assertTrue(result.isPresent());
        assertEquals(projectId, result.get().getId());
        assertEquals(userId, result.get().getUser_id());
        assertEquals("Test Project", result.get().getName());

        verify(service).get(projectId);
    }

    @Test
    void testGetProject_Unauthorized() {
        UUID unauthorizedUserId = UUID.randomUUID();
        when(service.get(projectId)).thenReturn(Optional.of(mockProject));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> projectEndpoint.getProject(unauthorizedUserId, projectId));

        assertEquals("401 UNAUTHORIZED \"Permission denied\"", exception.getMessage());
        verify(service).get(projectId);
    }

    @Test
    void testGetProject_NotFound() {
        when(service.get(projectId)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> projectEndpoint.getProject(userId, projectId));

        assertEquals("404 NOT_FOUND \"Project not found\"", exception.getMessage());
        verify(service).get(projectId);
    }

    @Test
    void testGetProject_NullPointerException() {
        when(service.get(projectId)).thenThrow(new NullPointerException());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> projectEndpoint.getProject(userId, projectId));

        assertEquals("404 NOT_FOUND \"Project not found\"", exception.getMessage());
        verify(service).get(projectId);
    }

    @Test
    void testDeleteProject_Success() {
        when(service.get(projectId)).thenReturn(Optional.of(mockProject));
        doNothing().when(service).delete(projectId);

        assertDoesNotThrow(() -> projectEndpoint.deleteProject(userId, projectId));

        verify(service).get(projectId);
        verify(service).delete(projectId);
    }

    @Test
    void testDeleteProject_Unauthorized() {
        UUID unauthorizedUserId = UUID.randomUUID();
        when(service.get(projectId)).thenReturn(Optional.of(mockProject));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> projectEndpoint.deleteProject(unauthorizedUserId, projectId));

        assertEquals("401 UNAUTHORIZED \"Permission denied\"", exception.getMessage());
        verify(service).get(projectId);
        verify(service, never()).delete(projectId);
    }

    @Test
    void testDeleteProject_NotFound() {
        when(service.get(projectId)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> projectEndpoint.deleteProject(userId, projectId));

        assertEquals("404 NOT_FOUND \"Project not found\"", exception.getMessage());
        verify(service).get(projectId);
        verify(service, never()).delete(projectId);
    }
} 