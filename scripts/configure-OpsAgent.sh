#!/bin/bash

echo "************************Installing OPS Agent**************************"
sudo curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
#https://linuxize.com/post/linux-tee-command/
cat <<EOF | sudo tee /etc/google-cloud-ops-agent/config.yaml > /dev/null
logging:
  receivers:
    webapp-receiver:
      type: files
      include_paths:
        - /var/log/webapp/webapp.log
      record_log_file_path: true
  processors:
    webapp-processor:
      type: parse_json
      time_key: timestamp
      time_format: "%Y-%m-%dT%H:%M:%S.%LZ"
    adjust_severity:
      type: modify_fields
      fields:
        severity:
          move_from: jsonPayload.severity
  service:
    pipelines:
      default_pipeline:
        receivers: [webapp-receiver]
        processors: [webapp-processor, adjust_severity]
EOF

echo "Restarting Google Cloud Ops Agent..."
sudo systemctl restart google-cloud-ops-agent
