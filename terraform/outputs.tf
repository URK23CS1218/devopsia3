# ============================================================
# Terraform Outputs
# ============================================================

output "namespace_name" {
  description = "Name of the created Kubernetes namespace"
  value       = kubernetes_namespace.devsecops.metadata[0].name
}

output "resource_quota" {
  description = "Resource quota details for the namespace"
  value = {
    cpu_requests    = kubernetes_resource_quota.devsecops_quota.spec[0].hard["requests.cpu"]
    memory_requests = kubernetes_resource_quota.devsecops_quota.spec[0].hard["requests.memory"]
    cpu_limits      = kubernetes_resource_quota.devsecops_quota.spec[0].hard["limits.cpu"]
    memory_limits   = kubernetes_resource_quota.devsecops_quota.spec[0].hard["limits.memory"]
    max_pods        = kubernetes_resource_quota.devsecops_quota.spec[0].hard["pods"]
  }
}

output "network_policy" {
  description = "Network policy name applied to the namespace"
  value       = kubernetes_network_policy.devsecops_netpol.metadata[0].name
}
