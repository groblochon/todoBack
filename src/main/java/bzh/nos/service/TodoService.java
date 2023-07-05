package bzh.nos.service;

import bzh.nos.domain.Todo;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Todo}.
 */
public interface TodoService {
    /**
     * Save a todo.
     *
     * @param todo the entity to save.
     * @return the persisted entity.
     */
    Todo save(Todo todo);

    /**
     * Updates a todo.
     *
     * @param todo the entity to update.
     * @return the persisted entity.
     */
    Todo update(Todo todo);

    /**
     * Partially updates a todo.
     *
     * @param todo the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Todo> partialUpdate(Todo todo);

    /**
     * Get all the todos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Todo> findAll(Pageable pageable);

    /**
     * Get the "id" todo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Todo> findOne(Long id);

    /**
     * Delete the "id" todo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
