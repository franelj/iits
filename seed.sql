USE twinder;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE validatedEvents;
TRUNCATE events;
TRUNCATE rewards;
TRUNCATE users;
SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO users (`username`, `firstname`, `lastname`, `password`, `csusmid`, `status`, `points`) VALUES('user-1', 'john', 'doe', 'test', 0, 0, 0);
INSERT INTO users (`username`, `firstname`, `lastname`, `password`, `csusmid`, `status`, `points`) VALUES('admin', 'pat', 'smith', 'test', 0, 1, 4200);
INSERT INTO users (`username`, `firstname`, `lastname`, `password`, `csusmid`, `status`, `points`) VALUES('superadmin', 'toto', 'titi', 'test', 0, 1, 30);

INSERT INTO events (`name`, `description`, `points`, `date`) VALUES ('test-1', 'Test event 1', 100, NOW()), ('test-2', 'Test event 2', 200, NOW()),
('test-3', 'Test event 3', 300, NOW() + INTERVAL 1 DAY), ('test-4', 'Test event 4', 50, NOW() - INTERVAL 1 DAY), ('test-5', 'Test event 5', 110, NOW() + INTERVAL 2 DAY);

INSERT INTO rewards (`name`, `description`, `points`) VALUES('reward1', 'test reward 1', '50'), ('reward2', 'test reward 2', '100');

INSERT INTO validatedEvents (`userId`, `eventId`) VALUES (1, 1), (1, 3), (2, 2), (2, 4), (2, 1);