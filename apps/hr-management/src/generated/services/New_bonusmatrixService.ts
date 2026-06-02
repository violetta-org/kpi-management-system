import type { BonusMatrix } from '../../lib/types';
import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';

export class New_bonusmatrixService {
  private static readonly dataSourceName = 'new_bonusmatrix';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: Omit<BonusMatrix, 'new_bonusmatrixid'>): Promise<IOperationResult<BonusMatrix>> {
    return await New_bonusmatrixService.client.createRecordAsync<Omit<BonusMatrix, 'new_bonusmatrixid'>, BonusMatrix>(
      New_bonusmatrixService.dataSourceName,
      record
    );
  }

  public static async update(id: string, changedFields: Partial<Omit<BonusMatrix, 'new_bonusmatrixid'>>): Promise<IOperationResult<BonusMatrix>> {
    return await New_bonusmatrixService.client.updateRecordAsync<Partial<Omit<BonusMatrix, 'new_bonusmatrixid'>>, BonusMatrix>(
      New_bonusmatrixService.dataSourceName,
      id,
      changedFields
    );
  }

  public static async delete(id: string): Promise<void> {
    await New_bonusmatrixService.client.deleteRecordAsync(
      New_bonusmatrixService.dataSourceName,
      id
    );
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<BonusMatrix>> {
    return await New_bonusmatrixService.client.retrieveRecordAsync<BonusMatrix>(
      New_bonusmatrixService.dataSourceName,
      id,
      options
    );
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<BonusMatrix[]>> {
    return await New_bonusmatrixService.client.retrieveMultipleRecordsAsync<BonusMatrix>(
      New_bonusmatrixService.dataSourceName,
      options
    );
  }
}
