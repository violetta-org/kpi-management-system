import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';

export class New_processtemplatestepService {
  private static readonly dataSourceName = 'new_processtemplatesteps';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: any): Promise<IOperationResult<any>> {
    return await New_processtemplatestepService.client.createRecordAsync(New_processtemplatestepService.dataSourceName, record);
  }

  public static async update(id: string, changedFields: any): Promise<IOperationResult<any>> {
    return await New_processtemplatestepService.client.updateRecordAsync(New_processtemplatestepService.dataSourceName, id, changedFields);
  }

  public static async delete(id: string): Promise<void> {
    await New_processtemplatestepService.client.deleteRecordAsync(New_processtemplatestepService.dataSourceName, id);
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<any>> {
    return await New_processtemplatestepService.client.retrieveRecordAsync(New_processtemplatestepService.dataSourceName, id, options);
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<any[]>> {
    return await New_processtemplatestepService.client.retrieveMultipleRecordsAsync(New_processtemplatestepService.dataSourceName, options);
  }
}
