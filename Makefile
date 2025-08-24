# Variables
REGION := us-east-1
ENDPOINT_URL := http://localhost:4566
QUEUE_URL := http://sqs.$(REGION).localhost.localstack.cloud:4566/000000000000/$(QUEUE_NAME)

# AWS CLI Commands
CREATE_QUEUE_CMD := aws sqs create-queue --queue-name $(QUEUE_NAME) --region $(REGION) --endpoint-url=$(ENDPOINT_URL)
PURGE_QUEUE_CMD := aws sqs purge-queue --endpoint-url=$(ENDPOINT_URL) --queue-url
RECEIVE_QUEUE_CMD := aws sqs receive-message --endpoint-url=$(ENDPOINT_URL) --queue-url $(QUEUE_URL)
DELETE_QUEUE_CMD := aws sqs delete-queue --endpoint-url=$(ENDPOINT_URL) --queue-url $(QUEUE_URL)
LIST_QUEUE_CMD := aws sqs list-queues --endpoint-url=$(ENDPOINT_URL)

define validate_envs
    ifndef QUEUE_NAME
		$(error QUEUE_NAME is not defined. Please provide it as a parameter, e.g., 'make <target> QUEUE_NAME=<queue-name>')
	endif
endef

all: ## Show usage
	@echo "Available targets:"
	@echo "  create  - Create an SQS queue"
	@echo "  receive  - Receive an SQS queue"
	@echo "  purge_all   - Purge messages from all the SQS queues"
	@echo "  delete  - Delete the SQS queue"
	@echo "  list  - List SQS queues"

create: ## Create an SQS queue
	@echo "Creating SQS queue: $(QUEUE_NAME) in region $(REGION) with endpoint $(ENDPOINT_URL)..."
	@$(CREATE_QUEUE_CMD)

purge_all: ## Purge messages from the SQS queue
	@$(LIST_QUEUE_CMD) | jq -r '.QueueUrls[]' | while read -r queue_url; do \
		echo "Purging queue: $$queue_url"; \
		$(PURGE_QUEUE_CMD) $$queue_url; \
	done

receive: ## Receive messages from the SQS queue
	@echo "Receiving SQS queue: $(QUEUE_NAME) at $(QUEUE_URL)..."
	@$(RECEIVE_QUEUE_CMD)

delete: ## Delete the SQS queue
	@echo "Deleting SQS queue: $(QUEUE_NAME) at $(QUEUE_URL)..."
	@$(DELETE_QUEUE_CMD)

list: ## Listing the SQS queue
	@echo "Listing SQS queues: $(QUEUE_NAME) at $(QUEUE_URL)..."
	@$(LIST_QUEUE_CMD)

.PHONY: all create purge_all receive delete list%

compose_up:
	@docker-compose up -d

compose_down:
	@docker-compose down

aws_dev:
	@aws configure set aws_access_key_id test
	@aws configure set aws_secret_access_key test
	@aws configure set aws_region us-east-1

dev: compose_down
dev: compose_up
dev: aws_dev
dev: ## Prepare development environment
	@aws --no-cli-pager --region us-east-1 --endpoint-url=http://localhost:4566 sqs create-queue --queue-name registries-queue | jq -r '.QueueUrl'
	@aws --no-cli-pager --region us-east-1 --endpoint-url=http://localhost:4566 sqs create-queue --queue-name dependencies-queue | jq -r '.QueueUrl'
	@aws --no-cli-pager --region us-east-1 --endpoint-url=http://localhost:4566 sqs create-queue --queue-name jobs-queue | jq -r '.QueueUrl'

	@echo "Development environment is up and running"
