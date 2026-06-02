import type { JobCompetency } from '../../lib/types';
import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';

export class New_jobcompetencyService {
  private static readonly dataSourceName = 'new_jobcompetency';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: Omit<JobCompetency, 'new_jobcompetencyid'>): Promise<IOperationResult<JobCompetency>> {
    return await New_jobcompetencyService.client.createRecordAsync<Omit<JobCompetency, 'new_jobcompetencyid'>, JobCompetency>(
      New_jobcompetencyService.dataSourceName,
      record
    );
  }

  public static async update(id: string, changedFields: Partial<Omit<JobCompetency, 'new_jobcompetencyid'>>): Promise<IOperationResult<JobCompetency>> {
    return await New_jobcompetencyService.client.updateRecordAsync<Partial<Omit<JobCompetency, 'new_jobcompetencyid'>>, JobCompetency>(
      New_jobcompetencyService.dataSourceName,
      id,
      changedFields
    );
  }

  public static async delete(id: string): Promise<void> {
    await New_jobcompetencyService.client.deleteRecordAsync(
      New_jobcompetencyService.dataSourceName,
      id
    );
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<JobCompetency>> {
    return await New_jobcompetencyService.client.retrieveRecordAsync<JobCompetency>(
      New_jobcompetencyService.dataSourceName,
      id,
      options
    );
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<JobCompetency[]>> {
    return await New_jobcompetencyService.client.retrieveMultipleRecordsAsync<JobCompetency>(
      New_jobcompetencyService.dataSourceName,
      options
    );
  }
}
