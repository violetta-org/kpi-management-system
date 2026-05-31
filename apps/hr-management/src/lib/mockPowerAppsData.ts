import { getClient as realGetClient } from '@microsoft/power-apps/data';

export interface IOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    [key: string]: any;
  };
}

export function getClient(schemas: any) {
  const client = realGetClient(schemas);

  const getMockTable = (tableName: string): any[] => {
    const data = localStorage.getItem(`mock_db_${tableName}`);
    return data ? JSON.parse(data) : [];
  };

  const saveMockTable = (tableName: string, data: any[]) => {
    localStorage.setItem(`mock_db_${tableName}`, JSON.stringify(data));
  };

  // Mock: createRecordAsync
  const originalCreate = client.createRecordAsync;
  (client as any).createRecordAsync = async function (entityName: string, record: any) {
    const forceMock = sessionStorage.getItem('devForceMockContext') === 'true' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
    if (!forceMock) {
      return originalCreate.call(this, entityName, record);
    }

    const table = getMockTable(entityName);
    let singular = entityName;
    if (entityName.endsWith('ies')) singular = entityName.slice(0, -3) + 'y';
    else if (entityName.endsWith('s')) singular = entityName.slice(0, -1);
    const primaryIdField = `${singular}id`;
    
    // Generate a standardized local GUID
    const newId = 'mock-guid-' + Math.random().toString(36).substring(2, 11) + '-' + Math.random().toString(36).substring(2, 11);
    
    // Process OData binds to plain lookup values for mock rendering
    const processedRecord: any = { ...record };
    Object.keys(record).forEach(key => {
      if (key.endsWith('@odata.bind')) {
        const lookupField = key.replace('@odata.bind', '').toLowerCase();
        const bindVal = record[key]; // format: /entityset(guid)
        const match = bindVal.match(/\(([^)]+)\)/);
        if (match && match[1]) {
          processedRecord[`_${lookupField}_value`] = match[1];
        }
      }
    });

    const newRecord = {
      ...processedRecord,
      [primaryIdField]: newId,
      createdon: new Date().toISOString(),
      statecode: record.statecode !== undefined ? record.statecode : 0,
      statuscode: record.statuscode !== undefined ? record.statuscode : 1,
    };
    
    table.push(newRecord);
    saveMockTable(entityName, table);

    console.log(`[Mock DB] Created record in ${entityName} with ID ${newId}`);
    return { success: true, data: newRecord };
  };

  // Mock: updateRecordAsync
  const originalUpdate = client.updateRecordAsync;
  (client as any).updateRecordAsync = async function (entityName: string, id: string, changedFields: any) {
    const forceMock = sessionStorage.getItem('devForceMockContext') === 'true' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
    if (!forceMock) {
      return originalUpdate.call(this, entityName, id, changedFields);
    }

    const table = getMockTable(entityName);
    let singular = entityName;
    if (entityName.endsWith('ies')) singular = entityName.slice(0, -3) + 'y';
    else if (entityName.endsWith('s')) singular = entityName.slice(0, -1);
    const primaryIdField = `${singular}id`;
    const recordIndex = table.findIndex(r => r[primaryIdField] === id);
    if (recordIndex !== -1) {
      // Process binds if updated
      const processedChanges: any = { ...changedFields };
      Object.keys(changedFields).forEach(key => {
        if (key.endsWith('@odata.bind')) {
          const lookupField = key.replace('@odata.bind', '').toLowerCase();
          const bindVal = changedFields[key];
          const match = bindVal.match(/\(([^)]+)\)/);
          if (match && match[1]) {
            processedChanges[`_${lookupField}_value`] = match[1];
          }
        }
      });

      table[recordIndex] = { ...table[recordIndex], ...processedChanges };
      saveMockTable(entityName, table);
      console.log(`[Mock DB] Updated record in ${entityName} (ID=${id})`);
      return { success: true, data: table[recordIndex] };
    }
    return { success: false, error: { message: 'Record not found' } };
  };

  // Mock: deleteRecordAsync
  const originalDelete = client.deleteRecordAsync;
  (client as any).deleteRecordAsync = async function (entityName: string, id: string) {
    const forceMock = sessionStorage.getItem('devForceMockContext') === 'true' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
    if (!forceMock) {
      return originalDelete.call(this, entityName, id);
    }

    const table = getMockTable(entityName);
    let singular = entityName;
    if (entityName.endsWith('ies')) singular = entityName.slice(0, -3) + 'y';
    else if (entityName.endsWith('s')) singular = entityName.slice(0, -1);
    const primaryIdField = `${singular}id`;
    const filtered = table.filter(r => r[primaryIdField] !== id);
    saveMockTable(entityName, filtered);
    console.log(`[Mock DB] Deleted record in ${entityName} (ID=${id})`);
    return { success: true };
  };

  // Mock: retrieveRecordAsync
  const originalRetrieve = client.retrieveRecordAsync;
  (client as any).retrieveRecordAsync = async function (entityName: string, id: string, options: any) {
    const forceMock = sessionStorage.getItem('devForceMockContext') === 'true' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
    if (!forceMock) {
      return originalRetrieve.call(this, entityName, id, options);
    }

    const table = getMockTable(entityName);
    let singular = entityName;
    if (entityName.endsWith('ies')) singular = entityName.slice(0, -3) + 'y';
    else if (entityName.endsWith('s')) singular = entityName.slice(0, -1);
    const primaryIdField = `${singular}id`;
    const record = table.find(r => r[primaryIdField] === id);
    if (record) {
      return { success: true, data: record };
    }
    return { success: false, error: { message: 'Record not found' } };
  };

  // Mock: retrieveMultipleRecordsAsync
  const originalRetrieveMultiple = client.retrieveMultipleRecordsAsync;
  (client as any).retrieveMultipleRecordsAsync = async function (entityName: string, options: any) {
    const forceMock = sessionStorage.getItem('devForceMockContext') === 'true' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
    if (!forceMock) {
      return originalRetrieveMultiple.call(this, entityName, options);
    }

    const table = getMockTable(entityName);
    return { success: true, data: table };
  };

  // Mock: executeAsync
  const originalExecute = client.executeAsync;
  (client as any).executeAsync = async function (request: any) {
    const forceMock = sessionStorage.getItem('devForceMockContext') === 'true' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
    if (!forceMock) {
      return originalExecute.call(this, request);
    }
    return { success: true, data: {} };
  };

  return client;
}
