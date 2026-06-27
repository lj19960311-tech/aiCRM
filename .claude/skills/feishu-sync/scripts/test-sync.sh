#!/bin/bash
# 飞书同步脚本 - 快速测试

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 飞书同步脚本 - 快速测试${NC}"
echo ""

# 检查环境变量
if [ -z "$FEISHU_APP_ID" ] || [ -z "$FEISHU_APP_SECRET" ]; then
    echo -e "${RED}❌ 错误：缺少环境变量${NC}"
    echo "请配置："
    echo "  export FEISHU_APP_ID=cli_xxx"
    echo "  export FEISHU_APP_SECRET=xxx"
    exit 1
fi

echo -e "${GREEN}✅ 环境变量检查通过${NC}"
echo "  App ID: ${FEISHU_APP_ID:0:8}..."
echo ""

# 测试文件路径
TEST_FILE="./prd/test/飞书同步测试文档.md"

if [ ! -f "$TEST_FILE" ]; then
    echo -e "${RED}❌ 测试文件不存在：$TEST_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}📄 开始同步测试文档...${NC}"
echo "文件：$TEST_FILE"
echo ""

# 运行同步脚本
START_TIME=$(date +%s)
node .claude/skills/feishu-sync/scripts/feishu-sync.js "$TEST_FILE"
EXIT_CODE=$?

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ 同步成功！${NC}"
    echo -e "${GREEN}⏱ 总耗时：${DURATION}秒${NC}"

    if [ $DURATION -le 60 ]; then
        echo -e "${GREEN}🎯 性能达标：耗时 <60秒${NC}"
    elif [ $DURATION -le 120 ]; then
        echo -e "${YELLOW}⚠️  性能接近：耗时 <120秒（目标范围内）${NC}"
    else
        echo -e "${RED}❌ 性能未达标：耗时 >120秒${NC}"
    fi
else
    echo -e "${RED}❌ 同步失败！${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔍 请手动验证：${NC}"
echo "1. 打开飞书文档链接，检查格式"
echo "2. 点击表格链接，验证是否为真实表格"
echo "3. 点击画板链接，验证流程图是否正确"
echo "4. 检查代码块语法高亮"
