-- PART 1
CREATE TABLE IF NOT EXISTS team_colors (
    team_id integer,
    team_name character varying,
    primary_color character varying,
    primary_name character varying,
    secondary_color character varying,
    secondary_name character varying
)


-- PART 2
INSERT INTO team_colors (
    team_id, team_name, primary_color, primary_name, secondary_color, secondary_name
)

VALUES
(101,'Arizona Diamondbacks','#A71930','Sedona Red','#E3D4AD','Sonoran Sand'),
(102,'Atlanta Braves','#CE1141','Scarlet','#13274F','Navy Blue'),
(103,'Baltimore Orioles','#DF4601','Orange','#000000','Black'),
(104,'Boston Red Sox','#BD3039','Red','#0C2340','Blue'),
(105,'Chicago Cubs','#0E3386','Cubs Blue','#CC3433','Cubs Red'),
(106,'Chicago White Sox','#27251F','Black','#C4CED4','Silver'),
(107,'Cincinnati Reds','#C6011F','Red','#000000','Black'),
(108,'Cleveland Guardians','#E50022','Red','#00385D','Navy Blue'),
(109,'Colorado Rockies','#333366','Rockies Purple','#C4CED4','Silver'),
(110,'Detroit Tigers','#FA4616','Orange','#0C2340','Navy Blue'),
(111,'Houston Astros','#F4911E','Light Orange','#002D62','Navy Blue'),
(112,'Kansas City Royals','#004687','Royal Blue','#BD9B60','Gold'),
(113,'Los Angeles Angels','#862633','Maroon','#BA0021','Red'),
(114,'Los Angeles Dodgers','#005A9C','Dodger Blue','#A5ACAF','Silver'),
(115,'Miami Marlins','#00A3E0','Miami Blue','#EF3340','Caliente Red'),
(116,'Milwaukee Brewers','#FFC52F','Yellow','#12284B','Navy Blue'),
(117,'Minnesota Twins','#002B5C','Twins Navy Blue','#B9975B','Kasota Gold'),
(118,'New York Mets','#FF5910','Orange','#002D72','Blue'),
(119,'New York Yankees','#000000','Black','#C4CED3','Gray'),
(120,'Oakland Athletics','#003831','Green','#EFB21E','Gold'),
(121,'Philadelphia Phillies','#E81828','Red','#002D7','Blue'),
(122,'Pittsburgh Pirates','#27251F','Black','#FDB827','Yellow'),
(123,'San Diego Padres','#2F241D','Brown','#FFC425','Gold'),
(124,'San Francisco Giants','#FD5A1E','Orange','#EFD19F','Beige'),
(125,'Seattle Mariners','#005C5C','Northwest Green','#C4CED4','Silver'),
(126,'St Louis Cardinals','#C41E3A','Red','#0C2340','Navy Blue'),
(127,'Tampa Bay Rays','#8FBCE6','Columbia Blue','#F5D130','Yellow'),
(128,'Texas Rangers','#C0111F','Red','#003278','Blue'),
(129,'Toronto Blue Jays','#134A8E','Blue','#1D2D5C','Navy Blue'),
(130,'Washington Nationals','#AB0003','Red','#14225A','Navy Blue')

ON CONFLICT UPDATE

COMMIT;