import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';
import type { LeaveRequest } from '../../lib/types';

export class New_leaverequestService {
  private static readonly dataSourceName = 'new_leaverequests';

  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: Partial<LeaveRequest>): Promise<IOperationResult<LeaveRequest>> {
    const result = await New_leaverequestService.client.createRecordAsync<Partial<LeaveRequest>, LeaveRequest>(
      New_leaverequestService.dataSourceName,
      record
    );
    return result;
  }

  public static async update(id: string, changedFields: Partial<LeaveRequest>): Promise<IOperationResult<LeaveRequest>> {
    const result = await New_leaverequestService.client.updateRecordAsync<Partial<LeaveRequest>, LeaveRequest>(
      New_leaverequestService.dataSourceName,
      id,
      changedFields
    );
    return result;
  }

  public static async delete(id: string): Promise<void> {
    await New_leaverequestService.client.deleteRecordAsync(
      New_leaverequestService.dataSourceName,
      id);
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<LeaveRequest>> {
    const result = await New_leaverequestService.client.retrieveRecordAsync<LeaveRequest>(
      New_leaverequestService.dataSourceName,
      id,
      options
    );
    return result;
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<LeaveRequest[]>> {
    const result = await New_leaverequestService.client.retrieveMultipleRecordsAsync<LeaveRequest>(
      New_leaverequestService.dataSourceName,
      options
    );
    return result;
  }
}
