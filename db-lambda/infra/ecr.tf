
resource "aws_ecr_repository" "repo" {
  name         = local.prefix
  force_delete = true
}


resource "null_resource" "ecr_image" {
  triggers = {
    python_file = md5(file(replace("${abspath(path.module)}/lambda_function.py", "/infra", "")))
    docker_file = md5(file(replace("${abspath(path.module)}/Dockerfile", "/infra", "")))
  }

  provisioner "local-exec" {
    command     = "cd .. && aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin ${local.account_id}.dkr.ecr.${var.region}.amazonaws.com && docker build -t ${aws_ecr_repository.repo.repository_url}:${local.ecr_image_tag} . && docker push ${aws_ecr_repository.repo.repository_url}:${local.ecr_image_tag} && cd infra"
    interpreter = ["bash", "-c"]
  }
}
