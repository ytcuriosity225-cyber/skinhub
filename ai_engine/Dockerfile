FROM python:3.11-slim

WORKDIR /app

# Install minimal build dependencies required by some packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential git curl && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy application source
COPY . /app

# Cloud Run expects the container to listen on the port defined by $PORT (default 8080)
ENV PORT=8080
EXPOSE 8080

# Start Uvicorn on port 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
