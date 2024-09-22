interface DialogflowConfig {
    projectId: string;
    agentId: string;
    location?: string;
  }
  
  export const testDialogflowCX = async (config: DialogflowConfig, text: string) => {
    // Implement Dialogflow CX testing logic here
    console.log('Testing Dialogflow CX:', config, text);
    // Return test results
    return { response: "Mock CX response" };
  };
  
  export const testDialogflowES = async (config: DialogflowConfig, text: string) => {
    // Implement Dialogflow ES testing logic here
    console.log('Testing Dialogflow ES:', config, text);
    // Return test results
    return { response: "Mock ES response" };
  };
  