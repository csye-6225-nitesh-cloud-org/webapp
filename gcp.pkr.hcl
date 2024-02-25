packer {
  required_plugins {
    googlecompute = {
      version = "~> 1"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

variable "environment" {
  type = string
}

variable "project_name" {
  type = string
}

variable "source_image_family" {
  type = string

}

variable "ssh_username" {
  type = string

}

variable "zone" {
  type = string

}

variable "machineType" {
  type = string

}

variable "diskType" {
  type = string

}

variable "diskSize" {
  type = number

}

variable "image_family_name" {
  type = string
}

variable "image_name" {
  type = string
}

source "googlecompute" "centos" {
  project_id          = var.project_name
  source_image_family = var.source_image_family
  image_name          = "${var.image_name}-{{timestamp}}"
  image_family        = "${var.environment}-${var.image_family_name}"
  zone                = var.zone
  ssh_username        = var.ssh_username
  machine_type        = var.machineType
  disk_size           = var.diskSize
  disk_type           = var.diskType
  tags                = ["webapp", "internet"]

}
build {
  sources = ["source.googlecompute.centos"]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "./webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    scripts = [
      "scripts/create-user.sh",
      "scripts/setup.sh",
      "scripts/app-setup.sh",
      "scripts/systemd.sh"
    ]
  }
}
