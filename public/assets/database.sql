CREATE TABLE anagraphics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(35) NOT NULL,
  surname VARCHAR(35) NOT NULL,
  email VARCHAR(35),
  phone_number VARCHAR(35),
  city_name VARCHAR(35) NOT NULL,
  way_name VARCHAR(35) NOT NULL,
  way_number VARCHAR(10) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE
);