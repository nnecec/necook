

```bash
git init

git clone

git add
# 将文件当前状态添加到已暂存状态
```

```Bash
git status [-s]
# 查看当前文件状态
# -s 简览
```

```bash
cat .gitignore
# (*)匹配零个或多个任意字符
# ([abc])匹配任何一个列在方括号中的字符
# (?)匹配一个任意字符
# ([0-9])匹配两个字符范围内的字符
# (**)匹配任意中间目录
```

```Bash
git diff [--cached|--staged]
# 比较当前文件和暂存区域快照之间的差异
# --cached|--staged 查看已暂存的将要添加到下次提交里的内容
```

```Bash
git commit [-m][-a][--amend]
# 提交更新，自动启动文本编辑器以便输入本次提交的说明。
# -m 将提交信息与命令后放在一行
# -a 把所有已经跟踪过的文件暂存起来一并提交，从而跳过git add步骤
# --amend 用本次提交代替之前提交的结果
```

```	Bash
git rm [-f][--cached]
# 从Git移除某个文件
# -f 如果删除之前修改过文件并已提交到暂存区域
# --cached 从Git仓库中删除，但仍保留在工作目录中
```

```bash
git mv file_from file_to
# 移动文件 
```

```bash
git log [-p][-2][--stat][--pretty]
# 查看提交历史
# -p 显示每次提交的内容差异
# -2 显示最近2次的提交
# --stat 查看每次提交的简略统计信息
# --pretty 指定使用不同于默认格式的方式展示提交历史
# --shortstat 只显示 --stat 中最后的行数修改添加移除统计
# --name-only 仅在提交信息后显示已修改的文件清单
# --name-status 显示新增、修改、删除的文件清单
# --abbrev-commit 仅显示 SHA-1 的前几个字符，而非所有的 40 个字符
# --relative-date 使用较短的相对时间显示（比如，“2 weeks ago”）
# --graph 显示 ASCII 图形表示的分支合并历史
# --pretty 使用其他格式显示历史提交信息。可用的选项包括 oneline，short，full，fuller 和 format（后跟指定格式）。”
# --pretty=oneline/short/full/fuller|--pretty=format:"%h - %an, %ar : %s
```

```Bash
git reset HEAD <file>
# 取消暂存，将文件改为修改未暂存的状态
```

```Bash
git checkout — [file]
# 撤销对文件的修改
```

```Bash
git remote [-v]
# 列出指定的每一个远程服务器的简写
# -v 显示需要读写远程仓库使用的 Git 保存的简写与其对应的 URL
```

```Bash
git remote add <shortname> <url>
# 添加远程仓库

git fetch [remote-name]
# 从远程仓库获取数据

git pull 
# 通常会从最初克隆的服务器上抓取数据并自动尝试合并到当前所在的分支

git push [remote-name] [branch-name]
# 推送到远程仓库

git remote show [remote-name]
# 查看远程仓库
```

```Bash
git remote rename old-name new-name
# 重命名远程仓库

git remote rm repo-name
# 移除一个远程仓库
```

```Bash
git tag
# 列出标签

git tag -a v1.4 -m 'my version 1.4'
# 附注标签

git tag v1.4
# 轻量标签

git tag -a v1.2 9fceb02
# 补打标签

git push origin [v1.5] [--tags]
# git push 并不会传送标签到远程仓库服务器上，必须显示地推送标签到共享服务器上
# --tags 把所有不在远程仓库服务器上的标签全部传送

git checkout -b [branchname] [tagname]
# 在特定的标签上检出新分支
```

```Bash
git config --global alias.st status
# Git 别名
```

```Bash
git branch branch_name
# 创建新分支

git log --decorate
# --decorate 查看各个分支当前所指的对象

git checkout branch_name
# 切换分支

git log --oneline --decorate --graph --all
# 输出提交历史、各个分支的指向以及项目的分支分叉情况
```

```Bash
git checkout -b iss53
# 它是下面两条命令的简写：git branch iss53 + git checkout iss53”

git merge branch_name
# 将分支合并到当前分支

git branch [-d][-D] branch_name
# 删除分支
# -D 强制删除
```

```Bash
git branch [-v][--merged|--no-merged]
# 列出所有分支
# -v 查看每一个分支的最后一次提交
# --merged|--no-merged 过滤列表中已经合并或尚未合并到当前分支的分支
```

```Bash
git ls-remote(remote)
# 显示地获得远程引用的完整列表

git clone -o origin_name
# 设置默认远程分支名称并克隆

git remote add remote_name
# 添加远程仓库

git fetch remote_name/branch_name
# 拉去仓库／分支更新

git push (remote) [branch]
# 推送分支更新

git checkout --track origin/serverfix
# 跟踪分支

git checkout -b sf origin/serverfix
# 设置本地分支sf从`origin/serverfix`拉取

git branch -u origin/serverfix
# 修改已有的本地分支正在跟踪的上游分支

git branch -vv
# 将所有的本地分支列出来并且包含更多的信息

git push origin --delete serverfix
# 删除远程分支
```

```Bash
git rebase branch_name
# 将当前变基到branch_name上

git rebase --onto master server client
# 取出 client 分支，找出处于 client 分支和 server 分支的共同祖先之后的修改，然后把它们在 master 分支上重演一遍


```

