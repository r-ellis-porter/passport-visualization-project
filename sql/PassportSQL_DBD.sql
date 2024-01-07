DROP TABLE IF EXISTS passport_index CASCADE;
DROP TABLE IF EXISTS country_code CASCADE;
DROP TABLE IF EXISTS country_passport_merge CASCADE;
DROP TABLE IF EXISTS continent_mapping CASCADE;


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

CREATE TABLE "continent_mapping" (
	"name" varchar(100) PRIMARY KEY NOT NULL UNIQUE,
	"alpha-2" varchar(100) NOT NULL,
	"alpha-3" varchar(100) NOT NULL,
	"country-code" varchar(100) NOT NULL,
	"iso-3166-2" varchar(100) NOT NULL,
	"region" varchar(100),
	"sub-region" varchar(100),
	"intermediate-region" varchar(100),
	"region-code" varchar(100),
	"sub-region-code" varchar(100),
	"intermediate-region-code" varchar(100)	
);

CREATE TABLE "country_boundaries_large" (
	
)

ALTER TABLE "passport_index" ADD CONSTRAINT "fk_passport_index_passport" FOREIGN KEY("passport")
REFERENCES "country_code" ("name");

ALTER TABLE "passport_index" ADD CONSTRAINT "fk_passport_index_destination" FOREIGN KEY("destination")
REFERENCES "country_code" ("name");

ALTER TABLE "country_passport_merge" ADD CONSTRAINT "fk_country_passport_merge_passport_code" FOREIGN KEY("passport_code")
REFERENCES "country_code" ("code");

ALTER TABLE "country_passport_merge" ADD CONSTRAINT "fk_country_passport_merge_destination_code" FOREIGN KEY("destination_code")
REFERENCES "country_code" ("code");

ALTER TABLE "continent_mapping" ADD CONSTRAINT "fk_continent_mapping_alpha-2" FOREIGN KEY("alpha-2")
REFERENCES "country_code" ("code");