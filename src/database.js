import mysqlConnection from 'mysql2/promise';

const properties = {
    host: "localhost",
    user: "root",
    password: "",
    database: "prot4_36317556",
};

export const pool = mysqlConnection.createPool(properties);