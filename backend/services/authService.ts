import { sql, poolPromise } from '../database/sql';
import { Mechanic } from '../models/mechanicModel';

export async function findById(mechanicId: number): Promise<Mechanic | null> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('MechanicID', sql.Int, mechanicId)
    .query(`
      SELECT MECHANIC_NUMBER, MECHANIC_NAME, POPUP_TYPE, TIME_CLOCK_PASSWORD
      FROM MECHANIC
      WHERE MECHANIC_NUMBER = @MechanicID AND MobileEnabled = 1
    `);

  const row = result.recordset[0];
  if (!row) return null;

  return {
    mechanicId: row.MECHANIC_NUMBER,
    name: row.MECHANIC_NAME,
    role: row.POPUP_TYPE,
    pin: row.TIME_CLOCK_PASSWORD,
  };
}

export async function findByPin(pin: string): Promise<Mechanic | null> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('Pin', sql.VarChar, pin)
    .query(`
      SELECT MECHANIC_NUMBER, MECHANIC_NAME, POPUP_TYPE, TIME_CLOCK_PASSWORD
      FROM MECHANIC
      WHERE TIME_CLOCK_PASSWORD = @Pin AND MobileEnabled = 1
    `);

  const row = result.recordset[0];
  if (!row) return null;

  return {
    mechanicId: row.MECHANIC_NUMBER,
    name: row.MECHANIC_NAME,
    role: row.POPUP_TYPE,
    pin: row.TIME_CLOCK_PASSWORD,
  };
}

export async function login(mechanicId?: number, pin?: string): Promise<Mechanic | null> {
  if (mechanicId) {
    return findById(mechanicId);
  }
  if (pin) {
    return findByPin(pin);
  }
  return null;
}
