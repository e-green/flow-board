"use client";

import React, { useState, useEffect } from 'react';
import { WorkflowIcon } from 'lucide-react';

const WorkflowDiagramModal = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [flowChart, setFlowChart] = useState('');

  // Function to parse description and generate flowchart
  const analyzeDescription = (description) => {
    if (!description) return '';

    // Split description into sentences
    const sentences = description.split(/[.!?]+/).filter(s => s.trim());
    
    // Keywords to identify steps and conditions
    const stepKeywords = ['then', 'next', 'after', 'finally', 'lastly'];
    const conditionKeywords = ['if', 'when', 'should', 'must', 'can'];
    
    let nodes = [];
    let connections = [];
    let nodeCount = 0;

    // Process each sentence to identify steps and relationships
    sentences.forEach((sentence, index) => {
      sentence = sentence.trim().toLowerCase();
      
      // Skip empty sentences
      if (!sentence) return;

      const currentNode = `N${nodeCount}`;
      let nodeContent = sentence.length > 50 ? 
        sentence.substring(0, 47) + '...' : 
        sentence;
      
      // Check if sentence is a condition
      if (conditionKeywords.some(keyword => sentence.includes(keyword))) {
        nodes.push(`${currentNode}{${nodeContent}}`);
        
        // Add yes/no branches if it's a condition
        const yesNode = `N${nodeCount + 1}`;
        const noNode = `N${nodeCount + 2}`;
        
        nodes.push(`${yesNode}[Yes]`);
        nodes.push(`${noNode}[No]`);
        
        connections.push(`${currentNode} -->|Yes| ${yesNode}`);
        connections.push(`${currentNode} -->|No| ${noNode}`);
        
        nodeCount += 3;
      } else {
        // Regular step
        nodes.push(`${currentNode}[${nodeContent}]`);
        
        // Connect to previous node if exists
        if (index > 0) {
          connections.push(`N${nodeCount - 1} --> ${currentNode}`);
        }
        
        nodeCount++;
      }
    });

    // Generate Mermaid syntax
    return `graph TD
      ${nodes.join('\n      ')}
      ${connections.join('\n      ')}`;
  };

  useEffect(() => {
    if (task?.description) {
      const diagram = analyzeDescription(task.description);
      setFlowChart(diagram);
    }
  }, [task]);

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
        title="View Workflow"
      >
        <WorkflowIcon className="h-6 w-6 text-blue-800" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Task Workflow</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="mermaid text-center">
                {flowChart || `graph TD
                  A[No description available] --> B[Add task description to generate workflow]`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowDiagramModal;