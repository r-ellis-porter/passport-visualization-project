-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/6QknxG
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

DROP TABLE IF EXISTS passport_index CASCADE;
DROP TABLE IF EXISTS country_code CASCADE;
DROP TABLE IF EXISTS country_passport_merge CASCADE;


CREATE TABLE "country_code" (
    "name" varchar(100) PRIMARY KEY NOT NULL UNIQUE,
    "code" varchar(100)  NOT NULL UNIQUE
    
);


CREATE TABLE "passport_index" (
    "passport" varchar(100)   NOT NULL,
    "destination" varchar(100)   NOT NULL,
    "requirement" varchar(100)   NOT NULL,
	PRIMARY KEY (passport,destination)
);



CREATE TABLE "country_passport_merge" (
    "passport" varchar(100)   NOT NULL,
    "passport_code" varchar(100)   NOT NULL,
    "destination" varchar(100)   NOT NULL,
    "destination_code" varchar(100)   NOT NULL,
    "requirement" varchar(100)   NOT NULL,
	PRIMARY KEY (passport,destination)
);


ALTER TABLE "passport_index" ADD CONSTRAINT "fk_passport_index_passport" FOREIGN KEY("passport")
REFERENCES "country_code" ("name");

ALTER TABLE "passport_index" ADD CONSTRAINT "fk_passport_index_destination" FOREIGN KEY("destination")
REFERENCES "country_code" ("name");

ALTER TABLE "country_passport_merge" ADD CONSTRAINT "fk_country_passport_merge_passport_code" FOREIGN KEY("passport_code")
REFERENCES "country_code" ("code");

ALTER TABLE "country_passport_merge" ADD CONSTRAINT "fk_country_passport_merge_destination_code" FOREIGN KEY("destination_code")
REFERENCES "country_code" ("code");

