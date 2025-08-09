-- Add missing column for UI purposes
alter table public.companies add column if not exists name text;

-- Allow anon read for public demo data
drop policy if exists "Anon can read companies" on public.companies;
create policy "Anon can read companies"
  on public.companies
  for select
  to anon
  using (true);

-- Seed demo companies
insert into public.companies (kvk_nummer, name, rechtsvorm, hoofdvestiging_nr, sbi_codes, reg_date, status, vestigingen_count, total_emp, place, province, websites, non_mailing, source_raw)
values
('12345678','TechNova B.V.','Besloten Vennootschap','00001234', array['6201','6202'], '2016-04-12','actief',2,24,'Enschede','Overijssel', array['https://technova.example'], false, jsonb_build_object('note','seed')),
('23456789','DataForge VOF','Vennootschap onder firma','00002345', array['6311'], '2019-09-02','actief',1,12,'Hengelo','Overijssel', array['https://dataforge.example'], false, jsonb_build_object('note','seed')),
('34567890','CloudPeak Solutions','Besloten Vennootschap','00003456', array['6203'], '2013-01-22','actief',3,48,'Zwolle','Overijssel', array['https://cloudpeak.example'], true, jsonb_build_object('note','seed')),
('45678901','AutomateX','Eenmanszaak','00004567', array['7022'], '2021-06-15','actief',1,8,'Deventer','Overijssel', array['https://automatex.example'], false, jsonb_build_object('note','seed')),
('56789012','InsightWorks B.V.','Besloten Vennootschap','00005678', array['7490'], '2015-11-05','actief',2,33,'Apeldoorn','Gelderland', array['https://insightworks.example'], false, jsonb_build_object('note','seed')),
('67890123','NextGen Analytics','Besloten Vennootschap','00006789', array['6311','6209'], '2018-03-30','actief',1,18,'Utrecht','Utrecht', array['https://nextgen.example'], false, jsonb_build_object('note','seed')),
('78901234','BrightWare B.V.','Besloten Vennootschap','00007890', array['5829'], '2014-07-19','actief',2,27,'Amersfoort','Utrecht', array['https://brightware.example'], false, jsonb_build_object('note','seed')),
('89012345','Aether Labs','Besloten Vennootschap','00008901', array['7219'], '2017-02-08','actief',1,15,'Amsterdam','Noord-Holland', array['https://aetherlabs.example'], false, jsonb_build_object('note','seed'))
ON CONFLICT (kvk_nummer) DO NOTHING;