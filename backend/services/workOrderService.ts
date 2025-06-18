import { sql, poolPromise } from '../database/sql';
import { Estimate } from '../models/estimateModel';

export async function findByMechanicId(mechanicId: number): Promise<Estimate[]> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('mechanicId', sql.Int, mechanicId)
    .query(`
      SELECT ESTIMATE_NUMBER, ESTIMATOR_NUMBER, FIRST_NAME, LAST_NAME, CAR_YEAR, MAKE, MODEL, ENGINE_TYPE, LIC_NUMBER, DATESTAMP, STATUS
      FROM ESTMTEHDR
      WHERE ESTIMATOR_NUMBER = @mechanicId AND STATUS NOT IN (4, 5)
    `);

  return result.recordset.map((row: any) => ({
    estimateNo: row.ESTIMATE_NUMBER,
    techId: row.ESTIMATOR_NUMBER,
    firstName: row.FIRST_NAME,
    lastName: row.LAST_NAME,
    carYear: row.CAR_YEAR,
    engineType: row.ENGINE_TYPE,
    license: row.LIC_NUMBER,
    date: row.DATESTAMP,
    status: row.STATUS,
    make: row.MAKE,
    model: row.MODEL,
  }));
}
