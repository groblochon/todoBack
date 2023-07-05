package bzh.nos.repository;

import bzh.nos.domain.Todo;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Todo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    @Query("select todo from Todo todo where todo.login.login = ?#{principal.username}")
    List<Todo> findByLoginIsCurrentUser();
}
