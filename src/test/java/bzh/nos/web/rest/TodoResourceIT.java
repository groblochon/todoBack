package bzh.nos.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bzh.nos.IntegrationTest;
import bzh.nos.domain.Todo;
import bzh.nos.repository.TodoRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TodoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TodoResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Boolean DEFAULT_DONE = false;
    private static final Boolean UPDATED_DONE = true;

    private static final String ENTITY_API_URL = "/api/todos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTodoMockMvc;

    private Todo todo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Todo createEntity(EntityManager em) {
        Todo todo = new Todo().name(DEFAULT_NAME).content(DEFAULT_CONTENT).done(DEFAULT_DONE);
        return todo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Todo createUpdatedEntity(EntityManager em) {
        Todo todo = new Todo().name(UPDATED_NAME).content(UPDATED_CONTENT).done(UPDATED_DONE);
        return todo;
    }

    @BeforeEach
    public void initTest() {
        todo = createEntity(em);
    }

    @Test
    @Transactional
    void createTodo() throws Exception {
        int databaseSizeBeforeCreate = todoRepository.findAll().size();
        // Create the Todo
        restTodoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todo)))
            .andExpect(status().isCreated());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeCreate + 1);
        Todo testTodo = todoList.get(todoList.size() - 1);
        assertThat(testTodo.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTodo.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testTodo.getDone()).isEqualTo(DEFAULT_DONE);
    }

    @Test
    @Transactional
    void createTodoWithExistingId() throws Exception {
        // Create the Todo with an existing ID
        todo.setId(1L);

        int databaseSizeBeforeCreate = todoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTodoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todo)))
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = todoRepository.findAll().size();
        // set the field null
        todo.setName(null);

        // Create the Todo, which fails.

        restTodoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todo)))
            .andExpect(status().isBadRequest());

        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTodos() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        // Get all the todoList
        restTodoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todo.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].done").value(hasItem(DEFAULT_DONE.booleanValue())));
    }

    @Test
    @Transactional
    void getTodo() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        // Get the todo
        restTodoMockMvc
            .perform(get(ENTITY_API_URL_ID, todo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(todo.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.done").value(DEFAULT_DONE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingTodo() throws Exception {
        // Get the todo
        restTodoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTodo() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        int databaseSizeBeforeUpdate = todoRepository.findAll().size();

        // Update the todo
        Todo updatedTodo = todoRepository.findById(todo.getId()).get();
        // Disconnect from session so that the updates on updatedTodo are not directly saved in db
        em.detach(updatedTodo);
        updatedTodo.name(UPDATED_NAME).content(UPDATED_CONTENT).done(UPDATED_DONE);

        restTodoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTodo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTodo))
            )
            .andExpect(status().isOk());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        Todo testTodo = todoList.get(todoList.size() - 1);
        assertThat(testTodo.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTodo.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testTodo.getDone()).isEqualTo(UPDATED_DONE);
    }

    @Test
    @Transactional
    void putNonExistingTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        todo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, todo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        todo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        todo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTodoWithPatch() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        int databaseSizeBeforeUpdate = todoRepository.findAll().size();

        // Update the todo using partial update
        Todo partialUpdatedTodo = new Todo();
        partialUpdatedTodo.setId(todo.getId());

        partialUpdatedTodo.content(UPDATED_CONTENT).done(UPDATED_DONE);

        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodo))
            )
            .andExpect(status().isOk());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        Todo testTodo = todoList.get(todoList.size() - 1);
        assertThat(testTodo.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTodo.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testTodo.getDone()).isEqualTo(UPDATED_DONE);
    }

    @Test
    @Transactional
    void fullUpdateTodoWithPatch() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        int databaseSizeBeforeUpdate = todoRepository.findAll().size();

        // Update the todo using partial update
        Todo partialUpdatedTodo = new Todo();
        partialUpdatedTodo.setId(todo.getId());

        partialUpdatedTodo.name(UPDATED_NAME).content(UPDATED_CONTENT).done(UPDATED_DONE);

        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodo))
            )
            .andExpect(status().isOk());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        Todo testTodo = todoList.get(todoList.size() - 1);
        assertThat(testTodo.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTodo.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testTodo.getDone()).isEqualTo(UPDATED_DONE);
    }

    @Test
    @Transactional
    void patchNonExistingTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        todo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, todo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        todo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        todo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(todo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTodo() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        int databaseSizeBeforeDelete = todoRepository.findAll().size();

        // Delete the todo
        restTodoMockMvc
            .perform(delete(ENTITY_API_URL_ID, todo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
