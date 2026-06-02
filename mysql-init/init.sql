CREATE TABLE IF NOT EXISTS nat_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    respondent VARCHAR(255) NOT NULL,
    age INT,
    sex VARCHAR(20),
    ethnic VARCHAR(100),
    academic_performance DECIMAL(5,2),
    academic_description VARCHAR(255),
    iq VARCHAR(50),
    type_school VARCHAR(50),
    socio_economic_status VARCHAR(100),
    study_habit VARCHAR(100),
    nat_results DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO nat_records (
    respondent,
    age,
    sex,
    ethnic,
    academic_performance,
    academic_description,
    iq,
    type_school,
    socio_economic_status,
    study_habit,
    nat_results
) VALUES (
    'Nemeno',
    10,
    'Male',
    'Iliganon',
    95,
    'Outstanding',
    'High',
    'Public',
    'On poverty line',
    'Excellent',
    92
);