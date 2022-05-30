package com.joinit.config;

        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.context.annotation.Configuration;
        import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
        import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;

        import javax.persistence.EntityManager;
        import javax.persistence.metamodel.EntityType;
        import java.util.ArrayList;
        import java.util.List;
        import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public DataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        // get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // array of entity types
        List<Class> entityClasses = new ArrayList<>();

        // get the entity types for entities
        for(EntityType<?> tempEntityType : entities){
            entityClasses.add(tempEntityType.getJavaType());
        }

        // expose entity ids for the array of entity types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
