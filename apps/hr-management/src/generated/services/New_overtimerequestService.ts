import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';
import type { OvertimeRequest } from '../../lib/types';

export class New_overtimerequestService {
  private static readonly dataSourceName = 'new_overtimerequest';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: Partial<OvertimeRequest>): Promise<IOperationResult<OvertimeRequest>> {
    return await New_overtimerequestService.client.createRecordAsync<Partial<OvertimeRequest>, OvertimeRequest>(
      New_overtimerequestService.dataSourceName,
      record
    );
  }

  public static async update(id: string, changedFields: Partial<OvertimeRequest>): Promise<IOperationResult<OvertimeRequest>> {
    return await New_overtimerequestService.client.updateRecordAsync<Partial<OvertimeRequest>, OvertimeRequest>(
      New_overtimerequestService.dataSourceName,
      id,
      changedFields
    );
  }

  public static async delete(id: string): Promise<void> {
    await New_overtimerequestService.client.deleteRecordAsync(
      New_overtimerequestService.dataSourceName,
      id
    );
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<OvertimeRequest>> {
    return await New_overtimerequestService.client.retrieveRecordAsync<OvertimeRequest>(
      New_overtimerequestService.dataSourceName,
      id,
      options
    );
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<OvertimeRequest[]>> {
    return await New_overtimerequestService.client.retrieveMultipleRecordsAsync<OvertimeRequest>(
      New_overtimerequestService.dataSourceName,
      options
    );
  }
}
