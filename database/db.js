require('dotenv').config();

const { Pool, Client } = require('pg');
const {
  NODE_ENV,
  HOST,
  PORT,
  USER,
  PASSWORD,
  DATABASE,
  CA_CERT,
} = require('../config');

// pools will use environment variables
// for connection information

async function resetDb() {
  const connObj = {
    host: HOST,
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
  };

  if (NODE_ENV == 'production') {
    connObj.ssl = {
      ca: CA_CERT,
      rejectUnauthorized: true,
    };
  }

  console.log(connObj);
  const pool = await new Pool(connObj);
  // Reset DB if things get messy
  const queryRes = await pool.query(`
  DROP TABLE IF EXISTS Companies CASCADE;
  CREATE TABLE IF NOT EXISTS Companies (
    id SERIAL PRIMARY KEY,
    Name varchar(50) UNIQUE
  );
  DROP TABLE IF EXISTS PurchaseOrders CASCADE;
  CREATE TABLE IF NOT EXISTS PurchaseOrders (
    id SERIAL PRIMARY KEY,
    Number varchar(50),
    Name varchar(50),
    Value money,	
    CompanyId integer REFERENCES Companies,
    UNIQUE (Number, CompanyId)
  );
  DROP TABLE IF EXISTS LEMs CASCADE;
  CREATE TABLE IF NOT EXISTS LEMs (
    id SERIAL PRIMARY KEY,
    PurchaseOrderId integer REFERENCES PurchaseOrders,
    WorkDate date,
    Location varchar(50),
    Comments varchar(200)
  );
  DROP TABLE IF EXISTS LEMItems CASCADE;
  CREATE TABLE IF NOT EXISTS LEMItems (
    ItemCode varchar(50) PRIMARY KEY,
    Unit varchar(50),
    Rate money,
    Description varchar(50)
  );
  DROP TABLE IF EXISTS LEMRows CASCADE;
  CREATE TABLE IF NOT EXISTS LEMRows (
    id SERIAL PRIMARY KEY,
    LEMid integer REFERENCES LEMs,
    ItemCode varchar(50) REFERENCES LEMItems,
    WorkOrder varchar(50),
    Quantity integer,
    Comment varchar(50)
  );
  INSERT INTO Companies (Name) VALUES 
    ('ABC Energy'),
    ('DEF Group');
  INSERT INTO PurchaseOrders (Number, CompanyId, Name, Value) VALUES
    ('P00010', (SELECT id FROM Companies WHERE Name='ABC Energy'), 'Shutdown 2021', 2000000),
    ('P00011', (SELECT id FROM Companies WHERE Name='ABC Energy'), 'Maintenance 2021', 500000),
    ('12340000', (SELECT id FROM Companies WHERE Name='DEF Group'), 'General Labour 2021', 50000),
    ('12340001', (SELECT id FROM Companies WHERE Name='DEF Group'), 'General Materials 2021', 20000);
  INSERT INTO LEMItems (ItemCode, Unit, Rate, Description) VALUES
    ('GEN_LABR1','H',25.00,'General Labourer ST'),
    ('GEN_LABR2','H',37.50,'General Labourer OT'),
    ('SCF_APPR1','H',25.00,'Scaffolding Apprentice ST'),
    ('SCF_APPR2','H',37.50,'Scaffolding Apprentice OT'),
    ('SCF_JRNY1','H',42.00,'Scaffolding Journeyman ST'),
    ('SCF_JRNY2','H',63.00,'Scaffolding Journeyman OT'),
    ('PPF_APPR1','H',25.00,'Pipefitter Apprentice ST'),
    ('PPF_APPR2','H',37.50,'Pipefitter Apprentice OT'),
    ('PPF_JRNY1','H',42.00,'Pipefitter Journeyman ST'),
    ('PPF_JRNY2','H',63.00,'Pipefitter Journeyman OT'),
    ('ELEC_APPR1','H',25.00,'Electrician Apprentice ST'),
    ('ELEC_APPR2','H',37.50,'Electrician Apprentice OT'),
    ('ELEC_JRNY1','H',42.00,'Electrician Journeyman ST'),
    ('ELEC_JRNY2','H',63.00,'Electrician Journeyman OT'),
    ('GEN_FRM1','H',60.00,'General Foreman ST'),
    ('GEN_FRM2','H',90.00,'General Foreman OT'),
    ('GEN_MAT', 'EA',1.00,'General Material');
`);
  console.log(queryRes);
  pool.end();
  return queryRes;
}

resetDb();
