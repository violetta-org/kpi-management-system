import type { CompetencyAssessment } from '../../lib/types';
import type { IGetOptions, IGetAllOptions } from '../models/CommonModels';
import type { IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../../.power/schemas/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';

export class New_competencyassessmentService {
  private static readonly dataSourceName = 'new_competencyassessments';
  private static readonly client = getClient(dataSourcesInfo);

  public static async create(record: Omit<CompetencyAssessment, 'new_competencyassessmentid'>): Promise<IOperationResult<CompetencyAssessment>> {
    return await New_competencyassessmentService.client.createRecordAsync<Omit<CompetencyAssessment, 'new_competencyassessmentid'>, CompetencyAssessment>(
      New_competencyassessmentService.dataSourceName,
      record
    );
  }

  public static async update(id: string, changedFields: Partial<Omit<CompetencyAssessment, 'new_competencyassessmentid'>>): Promise<IOperationResult<CompetencyAssessment>> {
    return await New_competencyassessmentService.client.updateRecordAsync<Partial<Omit<CompetencyAssessment, 'new_competencyassessmentid'>>, CompetencyAssessment>(
      New_competencyassessmentService.dataSourceName,
      id,
      changedFields
    );
  }

  public static async delete(id: string): Promise<void> {
    await New_competencyassessmentService.client.deleteRecordAsync(
      New_competencyassessmentService.dataSourceName,
      id
    );
  }

  public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<CompetencyAssessment>> {
    return await New_competencyassessmentService.client.retrieveRecordAsync<CompetencyAssessment>(
      New_competencyassessmentService.dataSourceName,
      id,
      options
    );
  }

  public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<CompetencyAssessment[]>> {
    return await New_competencyassessmentService.client.retrieveMultipleRecordsAsync<CompetencyAssessment>(
      New_competencyassessmentService.dataSourceName,
      options
    );
  }
}
