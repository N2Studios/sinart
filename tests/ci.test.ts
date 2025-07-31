import { describe, it, expect } from 'vitest';

describe('CI/CD Pipeline', () => {
  it('verifies Node.js version', () => {
    expect(process.version).toMatch(/v24\.4\.0/);
  });

  it('verifies Yarn version', async () => {
    const { execa } = await import('execa');
    const { stdout } = await execa('yarn', ['--version']);
    expect(stdout).toBe('1.22.19');
  });

  it('verifies Git version', async () => {
    const { execa } = await import('execa');
    const { stdout } = await execa('git', ['--version']);
    expect(stdout).toMatch(/2\.50\.1/);
  });

  it('verifies Rust version', async () => {
    const { execa } = await import('execa');
    const { stdout } = await execa('cargo', ['--version']);
    expect(stdout).toMatch(/1\.88\.0/);
  });

  it('verifies Pinata environment variable', () => {
    expect(process.env.PINATA_API_KEY).toBeDefined();
  });

  it('verifies Nx installation', async () => {
    const { execa } = await import('execa');
    const { stdout } = await execa('npx', ['nx', '--version']);
    expect(stdout).toMatch(/19\.0\.0/);
  });
}); 