export function getEnv(varname: string): string {
  const envString = process.env[`VITE_${varname}`] || "";
  return envString;
}