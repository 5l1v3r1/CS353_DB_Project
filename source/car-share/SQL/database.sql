CREATE TABLE "USER" (
  ID        INT NOT NULL,
  email     TEXT NOT NULL,
  password  TEXT NOT NULL,
  fname     TEXT NOT NULL,
  lname     TEXT NOT NULL,
  phone_num TEXT NOT NULL,
  age       INT NOT NULL,
  rating    NUMERIC,
  member_since  TEXT NOT NULL,
  gender    TEXT NOT NULL,
  car_license_plate TEXT,
  bank_account TEXT,
  smokes     SMALLINT,
  chattiness SMALLINT,
  PRIMARY KEY (ID)
);


CREATE TABLE "CARD" (
  owner_id    INT NOT NULL,
  card_number TEXT NOT NULL,
  cvc2        TEXT NOT NULL,
  expr_date   DATE NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES "USER"(ID),
  PRIMARY KEY (owner_id, card_number, cvc2, expr_date)
);


CREATE TABLE "CAR" (
  owner_id  INT NOT NULL,
  model     TEXT NOT NULL,
  brand     TEXT NOT NULL,
  color     TEXT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES "USER"(ID),
  PRIMARY KEY (owner_id, model, brand, color)
);


CREATE TABLE "RATING" (
  reviewer_ID INT NOT NULL,
  reviewed_ID INT NOT NULL,
  rating      INT NOT NULL,
  FOREIGN KEY (reviewed_ID) REFERENCES "USER"(ID),
  PRIMARY KEY (reviewer_ID)
);