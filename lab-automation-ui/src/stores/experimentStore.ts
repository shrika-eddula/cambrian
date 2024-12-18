import { create } from 'zustand';
import axios from 'axios';

interface Resource {
  type: string;
  name: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

interface Step {
  type: string;
  source: string;
  target: string;
  volume: number;
  source_well?: string;
  target_well?: string;
}

interface ExperimentState {
  resources: { [key: string]: Resource };
  steps: Step[];
  addResource: (resource: Resource) => void;
  removeResource: (name: string) => void;
  addStep: (step: Step) => void;
  removeStep: (index: number) => void;
  runProtocol: () => Promise<void>;
}

export const useExperimentStore = create<ExperimentState>((set, get) => ({
  resources: {},
  steps: [],
  
  addResource: async (resource) => {
    try {
      await axios.post('http://localhost:8000/add-resource', resource);
      set((state) => ({
        resources: {
          ...state.resources,
          [resource.name]: resource
        }
      }));
    } catch (error) {
      console.error('Failed to add resource:', error);
    }
  },
  
  removeResource: (name) => {
    set((state) => {
      const { [name]: removed, ...remaining } = state.resources;
      return { resources: remaining };
    });
  },
  
  addStep: (step) => {
    set((state) => ({
      steps: [...state.steps, step]
    }));
  },
  
  removeStep: (index) => {
    set((state) => ({
      steps: state.steps.filter((_, i) => i !== index)
    }));
  },
  
  runProtocol: async () => {
    try {
      const { steps } = get();
      await axios.post('http://localhost:8000/run-protocol', { steps });
    } catch (error) {
      console.error('Failed to run protocol:', error);
    }
  },
}));
