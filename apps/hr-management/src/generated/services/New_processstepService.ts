import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';

export class New_processstepService {
  private static readonly dataSourceName = 'new_processstep';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: any): Promise<IOperationResult<any>> {
    return await New_processstepService.client.createRecordAsync(New_processstepService.dataSourceName, record);
  }

  public static async update(id: string, changedFields: any): Promise<IOperationResult<any>> {
    return await New_processstepService.client.updateRecordAsync(New_processstepService.dataSourceName, id, changedFields);
  }

  public static async delete(id: string): Promise<void> {
    await New_processstepService.client.deleteRecordAsync(New_processstepService.dataSourceName, id);
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<any>> {
    return await New_processstepService.client.retrieveRecordAsync(New_processstepService.dataSourceName, id, options);
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<any[]>> {
    return await New_processstepService.client.retrieveMultipleRecordsAsync(New_processstepService.dataSourceName, options);
  }
}
