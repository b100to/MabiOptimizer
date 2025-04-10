#!/bin/bash

# 변수 설정
DOMAIN="huik.site"
REGION="ap-northeast-2"
HOSTED_ZONE_ID="Z08847933G4RYBBK3V7RW"  # Route 53 호스팅 영역 ID

# S3 버킷 생성
echo "Creating S3 bucket..."
aws s3api create-bucket \
    --bucket $DOMAIN \
    --region $REGION \
    --create-bucket-configuration LocationConstraint=$REGION

# 퍼블릭 액세스 차단 설정 해제
echo "Configuring public access..."
aws s3api put-public-access-block \
    --bucket $DOMAIN \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# 버킷 정책 설정
echo "Setting bucket policy..."
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::${DOMAIN}/*"
            ]
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket $DOMAIN \
    --policy file://bucket-policy.json

# 정적 웹사이트 호스팅 설정
echo "Configuring static website hosting..."
aws s3api put-bucket-website \
    --bucket $DOMAIN \
    --website-configuration '{
        "IndexDocument": {
            "Suffix": "index.html"
        },
        "ErrorDocument": {
            "Key": "index.html"
        }
    }'

# index.html 파일 업로드
echo "Uploading index.html..."
aws s3 cp root-domain-index.html s3://${DOMAIN}/index.html \
    --content-type "text/html" \
    --cache-control "max-age=3600"

# S3 웹사이트 엔드포인트 가져오기
WEBSITE_ENDPOINT="${DOMAIN}.s3-website.${REGION}.amazonaws.com"

# CloudFront 배포 설정 파일 생성
echo "Creating CloudFront configuration..."
cat > cloudfront-config.json << EOF
{
    "Comment": "Distribution for ${DOMAIN}",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3Origin",
                "DomainName": "${WEBSITE_ENDPOINT}",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only",
                    "OriginSslProtocols": {
                        "Quantity": 1,
                        "Items": ["TLSv1.2"]
                    }
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3Origin",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["HEAD", "GET"],
            "CachedMethods": {
                "Quantity": 2,
                "Items": ["HEAD", "GET"]
            }
        },
        "Compress": true,
        "DefaultTTL": 3600,
        "MinTTL": 0,
        "MaxTTL": 86400,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        }
    },
    "Enabled": true,
    "Aliases": {
        "Quantity": 1,
        "Items": ["${DOMAIN}"]
    },
    "CallerReference": "$(date +%s)",
    "ViewerCertificate": {
        "ACMCertificateArn": "${CERTIFICATE_ARN}",
        "SSLSupportMethod": "sni-only",
        "MinimumProtocolVersion": "TLSv1.2_2021"
    },
    "HttpVersion": "http2",
    "PriceClass": "PriceClass_100"
}
EOF

# CloudFront 배포 생성 및 ID 저장
echo "Creating CloudFront distribution and waiting for deployment..."
DISTRIBUTION_INFO=$(aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json)
DISTRIBUTION_ID=$(echo "$DISTRIBUTION_INFO" | jq -r '.Distribution.Id')
CLOUDFRONT_DOMAIN=$(echo "$DISTRIBUTION_INFO" | jq -r '.Distribution.DomainName')

if [ -z "$DISTRIBUTION_ID" ] || [ -z "$CLOUDFRONT_DOMAIN" ]; then
    echo "Error: Failed to create CloudFront distribution"
    exit 1
fi

echo "Waiting for CloudFront distribution to be deployed..."
while true; do
    STATUS=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.Status' --output text)
    if [ "$STATUS" = "Deployed" ]; then
        break
    fi
    echo "CloudFront distribution status: $STATUS. Waiting..."
    sleep 30
done

# Route 53 레코드 설정 (CloudFront로 연결)
echo "Creating Route 53 record..."
cat > route53-change.json << EOF
{
    "Comment": "Creating alias record for root domain",
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "${DOMAIN}",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "Z2FDTNDATAQYW2",
                    "DNSName": "${CLOUDFRONT_DOMAIN}",
                    "EvaluateTargetHealth": false
                }
            }
        }
    ]
}
EOF

CHANGE_ID=$(aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file://route53-change.json \
    --query 'ChangeInfo.Id' \
    --output text)

echo "Waiting for DNS changes to propagate..."
aws route53 wait resource-record-sets-changed --id $CHANGE_ID

# 임시 파일 정리
rm bucket-policy.json route53-change.json cloudfront-config.json

echo "Setup completed!"
echo "CloudFront Distribution ID: ${DISTRIBUTION_ID}"
echo "CloudFront Domain: ${CLOUDFRONT_DOMAIN}"
echo "Testing S3 website endpoint..."
curl -I "http://${WEBSITE_ENDPOINT}"
echo "Testing CloudFront domain..."
curl -I "https://${CLOUDFRONT_DOMAIN}"
echo "Please wait a few minutes for DNS propagation..."
echo "You can test the website by visiting https://${DOMAIN}" 