import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';
import type { LeaveBalance } from '../../lib/types';

export class New_leavebalanceService {
  private static readonly dataSourceName = 'new_leavebalances';

  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: Partial<LeaveBalance>): Promise<IOperationResult<LeaveBalance>> {
    const result = await New_leavebalanceService.client.createRecordAsync<Partial<LeaveBalance>, LeaveBalance>(
      New_leavebalanceService.dataSourceName,
      record
    );
    return result;
  }

  public static async update(id: string, changedFields: Partial<LeaveBalance>): Promise<IOperationResult<LeaveBalance>> {
    const result = await New_leavebalanceService.client.updateRecordAsync<Partial<LeaveBalance>, LeaveBalance>(
      New_leavebalanceService.dataSourceName,
      id,
      changedFields
    );
    return result;
  }

  public static async delete(id: string): Promise<void> {
    await New_leavebalanceService.client.deleteRecordAsync(
      New_leavebalanceService.dataSourceName,
      id);
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<LeaveBalance>> {
    const result = await New_leavebalanceService.client.retrieveRecordAsync<LeaveBalance>(
      New_leavebalanceService.dataSourceName,
      id,
      options
    );
    return result;
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<LeaveBalance[]>> {
    const result = await New_leavebalanceService.client.retrieveMultipleRecordsAsync<LeaveBalance>(
      New_leavebalanceService.dataSourceName,
      options
    );
    return result;
  }
}
