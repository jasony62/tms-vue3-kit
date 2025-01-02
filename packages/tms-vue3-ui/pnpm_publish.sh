#!/bin/bash

# 设置最大尝试次数
MAX_ATTEMPTS=5
# 设置每次尝试之间的等待时间（秒）
WAIT_TIME=10
# 初始化尝试计数器
ATTEMPT=0

# 开始循环尝试发布
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  # 增加尝试计数
  ATTEMPT=$((ATTEMPT+1))
  
  echo "Attempt $ATTEMPT to publish npm package..."
  
  # 尝试发布npm包
  pnpm publish && {
    echo "Successfully published npm package!"
    exit 0
  }
  
  # 如果发布失败，检查是否达到了最大尝试次数
  if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
    echo "Publish failed, waiting $WAIT_TIME seconds before retrying..."
    sleep $WAIT_TIME
  else
    echo "Reached max attempts. Please check the error and try again."
  fi
done

exit 1
