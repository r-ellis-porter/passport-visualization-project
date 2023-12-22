-- Adding new column "visafree_days" to table 'country_passport_merge' 
--and updating column values with number of visafree days in column 'requirement' with value "visa free"

--***********--
--to check if tables are populated with correct data
-- SELECT * FROM country_code;
-- SELECT * FROM country_passport_merge;
-- SELECT * FROM passport_index;
--***********--



ALTER TABLE country_passport_merge 
ADD visafree_days varchar(100);

SELECT * FROM country_passport_merge
WHERE visafree_days = '28';

UPDATE country_passport_merge
SET visafree_days = requirement
WHERE requirement in ('21', '90', '30', '180', '28', '360', '14', '60', '42', '15', '240', '120',  '10', '45', '7', '31');

UPDATE country_passport_merge
SET requirement = 'visa free'
WHERE requirement in ('21', '90', '30', '180', '28', '360', '14', '60', '42', '15', '240', '120',  '10', '45', '7', '31');
