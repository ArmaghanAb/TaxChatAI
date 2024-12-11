USE auditdb;
CREATE TABLE PromptsAndResponses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM PromptsAndResponses;

