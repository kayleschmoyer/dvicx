import { sql, poolPromise } from '../database/sql';
import { WorkOrder } from '../models/workOrderModel';

export async function findByTechId(techId: number): Promise<WorkOrder[]> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('TechID', sql.Int, techId)
    .query(
      `SELECT ESTIMATE_NO, TECH_ID, VEH_YEAR, VEH_MAKE, VEH_MODEL, LICENSE, DATE, STATUS FROM ESTMTEHDR WHERE TECH_ID = @TechID`
    );

  return result.recordset.map((row: any) => ({
    estimateNo: row.ESTIMATE_NO,
    techId: row.TECH_ID,
    vehYear: row.VEH_YEAR,
    vehMake: row.VEH_MAKE,
    vehModel: row.VEH_MODEL,
    license: row.LICENSE,
    date: row.DATE,
    status: row.STATUS,
  }));
}
