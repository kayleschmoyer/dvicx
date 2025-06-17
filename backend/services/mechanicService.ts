import { sql, poolPromise } from '../database/sql';
import { Mechanic } from '../models/mechanicModel';

export async function list(companyId: number): Promise<Mechanic[]> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('shopId', sql.Int, companyId)
    .query(
      `SELECT MECHANIC_NUMBER, MECHANIC_NAME, POPUP_TYPE, TIME_CLOCK_PASSWORD
       FROM MECHANIC
       WHERE HOME_SHOP = @shopId
         AND MobileEnabled = 1
         AND ISNULL(POPUP_TYPE, '') <> ''
         AND UPPER(CERTIFICATE_NUMBER) <> 'EXPIRED'`
    );

  return result.recordset.map((r: any) => ({
    mechanicId: r.MECHANIC_NUMBER,
    name: r.MECHANIC_NAME,
    role: r.POPUP_TYPE,
    pin: r.TIME_CLOCK_PASSWORD,
  }));
}

export async function verifyLogin(
  companyId: number,
  mechanicNumber: number,
  pin: string
): Promise<Mechanic | null> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('shopId', sql.Int, companyId)
    .input('mechanicNumber', sql.Int, mechanicNumber)
    .input('pin', sql.VarChar, pin)
    .query(
      `SELECT MECHANIC_NUMBER, MECHANIC_NAME, POPUP_TYPE, TIME_CLOCK_PASSWORD
       FROM MECHANIC
       WHERE MECHANIC_NUMBER = @mechanicNumber
         AND TIME_CLOCK_PASSWORD = @pin
         AND HOME_SHOP = @shopId
         AND MobileEnabled = 1
         AND ISNULL(POPUP_TYPE, '') <> ''
         AND UPPER(CERTIFICATE_NUMBER) <> 'EXPIRED'`
    );

  const row = result.recordset[0];
  if (!row) return null;

  return {
    mechanicId: row.MECHANIC_NUMBER,
    name: row.MECHANIC_NAME,
    role: row.POPUP_TYPE,
    pin: row.TIME_CLOCK_PASSWORD,
  };
}
