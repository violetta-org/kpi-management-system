import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';
import type { Holiday } from '../../lib/types';

export class New_holidayService {
  private static readonly dataSourceName = 'new_holiday';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: Partial<Holiday>): Promise<IOperationResult<Holiday>> {
    return await New_holidayService.client.createRecordAsync<Partial<Holiday>, Holiday>(
      New_holidayService.dataSourceName,
      record
    );
  }

  public static async update(id: string, changedFields: Partial<Holiday>): Promise<IOperationResult<Holiday>> {
    return await New_holidayService.client.updateRecordAsync<Partial<Holiday>, Holiday>(
      New_holidayService.dataSourceName,
      id,
      changedFields
    );
  }

  public static async delete(id: string): Promise<void> {
    await New_holidayService.client.deleteRecordAsync(
      New_holidayService.dataSourceName,
      id
    );
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<Holiday>> {
    return await New_holidayService.client.retrieveRecordAsync<Holiday>(
      New_holidayService.dataSourceName,
      id,
      options
    );
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<Holiday[]>> {
    return await New_holidayService.client.retrieveMultipleRecordsAsync<Holiday>(
      New_holidayService.dataSourceName,
      options
    );
  }
}
