/**
 * Log Export Utilities for MeeChain
 * Export logs and registry data to JSON/CSV formats
 */
export interface ExportOptions {
    format: 'json' | 'csv';
    outputPath?: string;
    includeRegistry?: boolean;
}
/**
 * Export logs to JSON format
 */
export declare function exportLogsToJSON(outputPath?: string): string;
/**
 * Export logs to CSV format
 */
export declare function exportLogsToCSV(outputPath?: string): string;
/**
 * Export registry to JSON with provenance data
 */
export declare function exportRegistryWithProvenance(outputPath?: string): string;
/**
 * Export function that handles multiple formats
 */
export declare function exportLogs(options: ExportOptions): string;
//# sourceMappingURL=exportLogs.d.ts.map