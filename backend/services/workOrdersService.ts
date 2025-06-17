import { sql, poolPromise } from '../database/sql';
import { Estimate } from '../models/estimateModel';

export async function findByMechanicId(mechanicId: number): Promise<Estimate[]> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('mechanicId', sql.Int, mechanicId)
    .query(
      'SELECT WORK_ORDER_ID, YEAR, MAKE, MODEL, LICENSE, STATUS, DATE FROM ESTMTEHDR WHERE TECH_ID = @mechanicId'
    );

  return result.recordset.map((row: any) => ({
    workOrderId: row.WORK_ORDER_ID,
    year: row.YEAR,
    make: row.MAKE,
    model: row.MODEL,
    license: row.LICENSE,
    status: row.STATUS,
    date: row.DATE,
  }));
}
