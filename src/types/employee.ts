
export interface Employee {
  EmployeeID: string;
  Name: string;
  Role: string;
  AvailableHours: number;
  ProductiveHours: number;
}

export interface UtilizationData {
  employee: Employee;
  utilizationRate: number;
  status: 'Underutilized' | 'Optimal' | 'Overutilized';
}
