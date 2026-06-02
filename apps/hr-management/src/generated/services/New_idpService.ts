import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';

export class New_idpService {
  private static readonly dataSourceName = 'new_idps';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: any): Promise<IOperationResult<any>> {
    return await New_idpService.client.createRecordAsync<any, any>(
      New_idpService.dataSourceName,
      record
    );
  }

  public static async update(id: string, changedFields: any): Promise<IOperationResult<any>> {
    return await New_idpService.client.updateRecordAsync<any, any>(
      New_idpService.dataSourceName,
      id,
      changedFields
    );
  }

  public static async delete(id: string): Promise<void> {
    await New_idpService.client.deleteRecordAsync(
      New_idpService.dataSourceName,
      id
    );
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<any>> {
    return await New_idpService.client.retrieveRecordAsync<any>(
      New_idpService.dataSourceName,
      id,
      options
    );
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<any[]>> {
    return await New_idpService.client.retrieveMultipleRecordsAsync<any>(
      New_idpService.dataSourceName,
      options
    );
  }
}
