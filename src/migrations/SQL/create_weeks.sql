CREATE TABLE IF NOT EXISTS schedule_weeks(
    week integer,
    start_date date,
    end_date date
)

INSERT INTO schedule_weeks (
    week, start_date, end_date
)
VALUES

(1,'2023-03-30','2023-04-09'),
(2,'2023-04-10','2023-04-16'),
(3,'2023-04-17','2023-04-23')
(4,'2023-04-24','2023-04-30'),
(5,'2023-05-01','2023-05-07'),
(6,'2023-05-08','2023-05-14'),
(7,'2023-05-15','2023-05-21'),
(8,'2023-05-22','2023-05-28'),
(9,'2023-05-29','2023-06-04'),
(10,'2023-06-05','2023-06-11'),
(11,'2023-06-12','2023-06-18'),
(12,'2023-06-19','2023-06-25'),
(13,'2023-06-26','2023-07-03'),
(14,'2023-07-04','2023-07-09'),
(15,'2023-07-14','2023-07-23'),
(16,'2023-07-24','2023-07-30'),
(17,'2023-07-31','2023-08-06'),
(18,'2023-08-07','2023-08-13'),
(19,'2023-08-14','2023-08-20'),
(20,'2023-08-21','2023-08-27'),
(21,'2023-08-28','2023-09-03'),
(22,'2023-09-04','2023-09-10'),
(23,'2023-09-11','2023-09-17'),
(24,'2023-09-18','2023-09-24'),
(25,'2023-09-25','2023-10-01')

ON CONFLICT UPDATE

COMMIT;