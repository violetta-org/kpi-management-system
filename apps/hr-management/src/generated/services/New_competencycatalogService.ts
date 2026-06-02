import type { CompetencyCatalog } from '../../lib/types';
import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';

export class New_competencycatalogService {
  private static readonly dataSourceName = 'new_competencycatalog';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: Omit<CompetencyCatalog, 'new_competencycatalogid'>): Promise<IOperationResult<CompetencyCatalog>> {
    return await New_competencycatalogService.client.createRecordAsync<Omit<CompetencyCatalog, 'new_competencycatalogid'>, CompetencyCatalog>(
      New_competencycatalogService.dataSourceName,
      record
    );
  }

  public static async update(id: string, changedFields: Partial<Omit<CompetencyCatalog, 'new_competencycatalogid'>>): Promise<IOperationResult<CompetencyCatalog>> {
    return await New_competencycatalogService.client.updateRecordAsync<Partial<Omit<CompetencyCatalog, 'new_competencycatalogid'>>, CompetencyCatalog>(
      New_competencycatalogService.dataSourceName,
      id,
      changedFields
    );
  }

  public static async delete(id: string): Promise<void> {
    await New_competencycatalogService.client.deleteRecordAsync(
      New_competencycatalogService.dataSourceName,
      id
    );
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<CompetencyCatalog>> {
    return await New_competencycatalogService.client.retrieveRecordAsync<CompetencyCatalog>(
      New_competencycatalogService.dataSourceName,
      id,
      options
    );
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<CompetencyCatalog[]>> {
    return await New_competencycatalogService.client.retrieveMultipleRecordsAsync<CompetencyCatalog>(
      New_competencycatalogService.dataSourceName,
      options
    );
  }
}
