package bzh.nos.service.impl;

import bzh.nos.domain.Todo;
import bzh.nos.repository.TodoRepository;
import bzh.nos.service.TodoService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Todo}.
 */
@Service
@Transactional
public class TodoServiceImpl implements TodoService {

    private final Logger log = LoggerFactory.getLogger(TodoServiceImpl.class);

    private final TodoRepository todoRepository;

    public TodoServiceImpl(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    public Todo save(Todo todo) {
        log.debug("Request to save Todo : {}", todo);
        return todoRepository.save(todo);
    }

    @Override
    public Todo update(Todo todo) {
        log.debug("Request to update Todo : {}", todo);
        return todoRepository.save(todo);
    }

    @Override
    public Optional<Todo> partialUpdate(Todo todo) {
        log.debug("Request to partially update Todo : {}", todo);

        return todoRepository
            .findById(todo.getId())
            .map(existingTodo -> {
                if (todo.getName() != null) {
                    existingTodo.setName(todo.getName());
                }
                if (todo.getContent() != null) {
                    existingTodo.setContent(todo.getContent());
                }
                if (todo.getDone() != null) {
                    existingTodo.setDone(todo.getDone());
                }

                return existingTodo;
            })
            .map(todoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Todo> findAll(Pageable pageable) {
        log.debug("Request to get all Todos");
        return todoRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Todo> findOne(Long id) {
        log.debug("Request to get Todo : {}", id);
        return todoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Todo : {}", id);
        todoRepository.deleteById(id);
    }
}
