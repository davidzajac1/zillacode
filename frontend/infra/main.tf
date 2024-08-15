terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket         = "<TF_BUCKET_HERE>"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "<TF_LOCKTABLE_HERE>"
  }
}


provider "aws" {
  region = "us-east-1"
}


data "aws_caller_identity" "current" {}


variable "ENV" {
  type = string
}


variable "buckets" {
  type = map(any)
  default = {
    "dev"  = "<DEV_FRONTEND_BUCKET_HERE>"
    "prod" = "<PROD_FRONTEND_BUCKET_HERE>"
  }
}


variable "aliases" {
  type = map(any)
  default = {
    "dev"  = ["<DEV_URL_HERE>", "www.<DEV_URL_HERE>"]
    "prod" = ["<PROD_URL_HERE>", "www.<PROD_URL_HERE>"]
  }
}


variable "certificates" {
  type = map(any)
  default = {
    "dev"  = "<DEV_CERTIFICATE_ID_HERE>"
    "prod" = "<PROD_CERTIFICATE_ID_HERE>"
  }
}
