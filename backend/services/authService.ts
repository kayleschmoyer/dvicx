import { sql, poolPromise } from '../database/sql';
import { Mechanic } from '../models/mechanicModel';

export async function findById(mechanicId: number): Promise<Mechanic | null> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('MechanicID', sql.Int, mechanicId)
    .query('SELECT MechanicID, Name, Role, Pin FROM MECHANIC WHERE MechanicID = @MechanicID');

  const row = result.recordset[0];
  if (!row) return null;
  return {
    mechanicId: row.MechanicID,
    name: row.Name,
    role: row.Role,
    pin: row.Pin,
  };
}

export async function findByPin(pin: string): Promise<Mechanic | null> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('Pin', sql.VarChar, pin)
    .query('SELECT MechanicID, Name, Role, Pin FROM MECHANIC WHERE Pin = @Pin');

  const row = result.recordset[0];
  if (!row) return null;
  return {
    mechanicId: row.MechanicID,
    name: row.Name,
    role: row.Role,
    pin: row.Pin,
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

