
import { useState } from 'react';
import { UtilizationData } from '@/types/employee';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

const generateSystemPrompt = (utilizationData: UtilizationData[]) => {
  return `You are a resource utilization analysis assistant. Here's the current utilization data:
    ${utilizationData.map(d => 
      `${d.employee.Name} (${d.employee.Role}): ${d.utilizationRate.toFixed(1)}% utilization`
    ).join('\n')}
    
    Analyze this data and provide insights about resource utilization.`;
};

export const useLLMQuery = (utilizationData: UtilizationData[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryLLM = async (query: string, apiKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: generateSystemPrompt(utilizationData)
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.2,
          max_tokens: 1000
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from LLM');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { queryLLM, isLoading, error };
};
