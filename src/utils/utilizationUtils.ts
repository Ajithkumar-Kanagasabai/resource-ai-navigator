
import { Employee, UtilizationData } from "@/types/employee";

export const calculateUtilization = (employee: Employee): UtilizationData => {
  const utilizationRate = (employee.ProductiveHours / employee.AvailableHours) * 100;

  let status: 'Underutilized' | 'Optimal' | 'Overutilized';
  if (utilizationRate < 70) {
    status = 'Underutilized';
  } else if (utilizationRate > 100) {
    status = 'Overutilized';
  } else {
    status = 'Optimal';
  }

  return {
    employee,
    utilizationRate,
    status
  };
};

export const processNaturalLanguageQuery = (query: string, utilizationData: UtilizationData[]): string => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('overutilized')) {
    const overutilized = utilizationData.filter(data => data.status === 'Overutilized');
    if (overutilized.length === 0) return "No overutilized employees found.";
    return `Overutilized employees: ${overutilized.map(data => data.employee.Name).join(', ')}`;
  }

  if (lowerQuery.includes('underutilized')) {
    const underutilized = utilizationData.filter(data => data.status === 'Underutilized');
    if (underutilized.length === 0) return "No underutilized employees found.";
    return `Underutilized employees: ${underutilized.map(data => data.employee.Name).join(', ')}`;
  }

  if (lowerQuery.includes('optimal')) {
    const optimal = utilizationData.filter(data => data.status === 'Optimal');
    if (optimal.length === 0) return "No optimally utilized employees found.";
    return `Optimally utilized employees: ${optimal.map(data => data.employee.Name).join(', ')}`;
  }

  return "I couldn't understand your query. Try asking about overutilized, underutilized, or optimally utilized employees.";
};
