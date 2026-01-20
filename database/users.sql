DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

-- Create index for faster queries
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- Insert test users (passwords: user123 and admin123 bcrypted)
INSERT INTO users (username, email, password, role) VALUES
('user1', 'user1@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'user'),
('admin1', 'admin@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'admin'),
('user2', 'user2@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'user'),
('user3', 'user3@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'user'),
('admin2', 'admin2@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'admin'),
('user4', 'user4@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'user'),
('user5', 'user5@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'user'),
('admin3', 'admin3@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'admin'),
('user6', 'user6@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'user'),
('user7', 'user7@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'user'),
('admin4', 'admin4@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'admin'),
('user8', 'user8@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'user'),
('user9', 'user9@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'user'),
('admin5', 'admin5@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'admin'),
('user10', 'user10@example.com', '$2a$10$Y9u7nL.sZ9p5uZ5nL.sZ9e7nL.sZ9p5uZ5nL.sZ9p5uZ5nL.sZ9eS', 'user');

