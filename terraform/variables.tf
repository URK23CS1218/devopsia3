# ============================================================
# Input Variables for Terraform Configuration
# ============================================================

variable "namespace" {
  description = "Kubernetes namespace for the application"
  type        = string
  default     = "devsecops-app"
}

variable "app_name" {
  description = "Application name used for labeling resources"
  type        = string
  default     = "devsecops-webapp"
}

variable "environment" {
  description = "Deployment environment (development, staging, production)"
  type        = string
  default     = "production"
}

variable "kubeconfig_path" {
  description = "Path to the kubeconfig file"
  type        = string
  default     = "~/.kube/config"
}
