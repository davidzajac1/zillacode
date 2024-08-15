
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


variable "region" {
  default = "us-east-1"
}


provider "aws" {
  region = var.region
}


data "aws_caller_identity" "current" {}


variable "ENV" {
  type = string
}



locals {
  prefix        = "spark-lambda-${var.ENV}"
  account_id    = data.aws_caller_identity.current.account_id
  ecr_image_tag = "latest"
}
