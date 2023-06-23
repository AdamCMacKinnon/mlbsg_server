CREATE TABLE IF NOT EXISTS team_colors (
    team_name character varying,
    primary_color character varying,
    primary_name character varying,
    secondary_color character varying,
    secondary_name character varying
)

INSERT INTO team_colors (
    team_name, primary_color, primary_name, secondary_color, secondary_name
)

VALUES
('Arizona Diamondbacks','#A71930','Sedona Red','#E3D4AD','Sonoran Sand'),
('Atlanta Braves','#CE1141','Scarlet','#13274F','Navy Blue'),
('Baltimore Orioles','#DF4601','Orange','#000000','Black'),
('Boston Red Sox','#BD3039','Red','#0C2340','Blue'),
('Chicago Cubs','#0E3386','Cubs Blue','#CC3433','Cubs Red'),
('Chicago White Sox','#27251F','Black','#C4CED4','Silver'),
('Cincinnati Reds','#C6011F','Red','#000000','Black'),
('Cleveland Guardians','#E50022','Red','#00385D','Navy Blue'),
('Colorado Rockies','#333366','Rockies Purple','#C4CED4','Silver'),
('Detroit Tigers','#FA4616','Orange','#0C2340','Navy Blue'),
('Houston Astros','#F4911E','Light Orange','#002D62','Navy Blue'),
('Kansas City Royals','#004687','Royal Blue','#BD9B60','Gold'),
('Los Angeles Angels','#862633','Maroon','#BA0021','Red'),
('Los Angeles Dodgers','#005A9C','Dodger Blue','#A5ACAF','Silver'),
('Miami Marlins','#00A3E0','Miami Blue','#EF3340','Caliente Red'),
('Milwaukee Brewers','#FFC52F','Yellow','#12284B','Navy Blue'),
('Minnesota Twins','#002B5C','Twins Navy Blue','#B9975B','Kasota Gold'),
('New York Mets','#FF5910','Orange','#002D72','Blue'),
('New York Yankees','#000000','Black','#C4CED3','Gray'),
('Oakland Athletics','#003831','Green','#EFB21E','Gold'),
('Philadelphia Phillies','#E81828','Red','#002D7','Blue'),
('Pittsburgh Pirates','#27251F','Black','#FDB827','Yellow'),
('San Diego Padres','#2F241D','Brown','#FFC425','Gold'),
('San Francisco Giants','#FD5A1E','Orange','#EFD19F','Beige'),
('Seattle Mariners','#005C5C','Northwest Green','#C4CED4','Silver'),
('St Louis Cardinals','#C41E3A','Red','#0C2340','Navy Blue'),
('Tampa Bay Rays','#8FBCE6','Columbia Blue','#F5D130','Yellow'),
('Texas Rangers','#C0111F','Red','#003278','Blue'),
('Toronto Blue Jays','#134A8E','Blue','#1D2D5C','Navy Blue'),
('Washington Nationals','#AB0003','Red','#14225A','Navy Blue')

ON CONFLICT UPDATE

COMMIT;