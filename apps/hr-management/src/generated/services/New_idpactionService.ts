import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';

export class New_idpactionService {
  private static readonly dataSourceName = 'new_idpactions';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: any): Promise<IOperationResult<any>> {
    return await New_idpactionService.client.createRecordAsync<any, any>(
      New_idpactionService.dataSourceName,
      record
    );
  }

  public static async update(id: string, changedFields: any): Promise<IOperationResult<any>> {
    return await New_idpactionService.client.updateRecordAsync<any, any>(
      New_idpactionService.dataSourceName,
      id,
      changedFields
    );
  }

  public static async delete(id: string): Promise<void> {
    await New_idpactionService.client.deleteRecordAsync(
      New_idpactionService.dataSourceName,
      id
    );
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<any>> {
    return await New_idpactionService.client.retrieveRecordAsync<any>(
      New_idpactionService.dataSourceName,
      id,
      options
    );
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<any[]>> {
    return await New_idpactionService.client.retrieveMultipleRecordsAsync<any>(
      New_idpactionService.dataSourceName,
      options
    );
  }
}
