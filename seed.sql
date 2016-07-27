USE twinder;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE validatedEvents;
TRUNCATE events;
TRUNCATE rewards;
TRUNCATE users;
SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO users VALUES('', 'user-1', 'test', 0, 0, 0);
INSERT INTO users VALUES('', 'admin', 'test', 0, 0, 0);
INSERT INTO users VALUES('', 'superadmin', 'test', 0, 0, 0);

INSERT INTO events VALUES('', 'test-1', 'Test event 1', '100');
INSERT INTO events VALUES('', 'test-2', 'Test event 2', '200');
INSERT INTO events VALUES('', 'test-3', 'Test event 3', '300');
INSERT INTO events VALUES('', 'test-4', 'Test event 4', '50');
INSERT INTO events VALUES('', 'test-5', 'Test event 5', '110');

INSERT INTO rewards VALUES('', 'reward1', 'test reward 1', '50');
INSERT INTO rewards VALUES('', 'reward2', 'test reward 2', '100');