#!/bin/bash

# Schritt 1: Dummy Credentials fuer lokales DynamoDB setzen
aws configure set aws_access_key_id dummy
aws configure set aws_secret_access_key dummy
aws configure set region eu-west-1

# Schritt 2: Tabelle lokal anlegen
aws dynamodb create-table \
  --table-name todoData \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8001

# Schritt 3: Tabelle pruefen
aws dynamodb list-tables --endpoint-url http://localhost:8001
