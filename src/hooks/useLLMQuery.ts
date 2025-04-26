import { useState } from 'react';
import { UtilizationData } from '@/types/employee';

// Generate the system prompt for LLM context
const generateSystemPrompt = (utilizationData: UtilizationData[]) => {
  return `You are a resource utilization analysis assistant. Here's the current utilization data:
${utilizationData.map(d =>
    `${d.employee.Name} (${d.employee.Role}): ${d.utilizationRate.toFixed(1)}% utilization (${d.status})`
  ).join('\n')}

Analyze this data and provide insights about resource utilization. Be concise and factual.`;
};

export const useLLMQuery = (utilizationData: UtilizationData[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryLLM = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      return await queryOllama(query, utilizationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Query the local Ollama LLM
  const queryOllama = async (query: string, utilizationData: UtilizationData[]) => {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        stream: false, 
        messages: [
          {
            role: 'system',
            content: generateSystemPrompt(utilizationData),
          },
          {
            role: 'user',
            content: query,
          }
        ],
        options: {
          temperature: 0.2
        }
      })
    });
  
    if (!response.ok) {
      throw new Error(`Ollama server error: ${response.status}`);
    }
  
    const data = await response.json();
  
    const message = data?.message?.content || data?.response;
    if (!message) {
      throw new Error('No response from Ollama');
    }
  
    return message;
  };
  

  return { queryLLM, isLoading, error };
};