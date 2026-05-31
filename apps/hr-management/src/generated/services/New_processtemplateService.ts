import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';

export class New_processtemplateService {
  private static readonly dataSourceName = 'new_processtemplate';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: any): Promise<IOperationResult<any>> {
    return await New_processtemplateService.client.createRecordAsync(New_processtemplateService.dataSourceName, record);
  }

  public static async update(id: string, changedFields: any): Promise<IOperationResult<any>> {
    return await New_processtemplateService.client.updateRecordAsync(New_processtemplateService.dataSourceName, id, changedFields);
  }

  public static async delete(id: string): Promise<void> {
    await New_processtemplateService.client.deleteRecordAsync(New_processtemplateService.dataSourceName, id);
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<any>> {
    return await New_processtemplateService.client.retrieveRecordAsync(New_processtemplateService.dataSourceName, id, options);
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<any[]>> {
    return await New_processtemplateService.client.retrieveMultipleRecordsAsync(New_processtemplateService.dataSourceName, options);
  }
}
