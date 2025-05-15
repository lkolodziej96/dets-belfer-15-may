import type { CountryData } from '../types';

export const mainData: CountryData[] = [
{
  country: "United States",
  totalScore: 0.883,          
  sectorDetails: {
    ai: {
      algorithms:             1.00,
      computing_power:        1.00,
      data:                   0.58,   // updated
      economic_resources:     1.00,
      global_player:          1.00,
      human_capital:          0.85,
      regulatory:             1.00,
      accuracy_of_top_models: 1.00    // added
    },
      quantum: {
        economic_resources: 1.00,
        security: 1.00,
        human_capital: 1.00,
        global_player: 0.75,
        policy_environment: 1.00,
        quantum_sensing: 0.59,
        quantum_communications: 0.67,
        quantum_computing: 0.79
      },
      semiconductors: {
        economic_resources: 0.39,
        human_capital: 0.87,
        global_player: 1.00,
        regulatory: 1.00,
        raw_materials: 0.32,
        chip_design: 1.00,
        manufacturing: 0.42,
        equipment: 1.00,
        assembly_testing: 0.10
      },
      biotech: {
        economic_resources: 0.94,
        security: 1.00,
        human_capital: 0.85,
        global_player: 0.60,
        regulatory: 0.67,
        agricultural_technology: 1.00,
        vaccine_research: 0.98,
        pharmaceutical_production: 0.63,
        genetic_engineering: 1.00
      },
      space: {
        economic_resources: 1.00,
        human_capital: 0.71,
        security: 1.00,
        global_player: 1.00,
        regulatory: 1.00,
        domestic_launch_capability: 1.00,
        science_exploration: 1.00,
        pnt: 0.67,
        telecommunications: 1.00,
        remote_sensing: 1.00
      }
    }
  },
  {
  country: "Australia",
  totalScore: 0.273,
  sectorDetails: {
    ai: {
      algorithms:             0.00,
      computing_power:        0.04,
      data:                   0.40,
      economic_resources:     0.01,
      global_player:          0.54,
      human_capital:          0.14,
      regulatory:             0.00,
      accuracy_of_top_models: 0.00
    },
      quantum: {
        economic_resources: 0.03,
        security: 1.00,
        human_capital: 0.010,
        global_player: 0.50,
        policy_environment: 0.50,
        quantum_sensing: 0.06,
        quantum_communications: 0.35,
        quantum_computing: 0.11
      },
      semiconductors: {
        economic_resources: 0.01,
        human_capital: 0.03,
        global_player: 0.05,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.02,
        security: 0.92,
        human_capital: 0.05,
        global_player: 0.60,
        regulatory: 0.57,
        agricultural_technology: 0.84,
        vaccine_research: 0.19,
        pharmaceutical_production: 0.01,
        genetic_engineering: 0.19
      },
      space: {
        economic_resources: 0.01,
        human_capital: 0.21,
        security: 0.34,
        global_player: 1.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.01,
        science_exploration: 0.00,
        pnt: 0.17,
        telecommunications: 0.00,
        remote_sensing: 0.26
      }
    }
  },
  {
    country: "Brazil",
    totalScore: 0.172,
    sectorDetails: {
      ai: {
        algorithms: 0.00,
        computing_power: 0.06,
        data: 0.32,
        economic_resources: 0.01,
        global_player: 0.16,
        human_capital: 0.05,
        regulatory: 0.04,
        accuracy_of_top_models: 0.00  
      },
      quantum: {
        economic_resources: 0.00,
        security: 0.00,
        human_capital: 0.08,
        global_player: 0.00,
        policy_environment: 0.33,
        quantum_sensing: 0.00,
        quantum_communications: 0.00,
        quantum_computing: 0.00
      },
      semiconductors: {
        economic_resources: 0.09,
        human_capital: 0.01,
        global_player: 0.05,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.04,
        security: 0.68,
        human_capital: 0.02,
        global_player: 0.80,
        regulatory: 0.86,
        agricultural_technology: 0.81,
        vaccine_research: 0.14,
        pharmaceutical_production: 0.01,
        genetic_engineering: 0.10
      },
      space: {
        economic_resources: 0.00,
        human_capital: 0.06,
        security: 0.00,
        global_player: 0.50,
        regulatory: 1.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.00,
        pnt: 0.00,
        telecommunications: 0.00,
        remote_sensing: 0.51
      }
    }
  },
  {
  country: "Canada",
  totalScore: 0.268,
  sectorDetails: {
    ai: {
      algorithms:             0.07,
      computing_power:        0.06,
      data:                   0.49,
      economic_resources:     0.03,
      global_player:          0.24,
      human_capital:          0.15,
      regulatory:             0.04,
      accuracy_of_top_models: 0.06
    },

      quantum: {
        economic_resources: 0.26,
        security: 1.00,
        human_capital: 0.24,
        global_player: 0.50,
        policy_environment: 1.00,
        quantum_sensing: 0.08,
        quantum_communications: 0.53,
        quantum_computing: 0.40
      },
      semiconductors: {
        economic_resources: 0.02,
        human_capital: 0.06,
        global_player: 0.04,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.02,
        security: 0.83,
        human_capital: 0.05,
        global_player: 0.60,
        regulatory: 0.76,
        agricultural_technology: 0.96,
        vaccine_research: 0.14,
        pharmaceutical_production: 0.02,
        genetic_engineering: 0.11
      },
      space: {
        economic_resources: 0.02,
        human_capital: 0.16,
        security: 0.00,
        global_player: 1.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.01,
        science_exploration: 0.01,
        pnt: 0.00,
        telecommunications: 0.01,
        remote_sensing: 0.51
      }
    }
  },
 {
  country: "China",
  totalScore: 0.602,               
  sectorDetails: {
    ai: {
      algorithms:             0.25,
      computing_power:        0.65,   // updated
      data:                   1.00,   // updated
      economic_resources:     0.37,   // updated
      global_player:          0.27,
      human_capital:          1.00,
      regulatory:             0.13,
      accuracy_of_top_models: 0.11    
    },
      quantum: {
        economic_resources: 0.98,
        security: 1.00,
        human_capital: 0.16,
        global_player: 0.25,
        policy_environment: 0.58,
        quantum_sensing: 1.00,
        quantum_communications: 1.00,
        quantum_computing: 0.82
      },
      semiconductors: {
        economic_resources: 1.00,
        human_capital: 1.00,
        global_player: 0.91,
        regulatory: 1.00,
        raw_materials: 0.64,
        chip_design: 0.11,
        manufacturing: 1.00,
        equipment: 0.06,
        assembly_testing: 1.00
      },
      biotech: {
        economic_resources: 1.00,
        security: 0.54,
        human_capital: 1.00,
        global_player: 0.80,
        regulatory: 0.67,
        agricultural_technology: 0.67,
        vaccine_research: 0.64,
        pharmaceutical_production: 1.00,
        genetic_engineering: 0.66
      },
      space: {
        economic_resources: 0.34,
        human_capital: 1.00,
        security: 0.82,
        global_player: 0.50,
        regulatory: 0.00,
        domestic_launch_capability: 0.35,
        science_exploration: 0.05,
        pnt: 1.00,
        telecommunications: 0.02,
        remote_sensing: 0.80
      }
    }
  },
 {
  country: "France",
  totalScore: 0.343,                // leave unchanged for now
  sectorDetails: {
    ai: {
      algorithms:             0.13,
      computing_power:        0.14,
      data:                   0.57,   // updated
      economic_resources:     0.04,   // updated
      global_player:          0.46,
      human_capital:          0.10,
      regulatory:             0.30,
      accuracy_of_top_models: 0.11    // added
    },
      quantum: {
        economic_resources: 0.15,
        security: 1.00,
        human_capital: 0.15,
        global_player: 1.00,
        policy_environment: 1.00,
        quantum_sensing: 0.10,
        quantum_communications: 0.52,
        quantum_computing: 0.38
      },
      semiconductors: {
        economic_resources: 0.02,
        human_capital: 0.05,
        global_player: 0.20,
        regulatory: 1.00,
        raw_materials: 0.04,
        chip_design: 0.00,
        manufacturing: 0.06,
        equipment: 0.02,
        assembly_testing: 0.02
      },
      biotech: {
        economic_resources: 0.07,
        security: 0.65,
        human_capital: 0.11,
        global_player: 0.80,
        regulatory: 0.19,
        agricultural_technology: 0.37,
        vaccine_research: 0.11,
        pharmaceutical_production: 0.06,
        genetic_engineering: 0.07
      },
      space: {
        economic_resources: 0.05,
        human_capital: 0.06,
        security: 0.37,
        global_player: 1.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.01,
        science_exploration: 0.11,
        pnt: 0.67,
        telecommunications: 0.00,
        remote_sensing: 0.52
      }
    }
  },
  {
  country: "Germany",
  totalScore: 0.283,                // leave unchanged for now
  sectorDetails: {
    ai: {
      algorithms:             0.08,
      computing_power:        0.22,
      data:                   0.54,
      economic_resources:     0.04,
      global_player:          0.53,
      human_capital:          0.18,
      regulatory:             0.13,
      accuracy_of_top_models: 0.03
    },
      quantum: {
        economic_resources: 0.35,
        security: 1.00,
        human_capital: 0.14,
        global_player: 1.00,
        policy_environment: 0.58,
        quantum_sensing: 0.28,
        quantum_communications: 0.57,
        quantum_computing: 0.44
      },
      semiconductors: {
        economic_resources: 0.08,
        human_capital: 0.12,
        global_player: 0.25,
        regulatory: 1.00,
        raw_materials: 0.17,
        chip_design: 0.02,
        manufacturing: 0.10,
        equipment: 0.19,
        assembly_testing: 0.02
      },
      biotech: {
        economic_resources: 0.16,
        security: 0.77,
        human_capital: 0.22,
        global_player: 0.80,
        regulatory: 0.19,
        agricultural_technology: 0.37,
        vaccine_research: 0.17,
        pharmaceutical_production: 0.09,
        genetic_engineering: 0.11
      },
      space: {
        economic_resources: 0.02,
        human_capital: 0.18,
        security: 0.18,
        global_player: 1.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.11,
        pnt: 0.67,
        telecommunications: 0.00,
        remote_sensing: 0.52
      }
    }
  },
  {
  country: "India",
  totalScore: 0.287,
  sectorDetails: {
    ai: {
      algorithms:             0.00,
      computing_power:        0.02,
      data:                   0.37,
      economic_resources:     0.04,
      global_player:          0.40,
      human_capital:          0.38,
      regulatory:             0.04,
      accuracy_of_top_models: 0.00
    },

      quantum: {
        economic_resources: 0.06,
        security: 1.00,
        human_capital: 0.06,
        global_player: 0.50,
        policy_environment: 0.50,
        quantum_sensing: 0.21,
        quantum_communications: 0.35,
        quantum_computing: 0.17
      },
      semiconductors: {
        economic_resources: 0.04,
        human_capital: 0.17,
        global_player: 0.11,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.00,
        security: 0.41,
        human_capital: 0.19,
        global_player: 0.80,
        regulatory: 0.43,
        agricultural_technology: 0.52,
        vaccine_research: 0.37,
        pharmaceutical_production: 0.02,
        genetic_engineering: 0.09
      },
      space: {
        economic_resources: 0.06,
        human_capital: 0.15,
        security: 0.52,
        global_player: 0.50,
        regulatory: 1.00,
        domestic_launch_capability: 0.04,
        science_exploration: 0.02,
        pnt: 0.33,
        telecommunications: 0.00,
        remote_sensing: 0.54
      }
    }
  },
  {
    country: "Iran",
    totalScore: 0.162,
    sectorDetails: {
      ai: {
        algorithms: 0.00,
        computing_power: 0.00,
        data: 0.17,
        economic_resources: 0.00,
        global_player: 0.00,
        human_capital: 0.09,
        regulatory: 0.00,
        accuracy_of_top_models: 0.00  
      },
      quantum: {
        economic_resources: 0.00,
        security: 0.00,
        human_capital: 0.01,
        global_player: 0.00,
        policy_environment: 0.50,
        quantum_sensing: 0.06,
        quantum_communications: 0.00,
        quantum_computing: 0.01
      },
      semiconductors: {
        economic_resources: 0.00,
        human_capital: 0.05,
        global_player: 0.00,
        regulatory: 0.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.00,
        security: 0.43,
        human_capital: 0.03,
        global_player: 0.00,
        regulatory: 0.00,
        agricultural_technology: 0.11,
        vaccine_research: 0.16,
        pharmaceutical_production: 0.00,
        genetic_engineering: 0.01
      },
      space: {
        economic_resources: 0.00,
        human_capital: 0.01,
        security: 0.17,
        global_player: 0.00,
        regulatory: 0.00,
        domestic_launch_capability: 0.01,
        science_exploration: 0.00,
        pnt: 0.33,
        telecommunications: 0.00,
        remote_sensing: 0.50
      }
    }
  },
  {
    country: "Israel",
    totalScore: 0.233,
    sectorDetails: {
      ai: {
        algorithms: 0.07,
        computing_power: 0.01,
        data: 0.33,
        economic_resources: 0.04,
        global_player: 0.25,
        human_capital: 0.02,
        regulatory: 0.00,
        accuracy_of_top_models: 0.05 
      },
      quantum: {
        economic_resources: 0.04,
        security: 1.00,
        human_capital: 0.06,
        global_player: 0.50,
        policy_environment: 0.50,
        quantum_sensing: 0.04,
        quantum_communications: 0.01,
        quantum_computing: 0.35
      },
      semiconductors: {
        economic_resources: 0.01,
        human_capital: 0.00,
        global_player: 0.04,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.01,
        security: 0.55,
        human_capital: 0.03,
        global_player: 0.40,
        regulatory: 0.69,
        agricultural_technology: 0.25,
        vaccine_research: 0.04,
        pharmaceutical_production: 0.02,
        genetic_engineering: 0.10
      },
      space: {
        economic_resources: 0.01,
        human_capital: 0.00,
        security: 0.52,
        global_player: 0.50,
        regulatory: 0.00,
        domestic_launch_capability: 0.01,
        science_exploration: 0.00,
        pnt: 0.00,
        telecommunications: 0.00,
        remote_sensing: 0.52
      }
    }
  },
  {
  country: "Italy",
  totalScore: 0.265,
  sectorDetails: {
    ai: {
      algorithms:             0.00,
      computing_power:        0.07,
      data:                   0.40,
      economic_resources:     0.00,
      global_player:          0.20,
      human_capital:          0.13,
      regulatory:             0.43,
      accuracy_of_top_models: 0.00
    },

      quantum: {
        economic_resources: 0.03,
        security: 0.50,
        human_capital: 0.03,
        global_player: 0.50,
        policy_environment: 0.42,
        quantum_sensing: 0.01,
        quantum_communications: 0.19,
        quantum_computing: 0.37
      },
      semiconductors: {
        economic_resources: 0.01,
        human_capital: 0.08,
        global_player: 0.07,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.06,
        equipment: 0.00,
        assembly_testing: 0.02
      },
      biotech: {
        economic_resources: 0.04,
        security: 0.58,
        human_capital: 0.06,
        global_player: 1.00,
        regulatory: 0.19,
        agricultural_technology: 0.37,
        vaccine_research: 0.14,
        pharmaceutical_production: 0.02,
        genetic_engineering: 0.07
      },
      space: {
        economic_resources: 0.01,
        human_capital: 0.17,
        security: 0.03,
        global_player: 1.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.01,
        science_exploration: 0.11,
        pnt: 0.67,
        telecommunications: 0.00,
        remote_sensing: 0.52
      }
    }
  },
  {
  country: "Japan",
  totalScore: 0.320,
  sectorDetails: {
    ai: {
      algorithms:             0.00,
      computing_power:        0.20,
      data:                   0.45,
      economic_resources:     0.03,
      global_player:          0.35,
      human_capital:          0.09,
      regulatory:             0.09,
      accuracy_of_top_models: 0.00
    },

      quantum: {
        economic_resources: 0.21,
        security: 1.00,
        human_capital: 0.12,
        global_player: 0.75,
        policy_environment: 0.58,
        quantum_sensing: 0.19,
        quantum_communications: 0.68,
        quantum_computing: 0.39
      },
      semiconductors: {
        economic_resources: 0.25,
        human_capital: 0.21,
        global_player: 0.15,
        regulatory: 1.00,
        raw_materials: 0.43,
        chip_design: 0.17,
        manufacturing: 0.71,
        equipment: 0.55,
        assembly_testing: 0.20
      },
      biotech: {
        economic_resources: 0.25,
        security: 0.75,
        human_capital: 0.16,
        global_player: 0.60,
        regulatory: 1.00,
        agricultural_technology: 0.49,
        vaccine_research: 0.15,
        pharmaceutical_production: 0.12,
        genetic_engineering: 0.15
      },
      space: {
        economic_resources: 0.04,
        human_capital: 0.15,
        security: 0.34,
        global_player: 0.50,
        regulatory: 1.00,
        domestic_launch_capability: 0.03,
        science_exploration: 0.11,
        pnt: 0.33,
        telecommunications: 0.01,
        remote_sensing: 0.55
      }
    }
  },
  {
    country: "Netherlands",
    totalScore: 0.300,
    sectorDetails: {
      ai: {
        algorithms: 0.00,
        computing_power: 0.06,
        data: 0.50,
        economic_resources: 0.01,
        global_player: 0.20,
        human_capital: 0.06,
        regulatory: 0.00,
        accuracy_of_top_models: 0.00  
      },
      quantum: {
        economic_resources: 0.11,
        security: 0.50,
        human_capital: 0.10,
        global_player: 1.00,
        policy_environment: 1.00,
        quantum_sensing: 0.01,
        quantum_communications: 0.20,
        quantum_computing: 0.38
      },
      semiconductors: {
        economic_resources: 0.05,
        human_capital: 0.02,
        global_player: 0.09,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.10,
        equipment: 0.15,
        assembly_testing: 0.02
      },
      biotech: {
        economic_resources: 0.02,
        security: 0.75,
        human_capital: 0.04,
        global_player: 0.80,
        regulatory: 0.19,
        agricultural_technology: 0.37,
        vaccine_research: 0.06,
        pharmaceutical_production: 0.03,
        genetic_engineering: 0.05
      },
      space: {
        economic_resources: 0.01,
        human_capital: 0.03,
        security: 0.00,
        global_player: 0.50,
        regulatory: 1.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.11,
        pnt: 0.67,
        telecommunications: 0.00,
        remote_sensing: 0.50
      }
    }
  },
  {
    country: "New Zealand",
    totalScore: 0.138,
    sectorDetails: {
      ai: {
        algorithms: 0.00,
        computing_power: 0.00,
        data: 0.42,
        economic_resources: 0.00,
        global_player: 0.15,
        human_capital: 0.01,
        regulatory: 0.00,
        accuracy_of_top_models: 0.00  
      },
      quantum: {
        economic_resources: 0.00,
        security: 0.00,
        human_capital: 0.04,
        global_player: 0.00,
        policy_environment: 0.25,
        quantum_sensing: 0.00,
        quantum_communications: 0.00,
        quantum_computing: 0.00
      },
      semiconductors: {
        economic_resources: 0.00,
        human_capital: 0.00,
        global_player: 0.00,
        regulatory: 0.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.00,
        security: 0.73,
        human_capital: 0.00,
        global_player: 0.80,
        regulatory: 0.38,
        agricultural_technology: 0.28,
        vaccine_research: 0.04,
        pharmaceutical_production: 0.00,
        genetic_engineering: 0.06
      },
      space: {
        economic_resources: 0.00,
        human_capital: 0.02,
        security: 0.00,
        global_player: 1.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.03,
        science_exploration: 0.00,
        pnt: 0.17,
        telecommunications: 0.00,
        remote_sensing: 0.25
      }
    }
  },
  {
    country: "North Korea",
    totalScore: 0.027,
    sectorDetails: {
      ai: {
        algorithms: 0.00,
        computing_power: 0.00,
        data: 0.00,
        economic_resources: 0.00,
        global_player: 0.00,
        human_capital: 0.00,
        regulatory: 0.00
      },
      quantum: {
        economic_resources: 0.00,
        security: 0.00,
        human_capital: 0.00,
        global_player: 0.00,
        policy_environment: 0.00,
        quantum_sensing: 0.00,
        quantum_communications: 0.00,
        quantum_computing: 0.00
      },
      semiconductors: {
        economic_resources: 0.00,
        human_capital: 0.00,
        global_player: 0.00,
        regulatory: 0.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.00,
        security: 0.00,
        human_capital: 0.00,
        global_player: 0.00,
        regulatory: 0.00,
        agricultural_technology: 0.00,
        vaccine_research: 0.00,
        pharmaceutical_production: 0.00,
        genetic_engineering: 0.00
      },
      space: {
        economic_resources: 0.00,
        human_capital: 0.00,
        security: 0.17,
        global_player: 0.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.01,
        science_exploration: 0.00,
        pnt: 0.00,
        telecommunications: 0.00,
        remote_sensing: 0.00
      }
    }
  },
  {
    country: "Russia",
    totalScore: 0.322,
    sectorDetails: {
      ai: {
        algorithms: 0.00,
        computing_power: 0.04,
        data: 0.33,
        economic_resources: 0.00,
        global_player: 0.13,
        human_capital: 0.04,
        regulatory: 0.43,
        accuracy_of_top_models: 0.00  
      },
      quantum: {
        economic_resources: 0.10,
        security: 0.50,
        human_capital: 0.03,
        global_player: 0.25,
        policy_environment: 0.58,
        quantum_sensing: 0.15,
        quantum_communications: 0.34,
        quantum_computing: 0.35
      },
      semiconductors: {
        economic_resources: 0.03,
        human_capital: 0.01,
        global_player: 0.04,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.04,
        security: 0.55,
        human_capital: 0.01,
        global_player: 0.80,
        regulatory: 0.81,
        agricultural_technology: 0.31,
        vaccine_research: 0.20,
        pharmaceutical_production: 0.02,
        genetic_engineering: 0.09
      },
      space: {
        economic_resources: 0.02,
        human_capital: 0.68,
        security: 0.72,
        global_player: 1.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.28,
        science_exploration: 0.22,
        pnt: 0.67,
        telecommunications: 0.02,
        remote_sensing: 0.52
      }
    }
  },
  {
    country: "Saudi Arabia",
    totalScore: 0.128,
    sectorDetails: {
      ai: {
        algorithms: 0.00,
        computing_power: 0.04,
        data: 0.43,
        economic_resources: 0.00,
        global_player: 0.08,
        human_capital: 0.08,
        regulatory: 0.00,
        accuracy_of_top_models: 0.00  
      },
      quantum: {
        economic_resources: 0.00,
        security: 0.00,
        human_capital: 0.03,
        global_player: 0.00,
        policy_environment: 0.08,
        quantum_sensing: 0.00,
        quantum_communications: 0.00,
        quantum_computing: 0.18
      },
      semiconductors: {
        economic_resources: 0.00,
        human_capital: 0.01,
        global_player: 0.00,
        regulatory: 0.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.01,
        security: 0.48,
        human_capital: 0.01,
        global_player: 0.80,
        regulatory: 0.24,
        agricultural_technology: 0.00,
        vaccine_research: 0.03,
        pharmaceutical_production: 0.00,
        genetic_engineering: 0.01
      },
      space: {
        economic_resources: 0.00,
        human_capital: 0.00,
        security: 0.00,
        global_player: 0.50,
        regulatory: 0.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.00,
        pnt: 0.17,
        telecommunications: 0.00,
        remote_sensing: 0.51
      }
    }
  },
  {
  country: "Singapore",
  totalScore: 0.313,
  sectorDetails: {
    ai: {
      algorithms:             0.05,
      computing_power:        0.02,
      data:                   0.40,
      economic_resources:     0.04,
      global_player:          0.75,
      human_capital:          0.07,
      regulatory:             0.00,
      accuracy_of_top_models: 0.00
    },

      quantum: {
        economic_resources: 0.01,
        security: 0.00,
        human_capital: 0.03,
        global_player: 0.00,
        policy_environment: 0.67,
        quantum_sensing: 0.00,
        quantum_communications: 0.51,
        quantum_computing: 0.11
      },
      semiconductors: {
        economic_resources: 0.20,
        human_capital: 0.05,
        global_player: 0.02,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.01,
        security: 0.73,
        human_capital: 0.01,
        global_player: 0.80,
        regulatory: 0.24,
        agricultural_technology: 0.23,
        vaccine_research: 0.03,
        pharmaceutical_production: 0.01,
        genetic_engineering: 0.01
      },
      space: {
        economic_resources: 0.07,
        human_capital: 0.00,
        security: 0.00,
        global_player: 0.50,
        regulatory: 0.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.00,
        pnt: 0.00,
        telecommunications: 0.00,
        remote_sensing: 0.51
      }
    }
  },
{
  country: "South Korea",
  totalScore: 0.390,
  sectorDetails: {
    ai: {
      algorithms:             0.00,
      computing_power:        0.07,
      data:                   0.53,
      economic_resources:     0.04,
      global_player:          0.20,
      human_capital:          0.13,
      regulatory:             0.48,
      accuracy_of_top_models: 0.00
    },
      quantum: {
        economic_resources: 0.03,
        security: 1.00,
        human_capital: 0.02,
        global_player: 0.50,
        policy_environment: 0.58,
        quantum_sensing: 0.06,
        quantum_communications: 0.35,
        quantum_computing: 0.20
      },
      semiconductors: {
        economic_resources: 0.10,
        human_capital: 0.22,
        global_player: 0.11,
        regulatory: 1.00,
        raw_materials: 0.64,
        chip_design: 0.24,
        manufacturing: 0.71,
        equipment: 0.06,
        assembly_testing: 0.30
      },
      biotech: {
        economic_resources: 0.16,
        security: 0.82,
        human_capital: 0.05,
        global_player: 0.80,
        regulatory: 0.90,
        agricultural_technology: 0.44,
        vaccine_research: 0.09,
        pharmaceutical_production: 0.09,
        genetic_engineering: 0.04
      },
      space: {
        economic_resources: 0.01,
        human_capital: 0.06,
        security: 0.34,
        global_player: 0.50,
        regulatory: 1.00,
        domestic_launch_capability: 0.01,
        science_exploration: 0.00,
        pnt: 0.17,
        telecommunications: 0.00,
        remote_sensing: 0.51
      }
    }
  },
 {
  country: "Spain",
  totalScore: 0.235,
  sectorDetails: {
    ai: {
      algorithms:             0.00,
      computing_power:        0.02,
      data:                   0.42,
      economic_resources:     0.01,
      global_player:          0.35,
      human_capital:          0.09,
      regulatory:             0.48,
      accuracy_of_top_models: 0.00
    },
      quantum: {
        economic_resources: 0.01,
        security: 0.50,
        human_capital: 0.08,
        global_player: 0.50,
        policy_environment: 0.67,
        quantum_sensing: 0.05,
        quantum_communications: 0.19,
        quantum_computing: 0.11
      },
      semiconductors: {
        economic_resources: 0.02,
        human_capital: 0.06,
        global_player: 0.05,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.02
      },
      biotech: {
        economic_resources: 0.02,
        security: 0.74,
        human_capital: 0.05,
        global_player: 0.80,
        regulatory: 0.19,
        agricultural_technology: 0.87,
        vaccine_research: 0.11,
        pharmaceutical_production: 0.01,
        genetic_engineering: 0.05
      },
      space: {
        economic_resources: 0.01,
        human_capital: 0.04,
        security: 0.01,
        global_player: 0.50,
        regulatory: 1.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.11,
        pnt: 0.67,
        telecommunications: 0.00,
        remote_sensing: 0.26
      }
    }
  },
  {
    country: "Taiwan",
    totalScore: 0.313,
    sectorDetails: {
      ai: {
        algorithms: 0.00,
        computing_power: 0.03,
        data: 0.42,
        economic_resources: 0.00,
        global_player: 0.00,
        human_capital: 0.06,
        regulatory: 0.00,
        accuracy_of_top_models: 0.00  
      },
      quantum: {
        economic_resources: 0.02,
        security: 0.00,
        human_capital: 0.04,
        global_player: 0.00,
        policy_environment: 0.58,
        quantum_sensing: 0.00,
        quantum_communications: 0.00,
        quantum_computing: 0.35
      },
      semiconductors: {
        economic_resources: 0.26,
        human_capital: 0.19,
        global_player: 0.11,
        regulatory: 1.00,
        raw_materials: 1.00,
        chip_design: 0.15,
        manufacturing: 0.75,
        equipment: 0.00,
        assembly_testing: 0.93
      },
      biotech: {
        economic_resources: 0.07,
        security: 0.56,
        human_capital: 0.01,
        global_player: 0.00,
        regulatory: 0.76,
        agricultural_technology: 0.38,
        vaccine_research: 0.06,
        pharmaceutical_production: 0.01,
        genetic_engineering: 0.01
      },
      space: {
        economic_resources: 0.00,
        human_capital: 0.02,
        security: 0.17,
        global_player: 0.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.00,
        pnt: 0.00,
        telecommunications: 0.00,
        remote_sensing: 0.50
      }
    }
  },
  {
    country: "Turkey",
    totalScore: 0.162,
    sectorDetails: {
      ai: {
        algorithms: 0.00,
        computing_power: 0.00,
        data: 0.28,
        economic_resources: 0.00,
        global_player: 0.48,
        human_capital: 0.06,
        regulatory: 0.00,
        accuracy_of_top_models: 0.00  
      },
      quantum: {
        economic_resources: 0.00,
        security: 0.00,
        human_capital: 0.07,
        global_player: 0.50,
        policy_environment: 0.08,
        quantum_sensing: 0.00,
        quantum_communications: 0.00,
        quantum_computing: 0.01
      },
      semiconductors: {
        economic_resources: 0.00,
        human_capital: 0.01,
        global_player: 0.00,
        regulatory: 0.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.04,
        security: 0.53,
        human_capital: 0.01,
        global_player: 0.80,
        regulatory: 0.57,
        agricultural_technology: 0.09,
        vaccine_research: 0.10,
        pharmaceutical_production: 0.00,
        genetic_engineering: 0.01
      },
      space: {
        economic_resources: 0.00,
        human_capital: 0.07,
        security: 0.17,
        global_player: 0.00,
        regulatory: 0.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.00,
        pnt: 0.17,
        telecommunications: 0.00,
        remote_sensing: 0.51
      }
    }
  },
  {
    country: "U.A.E.",
    totalScore: 0.123,
    sectorDetails: {
      ai: {
        algorithms: 0.05,
        computing_power: 0.01,
        data: 0.44,
        economic_resources: 0.00,
        global_player: 0.11,
        human_capital: 0.03,
        regulatory: 0.04,
        accuracy_of_top_models: 0.04  
      },
      quantum: {
        economic_resources: 0.01,
        security: 0.00,
        human_capital: 0.02,
        global_player: 0.25,
        policy_environment: 0.33,
        quantum_sensing: 0.00,
        quantum_communications: 0.00,
        quantum_computing: 0.17
      },
      semiconductors: {
        economic_resources: 0.00,
        human_capital: 0.01,
        global_player: 0.02,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.00,
        security: 0.38,
        human_capital: 0.00,
        global_player: 0.80,
        regulatory: 0.62,
        agricultural_technology: 0.00,
        vaccine_research: 0.08,
        pharmaceutical_production: 0.00,
        genetic_engineering: 0.00
      },
      space: {
        economic_resources: 0.01,
        human_capital: 0.00,
        security: 0.01,
        global_player: 0.50,
        regulatory: 1.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.00,
        pnt: 0.17,
        telecommunications: 0.00,
        remote_sensing: 0.01
      }
    }
  },
  {
    country: "Ukraine",
    totalScore: 0.097,
    sectorDetails: {
      ai: {
        algorithms: 0.00,
        computing_power: 0.00,
        data: 0.22,
        economic_resources: 0.00,
        global_player: 0.02,
        human_capital: 0.01,
        regulatory: 0.00,
        accuracy_of_top_models: 0.00  
      },
      quantum: {
        economic_resources: 0.00,
        security: 0.00,
        human_capital: 0.03,
        global_player: 0.00,
        policy_environment: 0.00,
        quantum_sensing: 0.00,
        quantum_communications: 0.00,
        quantum_computing: 0.00
      },
      semiconductors: {
        economic_resources: 0.00,
        human_capital: 0.00,
        global_player: 0.00,
        regulatory: 0.00,
        raw_materials: 0.00,
        chip_design: 0.00,
        manufacturing: 0.00,
        equipment: 0.00,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.00,
        security: 0.34,
        human_capital: 0.00,
        global_player: 0.80,
        regulatory: 0.62,
        agricultural_technology: 0.00,
        vaccine_research: 0.02,
        pharmaceutical_production: 0.00,
        genetic_engineering: 0.01
      },
      space: {
        economic_resources: 0.00,
        human_capital: 0.02,
        security: 0.00,
        global_player: 0.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.00,
        pnt: 0.00,
        telecommunications: 0.00,
        remote_sensing: 0.25
      }
    }
  },
  {
  country: "United Kingdom",
  totalScore: 0.457,                // leave unchanged for now
  sectorDetails: {
    ai: {
      algorithms:             0.07,
      computing_power:        0.09,   // updated
      data:                   0.49,   // updated
      economic_resources:     0.06,
      global_player:          0.82,
      human_capital:          0.25,
      regulatory:             0.35,
      accuracy_of_top_models: 0.00    // added
    },
      quantum: {
        economic_resources: 0.34,
        security: 1.00,
        human_capital: 0.28,
        global_player: 1.00,
        policy_environment: 1.00,
        quantum_sensing: 0.13,
        quantum_communications: 0.56,
        quantum_computing: 0.44
      },
      semiconductors: {
        economic_resources: 0.01,
        human_capital: 0.07,
        global_player: 0.24,
        regulatory: 1.00,
        raw_materials: 0.00,
        chip_design: 0.18,
        manufacturing: 0.00,
        equipment: 0.02,
        assembly_testing: 0.00
      },
      biotech: {
        economic_resources: 0.09,
        security: 0.87,
        human_capital: 0.18,
        global_player: 0.80,
        regulatory: 0.76,
        agricultural_technology: 0.37,
        vaccine_research: 0.25,
        pharmaceutical_production: 0.06,
        genetic_engineering: 0.17
      },
      space: {
        economic_resources: 0.04,
        human_capital: 0.09,
        security: 0.18,
        global_player: 1.00,
        regulatory: 1.00,
        domestic_launch_capability: 0.00,
        science_exploration: 0.11,
        pnt: 0.67,
        telecommunications: 0.14,
        remote_sensing: 0.51
      }
    }
  }
];