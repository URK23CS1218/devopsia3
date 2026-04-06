# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FILE 10: terraform/outputs.tf (FINAL)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ── Namespace Name ──────────────────────────────────────────
output "namespace_name" {
  description = "Kubernetes namespace name"
  value       = kubernetes_namespace.myapp.metadata[0].name
}

# ── Namespace UID ───────────────────────────────────────────
output "namespace_uid" {
  description = "Kubernetes namespace UID"
  value       = kubernetes_namespace.myapp.metadata[0].uid
}

# ── Labels (useful for debugging & verification) ────────────
output "namespace_labels" {
  description = "Labels applied to namespace"
  value       = kubernetes_namespace.myapp.metadata[0].labels
}

# ── Resource Quota Name ─────────────────────────────────────
output "resource_quota_name" {
  description = "Quota name"
  value       = kubernetes_resource_quota.myapp.metadata[0].name
}

# ── Secret Name (important for app) ─────────────────────────
output "secret_name" {
  description = "Kubernetes secret name"
  value       = kubernetes_secret.app_secrets.metadata[0].name
  sensitive   = true
}
