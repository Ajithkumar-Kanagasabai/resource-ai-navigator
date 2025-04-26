
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { employeesData } from '@/data/employees';
import { calculateUtilization } from '@/utils/utilizationUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search } from 'lucide-react';
import { useLLMQuery } from '@/hooks/useLLMQuery';
import { toast } from "sonner";

const UtilizationDashboard = () => {
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', content: string}>>([]);
  
  const utilizationData = employeesData.map(calculateUtilization);
  const { queryLLM, isLoading, error } = useLLMQuery(utilizationData);

  const handleQuery = async () => {
    if (!apiKey) {
      toast.error("Please enter your Perplexity API key");
      return;
    }

    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: query }]);

    const result = await queryLLM(query, apiKey);
    if (result) {
      setMessages(prev => [...prev, { type: 'bot', content: result }]);
      setQueryResult(result);
    } else if (error) {
      toast.error(error);
    }
    setQuery('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto space-y-4 p-4">
        {/* Messages */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card
              className={`max-w-[80%] p-4 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary'
              }`}
            >
              <p>{message.content}</p>
            </Card>
          </div>
        ))}

        {/* Charts and Stats */}
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
                  fill="#8884d8"
                  name="Utilization Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Input Area */}
      <div className="border-t p-4 space-y-4">
        <Input
          type="password"
          placeholder="Enter your Perplexity API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <div className="flex gap-2">
          <Input
            placeholder="Ask about resource utilization..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
          />
          <Button onClick={handleQuery} disabled={isLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UtilizationDashboard;
