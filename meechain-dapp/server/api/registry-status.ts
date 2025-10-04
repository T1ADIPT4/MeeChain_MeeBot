
import type { Request, Response } from "express";
import { loadDeployRegistry, validateDeployRegistry } from "../../backend/api/registry-utils";

export async function getRegistryStatus(req: Request, res: Response) {
  try {
    const registry = loadDeployRegistry();
    
    if (!registry) {
      return res.status(404).json({
        status: "not_found",
        message: "Deploy registry not found",
        registry: null,
        validation: null
      });
    }

    const validation = validateDeployRegistry(registry);
    
    res.json({
      status: validation.isValid ? "valid" : "invalid",
      message: validation.isValid 
        ? "Registry is valid and ready" 
        : `Registry has ${validation.errors.length} errors`,
      registry: {
        network: registry.network,
        environment: registry.metadata.environment,
        version: registry.metadata.version,
        deploymentSuccess: registry.deploymentStatus.success,
        contractCount: Object.keys(registry.contracts).length,
        lastDeployment: registry.deploymentStatus.lastAttempt
      },
      validation: {
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings
      }
    });

  } catch (error) {
    console.error("Registry status check failed:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to check registry status",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
