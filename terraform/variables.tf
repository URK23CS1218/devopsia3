# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FILE 9: terraform/variables.tf (FINAL)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ── Kubernetes Config Path ────────────────────────────────
variable "kubeconfig_path" {
  description = "Path to kubeconfig file"
  type        = string
  default     = "~/.kube/config"
}

# ── Kubernetes Context ────────────────────────────────────
variable "kube_context" {
  description = "Kubernetes context to use"
  type        = string
  default     = "docker-desktop"
}

# ── Namespace ─────────────────────────────────────────────
variable "namespace" {
  description = "Kubernetes namespace"
  type        = string
  default     = "myapp-prod"
}

# ── Environment ───────────────────────────────────────────
variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

# ── Sensitive: Database URL ───────────────────────────────
variable "db_url" {
  description = "Database connection string"
  type        = string
  sensitive   = true
}

# ── Sensitive: API Key ────────────────────────────────────
variable "api_key" {
  description = "Application API key"
  type        = string
  sensitive   = true
}
