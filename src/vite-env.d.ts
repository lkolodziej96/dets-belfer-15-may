/// <reference types="vite/client" />

declare module '*.xlsx?embed' {
  const content: ExcelData[];
  export default content;
}
