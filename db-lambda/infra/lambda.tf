
data "aws_ecr_image" "lambda_image" {
  depends_on = [
    null_resource.ecr_image
  ]
  repository_name = local.prefix
  image_tag       = local.ecr_image_tag
}


resource "aws_lambda_function" "spark" {
  depends_on    = [null_resource.ecr_image]
  function_name = local.prefix
  role          = aws_iam_role.lambda.arn
  timeout       = 60
  memory_size   = 256
  image_uri     = "${aws_ecr_repository.repo.repository_url}@${data.aws_ecr_image.lambda_image.id}"
  package_type  = "Image"
}
