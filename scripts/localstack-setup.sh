echo "Initializing localstack s3"

awslocal sqs create-queue --queue-name job-dependencies-queue
