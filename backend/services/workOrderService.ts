import { sql, poolPromise } from '../database/sql';
import { WorkOrder } from '../models/workOrderModel';

export async function findByTechId(techId: number): Promise<WorkOrder[]> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('TechID', sql.Int, techId)
    .query(
      `SELECT ESTIMATE_NO, TECH_ID, FIRST_NAME, LAST_NAME, CAR_YEAR, VEH_MAKE, VEH_MODEL, ENGINE_TYPE, LIC_NUMBER, DATE, STATUS
       FROM ESTMTEHDR
       WHERE TECH_ID = @TechID AND STATUS NOT IN (4, 5)`
    );

  return result.recordset.map((row: any) => ({
    estimateNo: row.ESTIMATE_NO,
    techId: row.TECH_ID,
    firstName: row.FIRST_NAME,
    lastName: row.LAST_NAME,
    carYear: row.CAR_YEAR,
    vehMake: row.VEH_MAKE,
    vehModel: row.VEH_MODEL,
    engineType: row.ENGINE_TYPE,
    license: row.LIC_NUMBER,
    date: row.DATE,
    status: row.STATUS,
  }));
}
