CREATE TABLE IF NOT EXISTS game_data_rejects (
    game_pk integer,
    game_date date,
    week integer,
    season character varying,
    home_team character varying,
    away_team character varying,
    error_message character varying
)

COMMIT;