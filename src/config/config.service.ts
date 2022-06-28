import * as dotEnv from 'dotenv';

dotEnv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private toNumber(value: string): number {
    return parseInt(value, 10);
  }

  private toBool(value: string): boolean {
    return value === 'true';
  }

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public getValueOptional(key: string): string | undefined {
    return this.env[key];
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValueOptional('PORT');
  }

  public getPrettyPrint() {
    const value = this.getValueOptional('PRETTY_PRINT');
    return value && this.toBool(value);
  }

  public getLogLevel() {
    return this.getValueOptional('LOG_LEVEL');
  }

  public getTimeoutExternal() {
    return this.toNumber(this.getValueOptional('EXTERNAL_TIMEOUT') || '5000');
  }
}

const configService = new ConfigService(process.env);

configService.ensureValues(['IAM_API']);

export { configService };
