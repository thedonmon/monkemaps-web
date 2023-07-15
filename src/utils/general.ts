export function getEnv(varname: string): string {
  const envString = process.env[`REACT_APP_${varname}`] || "";
  return envString;
}