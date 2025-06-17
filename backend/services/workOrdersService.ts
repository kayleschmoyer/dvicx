import { sql, poolPromise } from '../database/sql';
import { Estimate } from '../models/estimateModel';

export async function findByMechanicId(mechanicId: number): Promise<Estimate[]> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('mechanicId', sql.Int, mechanicId)
    .query(
      `SELECT ESTIMATE_NO, FIRST_NAME, LAST_NAME, CAR_YEAR, MAKE, MODEL, ENGINE_TYPE, LIC_NUMBER, STATUS, DATE
       FROM ESTMTEHDR WHERE TECH_ID = @mechanicId`
    );

  return result.recordset.map((row: any) => ({
    estimateNo: row.ESTIMATE_NO,
    firstName: row.FIRST_NAME,
    lastName: row.LAST_NAME,
    carYear: row.CAR_YEAR,
    make: row.MAKE,
    model: row.MODEL,
    engineType: row.ENGINE_TYPE,
    license: row.LIC_NUMBER,
    status: row.STATUS,
    date: row.DATE,
  }));
}
