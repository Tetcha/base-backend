CREATE TABLE
    IF NOT EXISTS Timesheets (
        id BIGSERIAL PRIMARY KEY,
        date DATE NOT NULL,
        is_approved BOOLEAN DEFAULT false,
        is_deleted BOOLEAN DEFAULT false,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS ProjectTypes (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS ResourceRoles (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS HardSkills (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS Departments (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS Users (
        id BIGSERIAL PRIMARY KEY,
        uuid VARCHAR NOT NULL UNIQUE,
        name VARCHAR(50) NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS Projects (
        id BIGSERIAL PRIMARY KEY,
        updated_by INT NOT NULL,
        creator_id INT NOT NULL,
        project_manager_id INT NOT NULL,
        project_types_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        code VARCHAR(50) NOT NULL,
        start_date DATE,
        end_date DATE,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        CONSTRAINT fk_Projects_Creator FOREIGN KEY(creator_id) REFERENCES Users(id),
        CONSTRAINT fk_Projects_ProjectsManager FOREIGN KEY(project_manager_id) REFERENCES Users(id),
        CONSTRAINT fk_Projects_ProjectTypes FOREIGN KEY(project_types_id) REFERENCES ProjectTypes(id)
    );

CREATE TABLE
    IF NOT EXISTS ProjectsAudit (
        id BIGSERIAL PRIMARY KEY,
        updated_by INT NOT NULL,
        creator_id INT NOT NULL,
        project_manager_id INT NOT NULL,
        projects_id INT NOT NULL,
        project_types_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        start_date DATE,
        end_date DATE,
        updated_at DATE NOT NULL,
        is_deleted BOOLEAN DEFAULT false
    );

CREATE TABLE
    IF NOT EXISTS Resources (
        id BIGSERIAL PRIMARY KEY,
        resource_roles_id INT NOT NULL,
        departments_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        uuid VARCHAR NOT NULL UNIQUE,
        code VARCHAR NOT NULL,
        remain_bandwidth DECIMAL NOT NULL,
        years_of_experience DECIMAL NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL,
        CONSTRAINT fk_ResourceRoles FOREIGN KEY(resource_roles_id) REFERENCES ResourceRoles(id),
        CONSTRAINT fk_Departments FOREIGN KEY(departments_id) REFERENCES Departments(id)
    );

CREATE TABLE
    IF NOT EXISTS Resources_HardSkills (
        id BIGSERIAL PRIMARY KEY,
        resources_id INT NOT NULL,
        hard_skills_id INT NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL,
        CONSTRAINT fk_HardSkills FOREIGN KEY(hard_skills_id) REFERENCES HardSkills(id),
        CONSTRAINT fk_Resources_HardSkills_Resources FOREIGN KEY(resources_id) REFERENCES Resources(id)
    );

CREATE TABLE
    IF NOT EXISTS Resources_Projects (
        id BIGSERIAL PRIMARY KEY,
        resources_id INT NOT NULL,
        projects_id INT NOT NULL,
        title VARCHAR(50) NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        bandwidth DECIMAL NOT NULL,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL,
        start_date DATE,
        end_date DATE,
        CONSTRAINT fk_Resources FOREIGN KEY(resources_id) REFERENCES Resources(id),
        CONSTRAINT fk_Projects FOREIGN KEY(projects_id) REFERENCES Projects(id)
    );

CREATE TABLE
    IF NOT EXISTS Timesheets_Resources_Projects (
        id BIGSERIAL PRIMARY KEY,
        resources_projects_id INT NOT NULL,
        timesheets_id INT NOT NULL,
        work_hour DECIMAL NOT NULL,
        is_approved BOOLEAN DEFAULT false,
        is_deleted BOOLEAN DEFAULT false,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL,
        CONSTRAINT fk_Resources_Projects FOREIGN KEY(resources_projects_id) REFERENCES Resources_Projects(id),
        CONSTRAINT fk_Timesheets FOREIGN KEY(timesheets_id) REFERENCES Timesheets(id)
    );

CREATE FUNCTION projectsaudit_trigger() RETURNS trigger AS $$ 
    BEGIN 
        IF TG_OP = 'UPDATE' 
        THEN INSERT INTO projectsaudit (
            updated_by, creator_id, project_manager_id, 
            projects_id, project_types_id, name, 
            start_date, end_date, updated_at, 
            is_deleted
        ) 
        VALUES (
            OLD.updated_by, OLD.creator_id, OLD.project_manager_id, 
            OLD.id, OLD.project_types_id, OLD.name, 
            OLD.start_date, OLD.end_date, OLD.updated_at, 
            OLD.is_deleted
        );
        RETURN NEW;
        END IF;
    END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;
CREATE TRIGGER t BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE projectsaudit_trigger();