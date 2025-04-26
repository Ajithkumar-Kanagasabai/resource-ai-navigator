import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { employeesData } from '@/data/employees';
import { calculateUtilization } from '@/utils/utilizationUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search } from 'lucide-react';
import { useLLMQuery } from '../../src/hooks/useLLMQuery';
import { toast } from "sonner";
const UtilizationDashboard = () => {
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const utilizationData = employeesData.map(calculateUtilization);
  const { queryLLM, isLoading, error } = useLLMQuery(utilizationData);
  const handleQuery = async () => {
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }
    const result = await queryLLM(query);
    if (result) {
      setQueryResult(result);
    } else if (error) {
      toast.error(error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Resource Utilization Dashboard</h1>
      <div className="mb-8">
        <div className="flex flex-col gap-4 mb-4">
          <Input
            type="password"
            placeholder="Enter your OpenAI API key (optional - uses free tier if empty)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-4">
            <Input
              placeholder="Ask about resource utilization (e.g., 'Who is overutilized and why?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleQuery} disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? 'Analyzing...' : 'Query'}
            </Button>
          </div>
        </div>
        {queryResult && (
          <Card className="p-4 bg-secondary">
            <p>{queryResult}</p>
          </Card>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Utilization Chart */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Resource Utilization Rates</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="employee.Name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="utilizationRate"
                  fill="#8884D8"
                  name="Utilization Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        {/* Status Summary */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Utilization Status</h2>
          <div className="space-y-4">
            {utilizationData.map((data) => (
              <div
                key={data.employee.EmployeeID}
                className={`p-4 rounded-lg ${
                  data.status === 'Overutilized'
                    ? 'bg-red-100 text-red-800'
                    : data.status === 'Underutilized'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                <p className="font-semibold">{data.employee.Name}</p>
                <p>{data.employee.Role}</p>
                <p>Utilization: {data.utilizationRate.toFixed(1)}%</p>
                <p>Status: {data.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
export default UtilizationDashboard;