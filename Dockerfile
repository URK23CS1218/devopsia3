# ============================================================
# VULNERABLE Dockerfile — uses full Node.js image
# This version intentionally uses a large base image with
# known CVEs for Trivy to detect during container scanning
# ============================================================

FROM node:18

LABEL maintainer="URK23CS1218"
LABEL description="DevSecOps Demo App — Vulnerable Version"

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application source
COPY app.js ./

# Expose application port
EXPOSE 3000

# Run as root (security issue — Trivy/best practices will flag this)
CMD ["node", "app.js"]
