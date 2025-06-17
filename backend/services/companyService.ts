import { sql, poolPromise } from '../database/sql';

export async function list(): Promise<number[]> {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT COMPANY_NUMBER FROM COMPANY');
  return result.recordset.map((row: any) => row.COMPANY_NUMBER);
}
