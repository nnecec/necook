```Bash
docker pull [选项] [Docker Registry地址]<仓库名>:<标签>
# 下载镜像

docker run -it --rm ubuntu:14.04 bash
# 运行镜像

docker images 
# 列出已下载镜像

docker rmi (docker images -q -f dangling=true)
# 删除虚悬镜像

docker iamges -a
# 显示中间层镜像

docker images [ubuntu][--filter|-f]
# 显示部分镜像

docker images -q
# 所有镜像的ID

docker images --format "{{.ID}}: {{.Repository}}”
# 以特定格式显示
```

```Bash
docker run --name webserver -d -p 80:80 nginx
# 用 nginx 镜像启动一个容器，命名为 webserver，并且映射了 80 端口

docker exec -it webserver bash
# 进入容器修改内容

docker diff
# 查看具体改动

docker commit
# 将容器的存储层保存下来成为镜像

docker history
# 查看镜像内的历史记录
```

Dockerfile

FROM指定基础镜像，RUN执行命令，使用`&&`串联命令减少层数。

```Bash
docker build -t nginx:v3 .
# 构建镜像


```

