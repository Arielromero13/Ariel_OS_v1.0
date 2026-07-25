import { ModelConfig, PromptPayload, ModelCompletionResponse } from '../types';

export abstract class BaseModelConnector {
  protected config: ModelConfig;

  constructor(config: ModelConfig) {
    this.config = config;
  }

  public getConfig(): ModelConfig {
    return this.config;
  }

  public abstract executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse>;
}
