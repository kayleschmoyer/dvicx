import { sql, poolPromise } from '../database/sql';
import { LineItem } from '../models/lineItemModel';

export interface InspectionItemInput {
  lineItemId: number;
  status: string;
  reason?: string;
  photo?: string;
}

export async function findLineItems(orderId: number): Promise<LineItem[]> {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('OrderID', sql.Int, orderId)
    .query(
      'SELECT LINE_ITEM_ID, PART_NUMBER, DESCRIPTION FROM LINEITEM WHERE WORK_ORDER_ID = @OrderID'
    );

  return result.recordset.map((row: any) => ({
    id: row.LINE_ITEM_ID,
    partNumber: row.PART_NUMBER,
    description: row.DESCRIPTION,
  }));
}

export async function submitInspection(
  orderId: number,
  mechanicId: number,
  items: InspectionItemInput[]
): Promise<void> {
  const pool = await poolPromise;
  for (const item of items) {
    await pool
      .request()
      .input('OrderID', sql.Int, orderId)
      .input('LineItemID', sql.Int, item.lineItemId)
      .input('MechanicID', sql.Int, mechanicId)
      .input('Status', sql.VarChar, item.status)
      .input('Reason', sql.VarChar, item.reason || null)
      .input('Photo', sql.VarChar, item.photo || null)
      .input('Timestamp', sql.DateTime, new Date())
      .query(
        'INSERT INTO INSPECTIONRESULTS (WORK_ORDER_ID, LINE_ITEM_ID, MECHANIC_ID, STATUS, REASON, PHOTO_URL, TIMESTAMP) ' +
          'VALUES (@OrderID, @LineItemID, @MechanicID, @Status, @Reason, @Photo, @Timestamp)'
      );
  }
}
