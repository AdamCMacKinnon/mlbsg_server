CREATE TABLE IF NOT EXISTS schedule_weeks(
    week integer,
    start_date date,
    end_date date
)

INSERT INTO schedule_weeks (
    week, start_date, end_date
)
VALUES


(1,'2023-07-24','2023-07-30'),
(2,'2023-07-31','2023-08-06'),
(3,'2023-08-07','2023-08-13'),
(4,'2023-08-14','2023-08-20'),
(5,'2023-08-21','2023-08-27'),
(6,'2023-08-28','2023-09-03'),
(7,'2023-09-04','2023-09-10'),
(8,'2023-09-11','2023-09-17'),
(9,'2023-09-18','2023-09-24'),
(10,'2023-09-25','2023-10-01')

ON CONFLICT UPDATE

COMMIT;
